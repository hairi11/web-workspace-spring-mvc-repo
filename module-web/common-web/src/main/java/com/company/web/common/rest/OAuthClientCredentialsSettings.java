package com.company.web.common.rest;

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
                Math.max(0, refreshSkewSeconds);
        this.configured = configured;
    }

    public static OAuthClientCredentialsSettings
            fromSystemProperties(String prefix) {
        String tokenUrl =
                stringProperty(
                        prefix + ".token-url");
        String clientId =
                stringProperty(
                        prefix + ".client-id");
        String clientSecret =
                stringProperty(
                        prefix + ".client-secret");

        boolean anyConfigured =
                tokenUrl != null
                        || clientId != null
                        || clientSecret != null;

        if (!anyConfigured) {
            return new OAuthClientCredentialsSettings(
                    null,
                    null,
                    null,
                    DEFAULT_SCOPE,
                    DEFAULT_REFRESH_SKEW_SECONDS,
                    false);
        }

        require(
                prefix + ".token-url",
                tokenUrl);
        require(
                prefix + ".client-id",
                clientId);
        require(
                prefix + ".client-secret",
                clientSecret);

        String scope =
                stringProperty(
                        prefix + ".scope");

        return new OAuthClientCredentialsSettings(
                tokenUrl,
                clientId,
                clientSecret,
                scope != null
                        ? scope
                        : DEFAULT_SCOPE,
                intProperty(
                        prefix
                                + ".refresh-skew-seconds",
                        DEFAULT_REFRESH_SKEW_SECONDS),
                true);
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

    private static String stringProperty(
            String name) {
        String value =
                System.getProperty(name);

        if (value == null
                || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private static int intProperty(
            String name,
            int defaultValue) {
        String value =
                System.getProperty(name);

        if (value == null
                || value.isBlank()) {
            return defaultValue;
        }

        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException exception) {
            return defaultValue;
        }
    }

    private static void require(
            String name,
            String value) {
        if (value == null) {
            throw new IllegalArgumentException(
                    "OAuth configuration is incomplete: "
                            + name
                            + " is required.");
        }
    }
}
