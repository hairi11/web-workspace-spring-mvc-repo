package com.company.web.common.rest.client;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import com.company.web.common.rest.auth.BearerTokenInterceptor;
import com.company.web.common.rest.auth.OAuthClientCredentialsSettings;
import com.company.web.common.rest.auth.OAuthTokenProvider;
import com.company.web.common.rest.config.RestClientSettings;
import com.company.web.common.rest.error.RestGatewayErrorHandler;
import com.company.web.common.rest.json.JsonCaseConverter;

public final class RestTemplateFactory {

    private RestTemplateFactory() {
    }

    public static RestTemplate create(
            RestClientSettings settings) {
        return create(
                settings,
                OAuthClientCredentialsSettings
                        .disabled());
    }

    public static RestTemplate create(
            RestClientSettings settings,
            OAuthClientCredentialsSettings oauthSettings) {
        JsonCaseConverter caseConverter =
                new JsonCaseConverter();

        RestTemplate restTemplate =
                new RestTemplate(
                        createRequestFactory(settings));

        restTemplate.setErrorHandler(
                new RestGatewayErrorHandler(
                        caseConverter));

        List<ClientHttpRequestInterceptor> interceptors =
                new ArrayList<>();

        interceptors.add(
                new CommonApiHeaderInterceptor());

        if (oauthSettings != null
                && oauthSettings.isConfigured()) {
            RestTemplate tokenRestTemplate =
                    new RestTemplate(
                            createRequestFactory(
                                    settings));

            OAuthTokenProvider tokenProvider =
                    new OAuthTokenProvider(
                            tokenRestTemplate,
                            oauthSettings);

            interceptors.add(
                    new BearerTokenInterceptor(
                            tokenProvider));
        }

        interceptors.add(
                new RestGatewayInterceptor(
                        settings.getGetAttempts(),
                        settings.getRetryDelayMs()));

        restTemplate.setInterceptors(interceptors);

        return restTemplate;
    }

    private static SimpleClientHttpRequestFactory
            createRequestFactory(
                    RestClientSettings settings) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(
                settings.getConnectTimeoutMs());
        requestFactory.setReadTimeout(
                settings.getReadTimeoutMs());

        return requestFactory;
    }
}
