package com.company.web.common.rest.auth;

import java.io.IOException;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public class BearerTokenInterceptor
        implements ClientHttpRequestInterceptor {

    private final OAuthTokenProvider tokenProvider;

    public BearerTokenInterceptor(
            OAuthTokenProvider tokenProvider) {
        if (tokenProvider == null) {
            throw new IllegalArgumentException(
                    "OAuth token provider is required.");
        }

        this.tokenProvider = tokenProvider;
    }

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution)
            throws IOException {
        request.getHeaders().setBearerAuth(
                tokenProvider.getAccessToken());

        return execution.execute(
                request,
                body);
    }
}
