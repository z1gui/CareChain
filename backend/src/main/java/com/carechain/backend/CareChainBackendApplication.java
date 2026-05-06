package com.carechain.backend;

import com.carechain.backend.auth.config.AuthProperties;
import com.carechain.backend.chain.config.HeliusProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({AuthProperties.class, HeliusProperties.class})
public class CareChainBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareChainBackendApplication.class, args);
    }
}
