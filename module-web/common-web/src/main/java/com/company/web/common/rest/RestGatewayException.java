package com.company.web.common.rest;

import org.springframework.web.client.RestClientException;

public class RestGatewayException
        extends RestClientException {

    private final int statusCode;
    private final String responseBody;

    public RestGatewayException(
            int statusCode,
            String responseBody) {
        super("REST request failed with HTTP " + statusCode);
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
