package com.company.web.fx.config;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import com.company.web.fx.service.FxJsonCaseConverter;
import com.company.web.fx.service.FxJsonHttpMessageConverter;
import com.company.web.fx.service.FxRestClientInterceptor;
import com.company.web.fx.service.FxRestResponseErrorHandler;

@Configuration
public class FxRestClientConfig {

    private static final String DEFAULT_BASE_URL =
            "http://localhost:8080/api";

    private static final int DEFAULT_CONNECT_TIMEOUT_MS = 3_000;
    private static final int DEFAULT_READ_TIMEOUT_MS = 10_000;
    private static final int DEFAULT_GET_ATTEMPTS = 2;
    private static final int DEFAULT_RETRY_DELAY_MS = 250;

    @Bean
    public FxJsonCaseConverter fxJsonCaseConverter() {
        return new FxJsonCaseConverter();
    }

    @Bean
    public FxRestClientInterceptor fxRestClientInterceptor() {
        return new FxRestClientInterceptor(
                intProperty(
                        "fx.api.get-attempts",
                        DEFAULT_GET_ATTEMPTS),
                intProperty(
                        "fx.api.retry-delay-ms",
                        DEFAULT_RETRY_DELAY_MS));
    }

    @Bean(name = "fxRestTemplate")
    public RestTemplate fxRestTemplate(
            FxJsonCaseConverter caseConverter,
            FxRestClientInterceptor interceptor) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(
                intProperty(
                        "fx.api.connect-timeout-ms",
                        DEFAULT_CONNECT_TIMEOUT_MS));
        requestFactory.setReadTimeout(
                intProperty(
                        "fx.api.read-timeout-ms",
                        DEFAULT_READ_TIMEOUT_MS));

        RestTemplate restTemplate =
                new RestTemplate(requestFactory);

        restTemplate.getMessageConverters().add(
                0,
                new FxJsonHttpMessageConverter(caseConverter));

        restTemplate.setErrorHandler(
                new FxRestResponseErrorHandler(caseConverter));

        restTemplate.setInterceptors(
                Collections.singletonList(interceptor));

        String baseUrl = System.getProperty(
                "fx.api.base-url",
                DEFAULT_BASE_URL);

        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }

        DefaultUriBuilderFactory uriBuilderFactory =
                new DefaultUriBuilderFactory(baseUrl);

        restTemplate.setUriTemplateHandler(uriBuilderFactory);

        return restTemplate;
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
}
