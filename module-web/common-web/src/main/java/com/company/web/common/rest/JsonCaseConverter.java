package com.company.web.common.rest;

import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class JsonCaseConverter {

    private static final Pattern ACRONYM_BOUNDARY =
            Pattern.compile("([A-Z]+)([A-Z][a-z])");
    private static final Pattern LOWER_UPPER_BOUNDARY =
            Pattern.compile("([a-z0-9])([A-Z])");
    private static final Pattern SNAKE_CAMEL =
            Pattern.compile("_([a-z0-9])");

    private final ObjectMapper objectMapper;

    public JsonCaseConverter() {
        this(new ObjectMapper());
    }

    JsonCaseConverter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String toSnakeCaseJson(String json) {
        return transformJson(json, this::toSnakeCase);
    }

    public String toCamelCaseJson(String json) {
        return transformJson(json, this::toCamelCase);
    }

    public String normalizeErrorJson(
            String json,
            String fallbackMessage) {
        if (json != null && !json.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(json);
                return objectMapper.writeValueAsString(
                        transformNode(root, this::toCamelCase));
            } catch (JsonProcessingException ignored) {
                // Fall through to a safe normalized error body.
            }
        }

        ObjectNode error = objectMapper.createObjectNode();
        error.put("message", fallbackMessage);
        return writeJson(error);
    }

    private String transformJson(
            String json,
            Function<String, String> keyMapper) {
        if (json == null || json.isBlank()) {
            return json;
        }

        try {
            JsonNode root = objectMapper.readTree(json);
            return objectMapper.writeValueAsString(
                    transformNode(root, keyMapper));
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException(
                    "Invalid JSON payload.",
                    exception);
        }
    }

    private JsonNode transformNode(
            JsonNode node,
            Function<String, String> keyMapper) {
        if (node == null
                || node.isNull()
                || node.isValueNode()) {
            return node;
        }

        if (node.isArray()) {
            ArrayNode result = objectMapper.createArrayNode();

            for (JsonNode item : node) {
                result.add(
                        transformNode(item, keyMapper));
            }

            return result;
        }

        ObjectNode result = objectMapper.createObjectNode();

        for (Map.Entry<String, JsonNode> field
                : node.properties()) {
            result.set(
                    keyMapper.apply(field.getKey()),
                    transformNode(
                            field.getValue(),
                            keyMapper));
        }

        return result;
    }

    private String toCamelCase(String value) {
        Matcher matcher = SNAKE_CAMEL.matcher(value);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            matcher.appendReplacement(
                    result,
                    Matcher.quoteReplacement(
                            matcher.group(1)
                                    .toUpperCase(Locale.ROOT)));
        }

        matcher.appendTail(result);
        return result.toString();
    }

    private String toSnakeCase(String value) {
        String firstPass = ACRONYM_BOUNDARY
                .matcher(value)
                .replaceAll("$1_$2");

        String secondPass = LOWER_UPPER_BOUNDARY
                .matcher(firstPass)
                .replaceAll("$1_$2");

        return secondPass.toLowerCase(Locale.ROOT);
    }

    private String writeJson(JsonNode node) {
        try {
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException exception) {
            return "{\"message\":\"Request failed.\"}";
        }
    }
}
