package com.company.web.fc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
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
                query,
                "fc",
                "enquiry");
    }
}
