package com.company.web.fx.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.web.fx.service.FxRestClient;

@RestController
@RequestMapping("/fx/api")
public class FxApiController {

    private final FxRestClient restClient;

    public FxApiController(FxRestClient restClient) {
        this.restClient = restClient;
    }

    @GetMapping("/enquiry")
    public ResponseEntity<String> enquiry(@RequestParam MultiValueMap<String, String> query) {
        return restClient.get(query, "fx", "enquiry");
    }

    @GetMapping("/references")
    public ResponseEntity<String> references(@RequestParam MultiValueMap<String, String> query) {
        return restClient.get(query, "fx", "references");
    }

    @GetMapping("/validate-date")
    public ResponseEntity<String> validateDate(@RequestParam MultiValueMap<String, String> query) {
        return restClient.get(query, "fx", "validate-date");
    }

    @GetMapping("/masters/{id}")
    public ResponseEntity<String> masterById(@PathVariable String id) {
        return restClient.get("fx-masters", id);
    }

    @GetMapping("/masters/{id}/transactions")
    public ResponseEntity<String> transactionsByMasterId(@PathVariable String id) {
        return restClient.get("fx-masters", id, "transactions");
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<String> transactionById(@PathVariable String id) {
        return restClient.get("fx-transactions", id);
    }

    @PostMapping(value = "/transactions/{id}/delete", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteTransaction(
            @PathVariable String id,
            @RequestBody(required = false) String body) {
        return restClient.post(body, "fx-transactions", id, "delete");
    }

    @PostMapping(value = "/masters/{id}/delete", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteMaster(
            @PathVariable String id,
            @RequestBody(required = false) String body) {
        return restClient.post(body, "fx-masters", id, "delete");
    }

    @PostMapping(value = "/save", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> save(@RequestBody String body) {
        return restClient.post(body, "fx", "save");
    }

    @PostMapping(value = "/submit", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> submit(@RequestBody String body) {
        return restClient.post(body, "fx", "submit");
    }
}
