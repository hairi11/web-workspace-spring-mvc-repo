package com.company.web.fx.service;

import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FxRestClient {

    private static final Logger LOGGER =
            Logger.getLogger(FxRestClient.class.getName());

    private static final int DEFAULT_MAX_BODY_LENGTH =
            2_000_000;

    private final RestTemplate restTemplate;
    private final FxJsonCaseConverter caseConverter;
    private final int maxBodyLength;

    public FxRestClient(
            @Qualifier("fxRestTemplate")
            RestTemplate restTemplate,
            FxJsonCaseConverter caseConverter) {
        this.restTemplate = restTemplate;
        this.caseConverter = caseConverter;
        this.maxBodyLength = Math.max(
                1,
                intProperty(
                        "fx.api.max-body-length",
                        DEFAULT_MAX_BODY_LENGTH));
    }

    public ResponseEntity<String> get(
            String... pathSegments) {
        return get(null, pathSegments);
    }

    public ResponseEntity<String> get(
            MultiValueMap<String, String> query,
            String... pathSegments) {
        return exchange(
                buildPath(query, pathSegments),
                HttpMethod.GET,
                HttpEntity.EMPTY);
    }

    public ResponseEntity<String> post(
            String body,
            String... pathSegments) {
        String requestBody =
                body == null || body.isBlank()
                        ? "{}"
                        : body;

        if (utf8Length(requestBody) > maxBodyLength) {
            return jsonError(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "Request body exceeds the configured maximum length.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return exchange(
                buildPath(null, pathSegments),
                HttpMethod.POST,
                new HttpEntity<>(requestBody, headers));
    }

    private ResponseEntity<String> exchange(
            String path,
            HttpMethod method,
            HttpEntity<?> request) {
        try {
            return restTemplate.exchange(
                    path,
                    method,
                    request,
                    String.class);
        } catch (FxRestClientException exception) {
            HttpStatus status =
                    HttpStatus.resolve(
                            exception.getStatusCode());

            return ResponseEntity
                    .status(status != null
                            ? status
                            : HttpStatus.BAD_GATEWAY)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(exception.getResponseBody());
        } catch (RestClientException exception) {
            LOGGER.log(
                    Level.WARNING,
                    "FX REST request failed: " + path,
                    exception);

            return jsonError(
                    HttpStatus.BAD_GATEWAY,
                    "FX REST service is unavailable.");
        }
    }

    private String buildPath(
            MultiValueMap<String, String> query,
            String... pathSegments) {
        UriComponentsBuilder builder =
                UriComponentsBuilder.newInstance();

        for (String pathSegment : pathSegments) {
            builder.pathSegment(pathSegment);
        }

        if (query != null) {
            builder.queryParams(query);
        }

        String path = builder
                .build()
                .toUriString();

        return path.startsWith("/")
                ? path.substring(1)
                : path;
    }

    private ResponseEntity<String> jsonError(
            HttpStatus status,
            String message) {
        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        caseConverter.normalizeErrorJson(
                                null,
                                message));
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
            return defaultValue;
        }
    }

    private static int utf8Length(String value) {
        return value
                .getBytes(StandardCharsets.UTF_8)
                .length;
    }
}
