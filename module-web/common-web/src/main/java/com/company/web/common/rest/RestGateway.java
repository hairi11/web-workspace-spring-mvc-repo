package com.company.web.common.rest;

import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

public class RestGateway {

    private final Logger logger;
    private final RestTemplate restTemplate;
    private final JsonCaseConverter caseConverter;
    private final int maxBodyLength;

    public RestGateway(
            RestTemplate restTemplate,
            int maxBodyLength) {
        this.restTemplate = restTemplate;
        this.maxBodyLength =
                Math.max(1, maxBodyLength);
        this.caseConverter =
                new JsonCaseConverter();
        this.logger =
                Logger.getLogger(
                        getClass().getName());
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

        if (utf8Length(requestBody)
                > maxBodyLength) {
            return jsonError(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "Request body exceeds the configured maximum length.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
                MediaType.APPLICATION_JSON);

        return exchange(
                buildPath(null, pathSegments),
                HttpMethod.POST,
                new HttpEntity<>(
                        requestBody,
                        headers));
    }

    protected ResponseEntity<String> exchange(
            String path,
            HttpMethod method,
            HttpEntity<?> request) {
        try {
            return restTemplate.exchange(
                    path,
                    method,
                    request,
                    String.class);
        } catch (RestGatewayException exception) {
            HttpStatus status =
                    HttpStatus.resolve(
                            exception.getStatusCode());

            return ResponseEntity
                    .status(
                            status != null
                                    ? status
                                    : HttpStatus.BAD_GATEWAY)
                    .contentType(
                            MediaType.APPLICATION_JSON)
                    .body(
                            exception.getResponseBody());
        } catch (RestClientException exception) {
            logger.log(
                    Level.WARNING,
                    "REST request failed: " + path,
                    exception);

            return jsonError(
                    HttpStatus.BAD_GATEWAY,
                    "REST service is unavailable.");
        }
    }

    protected String buildPath(
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

        String path =
                builder.build().toUriString();

        return path.startsWith("/")
                ? path.substring(1)
                : path;
    }

    protected ResponseEntity<String> jsonError(
            HttpStatus status,
            String message) {
        return ResponseEntity
                .status(status)
                .contentType(
                        MediaType.APPLICATION_JSON)
                .body(
                        caseConverter.normalizeErrorJson(
                                null,
                                message));
    }

    private static int utf8Length(
            String value) {
        return value
                .getBytes(StandardCharsets.UTF_8)
                .length;
    }
}
