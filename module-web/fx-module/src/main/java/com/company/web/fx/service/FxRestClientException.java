package com.company.web.fx.service;

import org.springframework.web.client.RestClientException;

public class FxRestClientException extends RestClientException {

    private final int statusCode;
    private final String responseBody;

    public FxRestClientException(
            int statusCode,
            String responseBody) {
        super("FX REST request failed with HTTP " + statusCode);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getResponseBody() {
        return responseBody;
    }
}
