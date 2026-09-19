package com.company.web.common.rest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.util.StreamUtils;

public class JsonCaseHttpMessageConverter
        extends AbstractHttpMessageConverter<String> {

    private final JsonCaseConverter caseConverter;

    public JsonCaseHttpMessageConverter(
            JsonCaseConverter caseConverter) {
        super(MediaType.APPLICATION_JSON);
        this.caseConverter = caseConverter;
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return String.class == clazz;
    }

    @Override
    protected String readInternal(
            Class<? extends String> clazz,
            HttpInputMessage inputMessage)
            throws IOException,
            HttpMessageNotReadableException {
        String json = StreamUtils.copyToString(
                inputMessage.getBody(),
                StandardCharsets.UTF_8);

        try {
            return caseConverter.toCamelCaseJson(json);
        } catch (IllegalArgumentException exception) {
            throw new HttpMessageNotReadableException(
                    "Invalid JSON response body.",
                    exception,
                    inputMessage);
        }
    }

    @Override
    protected void writeInternal(
            String value,
            HttpOutputMessage outputMessage)
            throws IOException,
            HttpMessageNotWritableException {
        final String json;

        try {
            json = caseConverter.toSnakeCaseJson(value);
        } catch (IllegalArgumentException exception) {
            throw new HttpMessageNotWritableException(
                    "Invalid JSON request body.",
                    exception);
        }

        StreamUtils.copy(
                json,
                StandardCharsets.UTF_8,
                outputMessage.getBody());
    }
}
