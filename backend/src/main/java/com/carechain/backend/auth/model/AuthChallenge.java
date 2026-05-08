package com.carechain.backend.auth.model;

import java.time.OffsetDateTime;

public record AuthChallenge(
        String challengeId,
        String walletAddress,
        String nonce,
        String message,
        String status,
        OffsetDateTime issuedAt,
        OffsetDateTime expiredAt
) {
    public AuthChallenge markUsed() {
        return new AuthChallenge(
                challengeId,
                walletAddress,
                nonce,
                message,
                "USED",
                issuedAt,
                expiredAt
        );
    }
}
