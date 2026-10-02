package com.company.web.fc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.web.fc.service.FcRestClient;

@RestController
@RequestMapping("/fc/api")
public class FcApiController {

    private final FcRestClient restClient;

    public FcApiController(FcRestClient restClient) {
        this.restClient = restClient;
    }

    @GetMapping("/enquiry")
    public ResponseEntity<String> enquiry(
            @RequestParam
            MultiValueMap<String, String> query) {
        return restClient.get(
                "enq",
                query,
                "fc",
                "find-by-search");
    }

    @GetMapping("/detail/{path}/{id}")
    public ResponseEntity<String> detail(
            @PathVariable("path") String path,
            @PathVariable("id") String id) {
        return restClient.get(
                "enq",
                "fc",
                "batch",
                path,
                id);
    }

    @GetMapping("/parameters")
    public ResponseEntity<String> parameters(
            @RequestParam("form_type") String formType) {
        MultiValueMap<String, String> query =
                new LinkedMultiValueMap<>();

        query.add("form_type", formType);

        return restClient.get(
                null,
                query,
                "common",
                "get-parameter-list");
    }
}
