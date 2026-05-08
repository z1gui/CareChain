package com.carechain.backend.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "auth")
public class AuthProperties {
    private long challengeTtlMinutes = 5;
    private long jwtExpirationMinutes = 120;
    private String jwtSecret = "change-this-dev-secret-to-a-long-random-value";
    private String messageStatement = "Sign this message to log in to CareChain.";

    public long getChallengeTtlMinutes() {
        return challengeTtlMinutes;
    }

    public void setChallengeTtlMinutes(long challengeTtlMinutes) {
        this.challengeTtlMinutes = challengeTtlMinutes;
    }

    public long getJwtExpirationMinutes() {
        return jwtExpirationMinutes;
    }

    public void setJwtExpirationMinutes(long jwtExpirationMinutes) {
        this.jwtExpirationMinutes = jwtExpirationMinutes;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String getMessageStatement() {
        return messageStatement;
    }

    public void setMessageStatement(String messageStatement) {
        this.messageStatement = messageStatement;
    }
}
