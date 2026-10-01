package com.company.web.fc.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import com.company.web.common.rest.auth.OAuthClientCredentialsSettings;
import com.company.web.common.rest.config.RestClientSettings;
import com.company.web.common.rest.client.RestTemplateFactory;

@Configuration
public class FcRestClientConfig {

    private static final String DEFAULT_BASE_URL =
            "http://localhost:8080/service";

    @Bean(name = "fcRestClientSettings")
    public RestClientSettings fcRestClientSettings(
            Environment environment) {
        return RestClientSettings.fromEnvironment(
                environment,
                "web.api",
                DEFAULT_BASE_URL);
    }

    @Bean(name = "fcRestTemplate")
    public RestTemplate fcRestTemplate(
            @Qualifier("fcRestClientSettings")
            RestClientSettings settings,
            OAuthClientCredentialsSettings oauthSettings) {
        return RestTemplateFactory.create(
                settings,
                oauthSettings);
    }
}
