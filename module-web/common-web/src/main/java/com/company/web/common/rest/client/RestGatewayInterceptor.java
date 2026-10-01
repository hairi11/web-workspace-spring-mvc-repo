package com.company.web.common.rest.client;

import java.io.IOException;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public class RestGatewayInterceptor
        implements ClientHttpRequestInterceptor {

    private static final Logger LOGGER =
            Logger.getLogger(
                    RestGatewayInterceptor.class.getName());

    private final int getAttempts;
    private final int retryDelayMs;

    public RestGatewayInterceptor(
            int getAttempts,
            int retryDelayMs) {
        this.getAttempts = Math.max(1, getAttempts);
        this.retryDelayMs = Math.max(0, retryDelayMs);
    }

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution)
            throws IOException {
        applyDefaultHeaders(request.getHeaders());
        logRequest(request);

        int attempts =
                request.getMethod() == HttpMethod.GET
                        ? getAttempts
                        : 1;

        IOException lastException = null;

        for (int attempt = 1;
                attempt <= attempts;
                attempt++) {
            long startedAt =
                    System.nanoTime();

            try {
                ClientHttpResponse response =
                        execution.execute(
                                request,
                                body);

                logResponse(
                        request,
                        response,
                        startedAt,
                        attempt);

                if (shouldRetry(
                        request.getMethod(),
                        response.getRawStatusCode(),
                        attempt,
                        attempts)) {
                    response.close();
                    logRetry(
                            request,
                            attempt,
                            attempts,
                            null);
                    delayBeforeRetry();
                    continue;
                }

                return response;
            } catch (IOException exception) {
                lastException = exception;

                if (request.getMethod()
                                != HttpMethod.GET
                        || attempt >= attempts) {
                    throw exception;
                }

                logRetry(
                        request,
                        attempt,
                        attempts,
                        exception);
                delayBeforeRetry();
            }
        }

        throw lastException != null
                ? lastException
                : new IOException(
                        "REST request failed.");
    }

    private void logRequest(
            HttpRequest request) {
        LOGGER.info(
                "[API] Request "
                        + request.getMethod()
                        + " "
                        + request.getURI()
                        + " headers="
                        + safeHeaders(
                                request.getHeaders()));
    }

    private void logResponse(
            HttpRequest request,
            ClientHttpResponse response,
            long startedAt,
            int attempt)
            throws IOException {
        long elapsedMs =
                (System.nanoTime() - startedAt)
                        / 1_000_000L;

        LOGGER.info(
                "[API] Response "
                        + request.getMethod()
                        + " "
                        + request.getURI()
                        + " -> "
                        + response.getRawStatusCode()
                        + " in "
                        + elapsedMs
                        + " ms"
                        + (attempt > 1
                                ? " attempt=" + attempt
                                : ""));
    }

    private Map<String, String> safeHeaders(
            HttpHeaders headers) {
        Map<String, String> safe =
                new LinkedHashMap<>();

        headers.forEach((name, values) -> {
            if (HttpHeaders.AUTHORIZATION
                            .equalsIgnoreCase(name)
                    || HttpHeaders.COOKIE
                            .equalsIgnoreCase(name)
                    || HttpHeaders.SET_COOKIE
                            .equalsIgnoreCase(name)) {
                safe.put(name, "[REDACTED]");
                return;
            }

            safe.put(
                    name,
                    String.join(",", values));
        });

        return safe;
    }

    private void applyDefaultHeaders(
            HttpHeaders headers) {
        if (headers.getAccept().isEmpty()) {
            headers.setAccept(
                    Collections.singletonList(
                            MediaType.APPLICATION_JSON));
        }
    }

    private boolean shouldRetry(
            HttpMethod method,
            int status,
            int attempt,
            int attempts) {
        if (method != HttpMethod.GET
                || attempt >= attempts) {
            return false;
        }

        return status
                        == HttpStatus.BAD_GATEWAY.value()
                || status
                        == HttpStatus.SERVICE_UNAVAILABLE.value()
                || status
                        == HttpStatus.GATEWAY_TIMEOUT.value();
    }

    private void delayBeforeRetry() {
        if (retryDelayMs <= 0) {
            return;
        }

        try {
            Thread.sleep(retryDelayMs);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
        }
    }

    private void logRetry(
            HttpRequest request,
            int attempt,
            int attempts,
            Exception exception) {
        String message =
                "Retrying GET request "
                        + request.getURI()
                        + " after attempt "
                        + attempt
                        + " of "
                        + attempts;

        if (exception == null) {
            LOGGER.warning(message);
        } else {
            LOGGER.log(
                    Level.WARNING,
                    message,
                    exception);
        }
    }
}
