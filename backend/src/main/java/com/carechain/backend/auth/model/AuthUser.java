package com.carechain.backend.auth.model;

import java.time.OffsetDateTime;

public record AuthUser(
        String walletAddress,
        String walletChain,
        String status,
        OffsetDateTime createdAt,
        OffsetDateTime lastLoginAt
) {
    public AuthUser touch(OffsetDateTime loginAt) {
        return new AuthUser(walletAddress, walletChain, status, createdAt, loginAt);
    }
}
