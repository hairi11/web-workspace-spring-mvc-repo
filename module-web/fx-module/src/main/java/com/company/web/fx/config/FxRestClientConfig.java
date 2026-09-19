package com.company.web.fx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.company.web.common.rest.RestClientSettings;
import com.company.web.common.rest.RestTemplateFactory;

@Configuration
public class FxRestClientConfig {

    private static final String DEFAULT_BASE_URL =
            "http://localhost:8080/api";

    @Bean(name = "fxRestClientSettings")
    public RestClientSettings fxRestClientSettings() {
        return RestClientSettings.fromSystemProperties(
                "fx.api",
                DEFAULT_BASE_URL);
    }

    @Bean(name = "fxRestTemplate")
    public RestTemplate fxRestTemplate() {
        return RestTemplateFactory.create(
                fxRestClientSettings());
    }
}
