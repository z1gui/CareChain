package com.carechain.backend.chain.service;

public record ChainOperation(
        String signature,
        Long slot,
        Long blockTime,
        String memo,
        boolean successful,
        String raw
) {
}
