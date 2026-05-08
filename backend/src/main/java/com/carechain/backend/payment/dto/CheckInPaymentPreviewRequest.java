package com.carechain.backend.payment.dto;

import javax.validation.constraints.NotBlank;

public record CheckInPaymentPreviewRequest(
        @NotBlank(message = "applicationId is required")
        String applicationId
) {
}
