package com.company.web.fx.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.ResponseErrorHandler;

public class FxRestResponseErrorHandler
        implements ResponseErrorHandler {

    private final FxJsonCaseConverter caseConverter;

    public FxRestResponseErrorHandler(
            FxJsonCaseConverter caseConverter) {
        this.caseConverter = caseConverter;
    }

    @Override
    public boolean hasError(
            ClientHttpResponse response)
            throws IOException {
        HttpStatus status = response.getStatusCode();
        return status.is4xxClientError()
                || status.is5xxServerError();
    }

    @Override
    public void handleError(
            ClientHttpResponse response)
            throws IOException {
        String rawBody = StreamUtils.copyToString(
                response.getBody(),
                StandardCharsets.UTF_8);

        String normalizedBody =
                caseConverter.normalizeErrorJson(
                        rawBody,
                        "FX REST request failed.");

        throw new FxRestClientException(
                response.getRawStatusCode(),
                normalizedBody);
    }
}
