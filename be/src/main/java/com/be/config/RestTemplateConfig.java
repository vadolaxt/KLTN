package com.be.config;

import org.springframework.context.annotation.Bean;

@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
