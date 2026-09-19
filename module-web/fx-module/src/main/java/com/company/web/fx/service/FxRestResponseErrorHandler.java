package com.company.web.fx.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.DefaultResponseErrorHandler;

public class FxRestResponseErrorHandler
        extends DefaultResponseErrorHandler {

    private final FxJsonCaseConverter caseConverter;

    public FxRestResponseErrorHandler(
            FxJsonCaseConverter caseConverter) {
        this.caseConverter = caseConverter;
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
