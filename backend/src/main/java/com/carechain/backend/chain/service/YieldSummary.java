package com.carechain.backend.chain.service;

import java.math.BigDecimal;

public record YieldSummary(
        String walletAddress,
        BigDecimal totalYield,
        String currency,
        String source,
        int observedAssetCount,
        int yieldBearingAssetCount,
        long claimableLamports,
        long claimedLamports,
        String claimState,
        BigDecimal estimatedMonthlyYield,
        BigDecimal estimatedAnnualYield
) {
    public YieldSummary(String walletAddress, BigDecimal totalYield, String currency, String source) {
        this(walletAddress, totalYield, currency, source, 0, 0, 0L, 0L, "UNKNOWN", BigDecimal.ZERO, BigDecimal.ZERO);
    }

    public static YieldSummary fromAssetSnapshot(String walletAddress, int observedAssetCount) {
        return new YieldSummary(
                walletAddress,
                BigDecimal.ZERO,
                "UNKNOWN",
                "HELIUS_DAS_ASSETS; yield program parser is not configured yet.",
                observedAssetCount,
                0,
                0L,
                0L,
                "PROGRAM_PARSER_NOT_CONFIGURED",
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
    }

    public static YieldSummary empty(String walletAddress) {
        return new YieldSummary(
                walletAddress,
                BigDecimal.ZERO,
                "UNKNOWN",
                "Yield program parser is not configured yet.",
                0,
                0,
                0L,
                0L,
                "NO_YIELD_POSITIONS",
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
    }
}
