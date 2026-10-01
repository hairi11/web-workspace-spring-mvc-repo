package com.company.web.common.rest.error;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.DefaultResponseErrorHandler;

import com.company.web.common.rest.json.JsonCaseConverter;

public class RestGatewayErrorHandler
        extends DefaultResponseErrorHandler {

    private final JsonCaseConverter caseConverter;

    public RestGatewayErrorHandler(
            JsonCaseConverter caseConverter) {
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
                        "REST request failed.");

        throw new RestGatewayException(
                response.getRawStatusCode(),
                normalizedBody);
    }
}
