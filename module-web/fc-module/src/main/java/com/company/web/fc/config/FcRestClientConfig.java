package com.company.web.fc.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.company.web.common.rest.RestClientSettings;
import com.company.web.common.rest.RestTemplateFactory;

@Configuration
public class FcRestClientConfig {

    private static final String DEFAULT_BASE_URL =
            "http://localhost:8080/api";

    @Bean(name = "fcRestClientSettings")
    public RestClientSettings fcRestClientSettings() {
        return RestClientSettings.fromSystemProperties(
                "fc.api",
                DEFAULT_BASE_URL);
    }

    @Bean(name = "fcRestTemplate")
    public RestTemplate fcRestTemplate(
            @Qualifier("fcRestClientSettings")
            RestClientSettings settings) {
        return RestTemplateFactory.create(settings);
    }
}
