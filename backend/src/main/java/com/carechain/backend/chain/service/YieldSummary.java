package com.carechain.backend.chain.service;

import java.math.BigDecimal;

public record YieldSummary(
        String walletAddress,
        BigDecimal totalYield,
        String currency,
        String source,
        int observedAssetCount
) {
    public YieldSummary(String walletAddress, BigDecimal totalYield, String currency, String source) {
        this(walletAddress, totalYield, currency, source, 0);
    }

    public static YieldSummary fromAssetSnapshot(String walletAddress, int observedAssetCount) {
        return new YieldSummary(
                walletAddress,
                BigDecimal.ZERO,
                "UNKNOWN",
                "HELIUS_DAS_ASSETS; yield program parser is not configured yet.",
                observedAssetCount
        );
    }

    public static YieldSummary empty(String walletAddress) {
        return new YieldSummary(walletAddress, BigDecimal.ZERO, "UNKNOWN", "Yield program parser is not configured yet.", 0);
    }
}
