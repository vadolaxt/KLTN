package com.be.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Value("${FASTAPI_BASE_URL}")
    private String fastapiBaseUrl;

    @Bean
    public RestClient fastapiClient() {
        return RestClient.builder()
                .baseUrl(fastapiBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                // Bạn có thể thêm Timeout hoặc interceptor tại đây
                .build();
    }
}
