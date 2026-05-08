package com.carechain.backend.chain.service;

public record ChainAsset(
        String id,
        String interfaceType,
        String name,
        String symbol,
        String balance,
        Integer decimals
) {
}
