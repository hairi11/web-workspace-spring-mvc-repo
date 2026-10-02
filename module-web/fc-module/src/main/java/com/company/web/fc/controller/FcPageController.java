package com.company.web.fc.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.company.web.fc.service.FcRestClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class FcPageController {

    private final FcRestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FcPageController(FcRestClient restClient) {
        this.restClient = restClient;
    }

    @GetMapping({"/fc", "/fc/", "/fc/enquiry"})
    public String enquiry() {
        return "fc/enquiry";
    }

    @PostMapping("/fc/transaction/view")
    public String view(
            @RequestParam("path") String path,
            @RequestParam("id") String id,
            Model model) {
        MultiValueMap<String, String> query =
                new LinkedMultiValueMap<>();

        query.add("path", path);
        query.add("id", id);

        ResponseEntity<String> response =
                restClient.get(
                        "enq",
                        query,
                        "fc",
                        "detail");

        model.addAttribute(
                "detail",
                detail(response.getBody()));

        return "fc/view";
    }

    @GetMapping({
            "/fc/transaction/create",
            "/fc/transaction/edit"
    })
    public String transaction() {
        return "fc/transaction";
    }

    @GetMapping("/fc/enquiry.html")
    public String legacyEnquiry() {
        return "redirect:/fc/enquiry";
    }

    private Map<String, Object> detail(String body) {
        if (body == null || body.isBlank()) {
            return Map.of();
        }

        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode detail =
                    root.has("data") && root.get("data").isObject()
                            ? root.get("data")
                            : root;

            if (!detail.isObject()) {
                return Map.of();
            }

            return objectMapper.convertValue(
                    detail,
                    new TypeReference<LinkedHashMap<String, Object>>() {});
        } catch (Exception exception) {
            return Map.of();
        }
    }
}
