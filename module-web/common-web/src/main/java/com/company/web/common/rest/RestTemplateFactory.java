package com.company.web.common.rest;

import java.util.Collections;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

public final class RestTemplateFactory {

    private RestTemplateFactory() {
    }

    public static RestTemplate create(
            RestClientSettings settings) {
        JsonCaseConverter caseConverter =
                new JsonCaseConverter();

        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(
                settings.getConnectTimeoutMs());
        requestFactory.setReadTimeout(
                settings.getReadTimeoutMs());

        RestTemplate restTemplate =
                new RestTemplate(requestFactory);

        restTemplate.getMessageConverters().add(
                0,
                new JsonCaseHttpMessageConverter(
                        caseConverter));

        restTemplate.setErrorHandler(
                new RestGatewayErrorHandler(
                        caseConverter));

        restTemplate.setInterceptors(
                Collections.singletonList(
                        new RestGatewayInterceptor(
                                settings.getGetAttempts(),
                                settings.getRetryDelayMs())));

        restTemplate.setUriTemplateHandler(
                new DefaultUriBuilderFactory(
                        settings.getBaseUrl()));

        return restTemplate;
    }
}
