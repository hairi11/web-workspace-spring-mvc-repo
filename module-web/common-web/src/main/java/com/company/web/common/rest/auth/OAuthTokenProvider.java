package com.company.web.common.rest.auth;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public class OAuthTokenProvider {

    private static final long DEFAULT_EXPIRES_IN_SECONDS =
            60L;

    private final RestTemplate restTemplate;
    private final OAuthClientCredentialsSettings settings;

    private volatile CachedToken cachedToken;

    public OAuthTokenProvider(
            RestTemplate restTemplate,
            OAuthClientCredentialsSettings settings) {
        if (restTemplate == null) {
            throw new IllegalArgumentException(
                    "Token RestTemplate is required.");
        }

        if (settings == null
                || !settings.isConfigured()) {
            throw new IllegalArgumentException(
                    "OAuth client credentials settings are required.");
        }

        this.restTemplate = restTemplate;
        this.settings = settings;
    }

    public String getAccessToken() {
        CachedToken current = cachedToken;
        long now = System.currentTimeMillis();

        if (current != null
                && current.isValid(now)) {
            return current.accessToken;
        }

        synchronized (this) {
            current = cachedToken;
            now = System.currentTimeMillis();

            if (current != null
                    && current.isValid(now)) {
                return current.accessToken;
            }

            cachedToken = requestToken(now);
            return cachedToken.accessToken;
        }
    }

    public synchronized void invalidate() {
        cachedToken = null;
    }

    private CachedToken requestToken(long now) {
        MultiValueMap<String, String> form =
                new LinkedMultiValueMap<>();

        form.add(
                "scope",
                settings.getScope());
        form.add(
                "grant_type",
                "client_credentials");
        form.add(
                "client_id",
                settings.getClientId());
        form.add(
                "client_secret",
                settings.getClientSecret());

        HttpHeaders headers =
                new HttpHeaders();
        headers.setContentType(
                MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(
                java.util.Collections.singletonList(
                        MediaType.APPLICATION_JSON));

        ResponseEntity<Map> response;

        try {
            response = restTemplate.exchange(
                    settings.getTokenUrl(),
                    HttpMethod.POST,
                    new HttpEntity<>(form, headers),
                    Map.class);
        } catch (RestClientException exception) {
            throw new RestClientException(
                    "OAuth token request failed.",
                    exception);
        }

        Map<?, ?> body = response.getBody();
        String accessToken =
                stringValue(
                        body != null
                                ? body.get(
                                        "access_token")
                                : null);

        if (accessToken == null) {
            throw new RestClientException(
                    "OAuth token response does not contain access_token.");
        }

        long expiresInSeconds =
                longValue(
                        body != null
                                ? body.get(
                                        "expires_in")
                                : null,
                        DEFAULT_EXPIRES_IN_SECONDS);

        long refreshAfterSeconds =
                refreshAfterSeconds(
                        expiresInSeconds,
                        settings
                                .getRefreshSkewSeconds());

        return new CachedToken(
                accessToken,
                now
                        + refreshAfterSeconds
                        * 1_000L);
    }

    private static long refreshAfterSeconds(
            long expiresInSeconds,
            int refreshSkewSeconds) {
        long lifetime =
                Math.max(
                        1L,
                        expiresInSeconds);

        if (lifetime
                > refreshSkewSeconds) {
            return lifetime
                    - refreshSkewSeconds;
        }

        return Math.max(
                1L,
                lifetime / 2L);
    }

    private static String stringValue(
            Object value) {
        if (value == null) {
            return null;
        }

        String text =
                String.valueOf(value).trim();

        return text.isEmpty()
                ? null
                : text;
    }

    private static long longValue(
            Object value,
            long defaultValue) {
        if (value == null) {
            return defaultValue;
        }

        try {
            return Long.parseLong(
                    String.valueOf(value));
        } catch (NumberFormatException exception) {
            return defaultValue;
        }
    }

    private static final class CachedToken {

        private final String accessToken;
        private final long refreshAtEpochMs;

        private CachedToken(
                String accessToken,
                long refreshAtEpochMs) {
            this.accessToken = accessToken;
            this.refreshAtEpochMs =
                    refreshAtEpochMs;
        }

        private boolean isValid(long now) {
            return now
                    < refreshAtEpochMs;
        }
    }
}
