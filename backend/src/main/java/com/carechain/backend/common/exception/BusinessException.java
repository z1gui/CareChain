package com.carechain.backend.common.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {
    private final String code;
    private final String details;
    private final HttpStatus status;

    public BusinessException(String message, String code, String details) {
        this(message, code, details, HttpStatus.BAD_REQUEST);
    }

    public BusinessException(String message, String code, String details, HttpStatus status) {
        super(message);
        this.code = code;
        this.details = details;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public String getDetails() {
        return details;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
