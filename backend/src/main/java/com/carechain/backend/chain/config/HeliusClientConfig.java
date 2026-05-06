package com.carechain.backend.chain.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class HeliusClientConfig {

    @Bean
    public RestTemplate heliusRestTemplate(RestTemplateBuilder builder, HeliusProperties properties) {
        Duration timeout = Duration.ofMillis(properties.getTimeoutMs());
        return builder
                .setConnectTimeout(timeout)
                .setReadTimeout(timeout)
                .build();
    }
}
