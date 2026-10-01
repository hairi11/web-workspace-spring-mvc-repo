package com.company.web.common.rest.config;

import org.springframework.core.env.Environment;

public final class RestClientSettings {

    private static final int DEFAULT_CONNECT_TIMEOUT_MS =
            3_000;
    private static final int DEFAULT_READ_TIMEOUT_MS =
            10_000;
    private static final int DEFAULT_GET_ATTEMPTS =
            2;
    private static final int DEFAULT_RETRY_DELAY_MS =
            250;
    private static final int DEFAULT_MAX_BODY_LENGTH =
            2_000_000;

    private final String baseUrl;
    private final int connectTimeoutMs;
    private final int readTimeoutMs;
    private final int getAttempts;
    private final int retryDelayMs;
    private final int maxBodyLength;

    private RestClientSettings(
            String baseUrl,
            int connectTimeoutMs,
            int readTimeoutMs,
            int getAttempts,
            int retryDelayMs,
            int maxBodyLength) {
        this.baseUrl =
                normalizeBaseUrl(baseUrl);
        this.connectTimeoutMs =
                Math.max(
                        0,
                        connectTimeoutMs);
        this.readTimeoutMs =
                Math.max(
                        0,
                        readTimeoutMs);
        this.getAttempts =
                Math.max(
                        1,
                        getAttempts);
        this.retryDelayMs =
                Math.max(
                        0,
                        retryDelayMs);
        this.maxBodyLength =
                Math.max(
                        1,
                        maxBodyLength);
    }

    public static RestClientSettings
            fromEnvironment(
                    Environment environment,
                    String prefix,
                    String defaultBaseUrl) {
        if (environment == null) {
            throw new IllegalArgumentException(
                    "Spring Environment is required.");
        }

        return new RestClientSettings(
                environment.getProperty(
                        prefix + ".base-url",
                        defaultBaseUrl),
                intProperty(
                        environment,
                        prefix
                                + ".connect-timeout-ms",
                        DEFAULT_CONNECT_TIMEOUT_MS),
                intProperty(
                        environment,
                        prefix
                                + ".read-timeout-ms",
                        DEFAULT_READ_TIMEOUT_MS),
                intProperty(
                        environment,
                        prefix
                                + ".get-attempts",
                        DEFAULT_GET_ATTEMPTS),
                intProperty(
                        environment,
                        prefix
                                + ".retry-delay-ms",
                        DEFAULT_RETRY_DELAY_MS),
                intProperty(
                        environment,
                        prefix
                                + ".max-body-length",
                        DEFAULT_MAX_BODY_LENGTH));
    }

    public static RestClientSettings
            fromSystemProperties(
                    String prefix,
                    String defaultBaseUrl) {
        return new RestClientSettings(
                System.getProperty(
                        prefix + ".base-url",
                        defaultBaseUrl),
                intSystemProperty(
                        prefix
                                + ".connect-timeout-ms",
                        DEFAULT_CONNECT_TIMEOUT_MS),
                intSystemProperty(
                        prefix
                                + ".read-timeout-ms",
                        DEFAULT_READ_TIMEOUT_MS),
                intSystemProperty(
                        prefix
                                + ".get-attempts",
                        DEFAULT_GET_ATTEMPTS),
                intSystemProperty(
                        prefix
                                + ".retry-delay-ms",
                        DEFAULT_RETRY_DELAY_MS),
                intSystemProperty(
                        prefix
                                + ".max-body-length",
                        DEFAULT_MAX_BODY_LENGTH));
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public int getConnectTimeoutMs() {
        return connectTimeoutMs;
    }

    public int getReadTimeoutMs() {
        return readTimeoutMs;
    }

    public int getGetAttempts() {
        return getAttempts;
    }

    public int getRetryDelayMs() {
        return retryDelayMs;
    }

    public int getMaxBodyLength() {
        return maxBodyLength;
    }

    private static String normalizeBaseUrl(
            String baseUrl) {
        if (baseUrl == null
                || baseUrl.isBlank()) {
            throw new IllegalArgumentException(
                    "REST base URL is required.");
        }

        return baseUrl.endsWith("/")
                ? baseUrl
                : baseUrl + "/";
    }

    private static int intProperty(
            Environment environment,
            String name,
            int defaultValue) {
        Integer value =
                environment.getProperty(
                        name,
                        Integer.class);

        return value != null
                ? value
                : defaultValue;
    }

    private static int intSystemProperty(
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
}
