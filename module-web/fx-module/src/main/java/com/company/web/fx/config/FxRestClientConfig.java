package com.company.web.fx.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import com.company.web.common.rest.OAuthClientCredentialsSettings;
import com.company.web.common.rest.RestClientSettings;
import com.company.web.common.rest.RestTemplateFactory;

@Configuration
public class FxRestClientConfig {

    private static final String DEFAULT_BASE_URL =
            "http://localhost:8080/api";

    @Bean(name = "fxRestClientSettings")
    public RestClientSettings fxRestClientSettings(
            Environment environment) {
        return RestClientSettings.fromEnvironment(
                environment,
                "fx.api",
                DEFAULT_BASE_URL);
    }

    @Bean(name = "fxRestTemplate")
    public RestTemplate fxRestTemplate(
            @Qualifier("fxRestClientSettings")
            RestClientSettings settings,
            OAuthClientCredentialsSettings oauthSettings) {
        return RestTemplateFactory.create(
                settings,
                oauthSettings);
    }
}
