package com.carechain.backend.auth.dto;

import javax.validation.constraints.NotBlank;

public record AuthVerifyRequest(
        @NotBlank(message = "challengeId is required")
        String challengeId,
        @NotBlank(message = "walletAddress is required")
        String walletAddress,
        @NotBlank(message = "signature is required")
        String signature,
        @NotBlank(message = "message is required")
        String message
) {
}
