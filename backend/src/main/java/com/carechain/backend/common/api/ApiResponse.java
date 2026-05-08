package com.carechain.backend.common.api;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        ApiError error
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "", data, null);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> fail(String message, String code, String details) {
        return new ApiResponse<>(false, message, null, new ApiError(code, details));
    }
}
