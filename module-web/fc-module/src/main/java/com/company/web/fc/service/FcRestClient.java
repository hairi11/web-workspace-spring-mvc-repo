package com.company.web.fc.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.company.web.common.rest.config.RestClientSettings;
import com.company.web.common.rest.client.RestGateway;

@Service
public class FcRestClient extends RestGateway {

    public FcRestClient(
            @Qualifier("fcRestTemplate")
            RestTemplate restTemplate,
            @Qualifier("fcRestClientSettings")
            RestClientSettings settings) {
        super(
                restTemplate,
                settings);
    }
}
