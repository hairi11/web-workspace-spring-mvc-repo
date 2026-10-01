package com.company.web.common.rest.auth;

import org.springframework.core.env.Environment;

public final class OAuthClientCredentialsSettings {

    private static final String DEFAULT_SCOPE =
            "openid";
    private static final int DEFAULT_REFRESH_SKEW_SECONDS =
            30;

    private final String tokenUrl;
    private final String clientId;
    private final String clientSecret;
    private final String scope;
    private final int refreshSkewSeconds;
    private final boolean configured;

    private OAuthClientCredentialsSettings(
            String tokenUrl,
            String clientId,
            String clientSecret,
            String scope,
            int refreshSkewSeconds,
            boolean configured) {
        this.tokenUrl = tokenUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.scope = scope;
        this.refreshSkewSeconds =
                Math.max(
                        0,
                        refreshSkewSeconds);
        this.configured = configured;
    }

    public static OAuthClientCredentialsSettings
            fromEnvironment(
                    Environment environment,
                    String prefix) {
        if (environment == null) {
            throw new IllegalArgumentException(
                    "Spring Environment is required.");
        }

        boolean enabled =
                Boolean.TRUE.equals(
                        environment.getProperty(
                                prefix + ".enabled",
                                Boolean.class,
                                Boolean.FALSE));

        if (!enabled) {
            return disabled();
        }

        String tokenUrl =
                requiredProperty(
                        environment,
                        prefix + ".token-url");
        String clientId =
                requiredProperty(
                        environment,
                        prefix + ".client-id");
        String clientSecret =
                requiredProperty(
                        environment,
                        prefix + ".client-secret");

        String scope =
                environment.getProperty(
                        prefix + ".scope",
                        DEFAULT_SCOPE);

        Integer refreshSkewSeconds =
                environment.getProperty(
                        prefix
                                + ".refresh-skew-seconds",
                        Integer.class);

        return new OAuthClientCredentialsSettings(
                tokenUrl,
                clientId,
                clientSecret,
                scope,
                refreshSkewSeconds != null
                        ? refreshSkewSeconds
                        : DEFAULT_REFRESH_SKEW_SECONDS,
                true);
    }

    public static OAuthClientCredentialsSettings
            disabled() {
        return new OAuthClientCredentialsSettings(
                null,
                null,
                null,
                DEFAULT_SCOPE,
                DEFAULT_REFRESH_SKEW_SECONDS,
                false);
    }

    public boolean isConfigured() {
        return configured;
    }

    public String getTokenUrl() {
        return tokenUrl;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getScope() {
        return scope;
    }

    public int getRefreshSkewSeconds() {
        return refreshSkewSeconds;
    }

    private static String requiredProperty(
            Environment environment,
            String name) {
        String value =
                environment.getProperty(name);

        if (value == null
                || value.isBlank()) {
            throw new IllegalArgumentException(
                    "OAuth configuration is incomplete: "
                            + name
                            + " is required.");
        }

        return value.trim();
    }
}
