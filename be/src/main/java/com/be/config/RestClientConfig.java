package com.be.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Value("${FASTAPI_BASE_URL}")
    private String fastapiBaseUrl;

    @Bean
    public RestClient fastapiClient() {
        String normalizedBaseUrl = fastapiBaseUrl.endsWith("/") ? fastapiBaseUrl : fastapiBaseUrl + "/";

        return RestClient.builder()
                .baseUrl(normalizedBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
