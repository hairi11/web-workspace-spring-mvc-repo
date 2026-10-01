package com.company.web.fx.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.company.web.common.rest.config.RestClientSettings;
import com.company.web.common.rest.client.RestGateway;

@Service
public class FxRestClient extends RestGateway {

    public FxRestClient(
            @Qualifier("fxRestTemplate")
            RestTemplate restTemplate,
            @Qualifier("fxRestClientSettings")
            RestClientSettings settings) {
        super(
                restTemplate,
                settings.getMaxBodyLength());
    }
}
