package com.carechain.backend.auth.dto;

import javax.validation.constraints.NotBlank;

public record AuthChallengeRequest(
        @NotBlank(message = "walletAddress is required")
        String walletAddress
) {
}
