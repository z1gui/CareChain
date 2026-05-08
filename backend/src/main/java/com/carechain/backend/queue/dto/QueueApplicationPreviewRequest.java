package com.carechain.backend.queue.dto;

import javax.validation.constraints.NotBlank;

public record QueueApplicationPreviewRequest(
        @NotBlank(message = "facilityId is required")
        String facilityId,
        @NotBlank(message = "bedAssetId is required")
        String bedAssetId
) {
}
