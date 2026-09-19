package com.company.web.fx.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FxRestClient {

    private static final Logger LOGGER =
            Logger.getLogger(FxRestClient.class.getName());

    private static final String DEFAULT_BASE_URL =
            "http://localhost:8080/api";

    private static final int DEFAULT_CONNECT_TIMEOUT_MS = 3_000;
    private static final int DEFAULT_READ_TIMEOUT_MS = 10_000;
    private static final int DEFAULT_GET_ATTEMPTS = 2;
    private static final int DEFAULT_RETRY_DELAY_MS = 250;
    private static final int DEFAULT_MAX_BODY_LENGTH = 2_000_000;

    private final RestTemplate restTemplate;
    private final FxJsonCaseConverter caseConverter;
    private final String baseUrl;
    private final int getAttempts;
    private final int retryDelayMs;
    private final int maxBodyLength;

    public FxRestClient() {
        int connectTimeoutMs = intProperty(
                "fx.api.connect-timeout-ms",
                DEFAULT_CONNECT_TIMEOUT_MS);
        int readTimeoutMs = intProperty(
                "fx.api.read-timeout-ms",
                DEFAULT_READ_TIMEOUT_MS);

        this.restTemplate = createRestTemplate(
                connectTimeoutMs,
                readTimeoutMs);
        this.caseConverter = new FxJsonCaseConverter();
        this.baseUrl = System.getProperty(
                "fx.api.base-url",
                DEFAULT_BASE_URL);
        this.getAttempts = Math.max(
                1,
                intProperty(
                        "fx.api.get-attempts",
                        DEFAULT_GET_ATTEMPTS));
        this.retryDelayMs = Math.max(
                0,
                intProperty(
                        "fx.api.retry-delay-ms",
                        DEFAULT_RETRY_DELAY_MS));
        this.maxBodyLength = Math.max(
                1,
                intProperty(
                        "fx.api.max-body-length",
                        DEFAULT_MAX_BODY_LENGTH));
    }

    public ResponseEntity<String> get(String... pathSegments) {
        return get(null, pathSegments);
    }

    public ResponseEntity<String> get(
            MultiValueMap<String, String> query,
            String... pathSegments) {
        URI uri = buildUri(query, pathSegments);
        return exchangeWithRetry(uri, HttpMethod.GET, null, getAttempts);
    }

    public ResponseEntity<String> post(
            String body,
            String... pathSegments) {
        String requestBody = body == null || body.isBlank()
                ? "{}"
                : body;

        if (utf8Length(requestBody) > maxBodyLength) {
            return jsonError(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "Request body exceeds the configured maximum length.");
        }

        final String backendBody;

        try {
            backendBody = caseConverter.toSnakeCaseJson(requestBody);
        } catch (IllegalArgumentException exception) {
            return jsonError(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON request body.");
        }

        if (utf8Length(backendBody) > maxBodyLength) {
            return jsonError(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "Request body exceeds the configured maximum length.");
        }

        // POST is intentionally not retried automatically to avoid
        // duplicate save/submit/delete side effects.
        return exchangeWithRetry(
                buildUri(null, pathSegments),
                HttpMethod.POST,
                backendBody,
                1);
    }

    private ResponseEntity<String> exchangeWithRetry(
            URI uri,
            HttpMethod method,
            String body,
            int attempts) {
        for (int attempt = 1; attempt <= attempts; attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                        uri,
                        method,
                        buildRequest(method, body),
                        String.class);

                return normalizeSuccess(response);
            } catch (RestClientResponseException exception) {
                if (shouldRetry(
                        method,
                        exception.getRawStatusCode(),
                        attempt,
                        attempts)) {
                    logRetry(uri, attempt, attempts, exception);
                    delayBeforeRetry();
                    continue;
                }

                return normalizeBackendError(exception);
            } catch (RestClientException exception) {
                if (method == HttpMethod.GET && attempt < attempts) {
                    logRetry(uri, attempt, attempts, exception);
                    delayBeforeRetry();
                    continue;
                }

                LOGGER.log(
                        Level.WARNING,
                        "FX REST request failed: " + uri,
                        exception);

                return jsonError(
                        HttpStatus.BAD_GATEWAY,
                        "FX REST service is unavailable.");
            }
        }

        return jsonError(
                HttpStatus.BAD_GATEWAY,
                "FX REST service is unavailable.");
    }

    private HttpEntity<String> buildRequest(
            HttpMethod method,
            String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(
                Collections.singletonList(MediaType.APPLICATION_JSON));

        if (method != HttpMethod.GET) {
            headers.setContentType(MediaType.APPLICATION_JSON);
        }

        // Browser headers are deliberately not forwarded. This prevents
        // credentials and other sensitive headers from leaking to the
        // backend service unless Java explicitly opts them in later.
        return new HttpEntity<>(body, headers);
    }

    private ResponseEntity<String> normalizeSuccess(
            ResponseEntity<String> response) {
        String body = response.getBody();

        if (body == null || body.isBlank()) {
            return ResponseEntity
                    .status(response.getStatusCode())
                    .build();
        }

        final String normalized;

        try {
            normalized = caseConverter.toCamelCaseJson(body);
        } catch (IllegalArgumentException exception) {
            LOGGER.log(
                    Level.WARNING,
                    "FX REST service returned invalid JSON.",
                    exception);

            return jsonError(
                    HttpStatus.BAD_GATEWAY,
                    "FX REST service returned an invalid response.");
        }

        return ResponseEntity
                .status(response.getStatusCode())
                .contentType(MediaType.APPLICATION_JSON)
                .body(normalized);
    }

    private ResponseEntity<String> normalizeBackendError(
            RestClientResponseException exception) {
        HttpStatus status = HttpStatus.resolve(
                exception.getRawStatusCode());

        if (status == null) {
            status = HttpStatus.BAD_GATEWAY;
        }

        String body = caseConverter.normalizeErrorJson(
                exception.getResponseBodyAsString(),
                "FX REST request failed.");

        LOGGER.warning(
                "FX REST returned HTTP "
                        + exception.getRawStatusCode());

        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    private URI buildUri(
            MultiValueMap<String, String> query,
            String... pathSegments) {
        UriComponentsBuilder builder =
                UriComponentsBuilder.fromHttpUrl(baseUrl);

        for (String pathSegment : pathSegments) {
            builder.pathSegment(pathSegment);
        }

        if (query != null) {
            query.forEach((name, values) -> {
                for (String value : values) {
                    builder.queryParam(name, value);
                }
            });
        }

        return builder
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUri();
    }

    private boolean shouldRetry(
            HttpMethod method,
            int status,
            int attempt,
            int attempts) {
        if (method != HttpMethod.GET || attempt >= attempts) {
            return false;
        }

        return status == HttpStatus.BAD_GATEWAY.value()
                || status == HttpStatus.SERVICE_UNAVAILABLE.value()
                || status == HttpStatus.GATEWAY_TIMEOUT.value();
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
            URI uri,
            int attempt,
            int attempts,
            Exception exception) {
        LOGGER.log(
                Level.WARNING,
                "Retrying FX GET request "
                        + uri
                        + " after attempt "
                        + attempt
                        + " of "
                        + attempts,
                exception);
    }

    private ResponseEntity<String> jsonError(
            HttpStatus status,
            String message) {
        String body = caseConverter.normalizeErrorJson(
                null,
                message);

        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    private static RestTemplate createRestTemplate(
            int connectTimeoutMs,
            int readTimeoutMs) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(connectTimeoutMs);
        requestFactory.setReadTimeout(readTimeoutMs);

        return new RestTemplate(requestFactory);
    }

    private static int intProperty(
            String name,
            int defaultValue) {
        String value = System.getProperty(name);

        if (value == null || value.isBlank()) {
            return defaultValue;
        }

        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException exception) {
            LOGGER.warning(
                    "Invalid integer system property "
                            + name
                            + "="
                            + value
                            + "; using "
                            + defaultValue);
            return defaultValue;
        }
    }

    private static int utf8Length(String value) {
        return value
                .getBytes(StandardCharsets.UTF_8)
                .length;
    }
}
