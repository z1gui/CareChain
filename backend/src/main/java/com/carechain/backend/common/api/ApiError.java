package com.carechain.backend.common.api;

public record ApiError(
        String code,
        String details
) {
}
