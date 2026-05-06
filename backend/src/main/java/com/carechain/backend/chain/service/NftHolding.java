package com.carechain.backend.chain.service;

public record NftHolding(
        String id,
        String interfaceType,
        String name,
        String symbol,
        String collection,
        String raw
) {
}
