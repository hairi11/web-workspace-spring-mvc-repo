package com.company.web.fx.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FxRestClient {

    private static final String DEFAULT_BASE_URL = "http://localhost:8080/api";

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public FxRestClient() {
        this(new RestTemplate(), System.getProperty("fx.api.base-url", DEFAULT_BASE_URL));
    }

    FxRestClient(RestTemplate restTemplate, String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public ResponseEntity<String> get(String... pathSegments) {
        return get(null, pathSegments);
    }

    public ResponseEntity<String> get(
            MultiValueMap<String, String> query,
            String... pathSegments) {
        return exchange(buildUri(query, pathSegments), HttpMethod.GET, null);
    }

    public ResponseEntity<String> post(String body, String... pathSegments) {
        return exchange(buildUri(null, pathSegments), HttpMethod.POST, body);
    }

    private URI buildUri(
            MultiValueMap<String, String> query,
            String... pathSegments) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl);

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

    private ResponseEntity<String> exchange(
            URI uri,
            HttpMethod method,
            String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        if (method != HttpMethod.GET) {
            headers.setContentType(MediaType.APPLICATION_JSON);
        }

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            return restTemplate.exchange(uri, method, request, String.class);
        } catch (RestClientResponseException exception) {
            HttpHeaders responseHeaders = new HttpHeaders();

            if (exception.getResponseHeaders() != null
                    && exception.getResponseHeaders().getContentType() != null) {
                responseHeaders.setContentType(exception.getResponseHeaders().getContentType());
            } else {
                responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            }

            return ResponseEntity
                    .status(exception.getRawStatusCode())
                    .headers(responseHeaders)
                    .body(exception.getResponseBodyAsString());
        } catch (RestClientException exception) {
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"FX REST service is unavailable.\"}");
        }
    }
}
