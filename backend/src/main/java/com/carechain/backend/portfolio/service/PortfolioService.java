package com.carechain.backend.portfolio.service;

import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.NftHolding;
import com.carechain.backend.chain.service.WalletAssets;
import com.carechain.backend.chain.service.YieldSummary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    private final ChainQueryService chainQueryService;

    public PortfolioService(ChainQueryService chainQueryService) {
        this.chainQueryService = chainQueryService;
    }

    public Map<String, Object> getSummary() {
        return Map.of(
                "walletAddress", "5end...4jdx",
                "totalNfts", 3,
                "totalValueUsdc", 22500.00,
                "monthlyYieldUsdc", 95.50,
                "accruedYieldUsdc", 1240.12,
                "annualApy", 8.2,
                "averageOccupancy", 94.2,
                "scarcityStatus", "HIGH_DEMAND",
                "queueJumpCostPerDay", 20
        );
    }

    public List<Map<String, Object>> getHoldings() {
        return List.of(
                Map.of(
                        "id", "holding_001",
                        "assetCode", "FSH-A301",
                        "facilityName", "Foshan Leyi Care Center",
                        "mode", "YIELD",
                        "yieldApy", 7.2,
                        "status", "ACTIVE"
                )
        );
    }

    public WalletAssets getWalletAssets(String walletAddress) {
        return chainQueryService.getAssets(walletAddress);
    }

    public YieldSummary getWalletYield(String walletAddress) {
        return chainQueryService.getYield(walletAddress);
    }

    public List<NftHolding> getWalletNfts(String walletAddress) {
        return chainQueryService.getNfts(walletAddress);
    }

    public Map<String, Object> getYieldTrend(String range) {
        return Map.of(
                "range", range,
                "points", List.of(
                        Map.of("label", "Jan", "yieldUsdc", 60.0),
                        Map.of("label", "Feb", "yieldUsdc", 75.0),
                        Map.of("label", "Mar", "yieldUsdc", 72.0),
                        Map.of("label", "Apr", "yieldUsdc", 90.0),
                        Map.of("label", "May", "yieldUsdc", 102.0),
                        Map.of("label", "Jun", "yieldUsdc", 110.0)
                )
        );
    }
}
