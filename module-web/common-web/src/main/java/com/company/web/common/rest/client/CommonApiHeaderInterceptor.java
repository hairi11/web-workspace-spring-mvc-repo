package com.company.web.common.rest.client;

import java.io.IOException;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public class CommonApiHeaderInterceptor
        implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution)
            throws IOException {
        applyHeaders(request);

        return execution.execute(
                request,
                body);
    }

    protected void applyHeaders(
            HttpRequest request) {
        // Temporary common API headers can be added here.
        // Replace the value source with session data when available.
    }
}
