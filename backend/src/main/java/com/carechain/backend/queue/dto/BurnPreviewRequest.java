package com.carechain.backend.queue.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

public record BurnPreviewRequest(
        @NotBlank(message = "applicationId is required")
        String applicationId,
        @Min(value = 0, message = "burnAmount must be >= 0")
        long burnAmount
) {
}
