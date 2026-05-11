package com.carechain.backend.portfolio.service;

import com.carechain.backend.chain.service.CareChainContractHeuristics;
import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.NftHolding;
import com.carechain.backend.chain.service.WalletAssets;
import com.carechain.backend.chain.service.YieldSummary;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.List;

@Service
public class PortfolioService {

    private final ChainQueryService chainQueryService;

    public PortfolioService(ChainQueryService chainQueryService) {
        this.chainQueryService = chainQueryService;
    }

    public Map<String, Object> getSummary(String walletAddress) {
        return Map.ofEntries(
                Map.entry("walletAddress", walletAddress),
                Map.entry("totalNfts", 3),
                Map.entry("totalValueSol", 225.00),
                Map.entry("monthlyYieldSol", 9.55),
                Map.entry("accruedYieldSol", 124.012),
                Map.entry("annualApy", 8.2),
                Map.entry("averageOccupancy", 94.2),
                Map.entry("scarcityStatus", "HIGH_DEMAND"),
                Map.entry("queueJumpCostPerDay", CareChainContractHeuristics.MID_BURN_PRICE_PER_DAY),
                Map.entry("queuePricingBands", List.of(
                        Map.of("p3CountMin", 0, "p3CountMax", 9, "burnPricePerDay", 10, "multiplierBps", 10_000),
                        Map.of("p3CountMin", 10, "p3CountMax", 50, "burnPricePerDay", 15, "multiplierBps", 15_000),
                        Map.of("p3CountMin", 51, "p3CountMax", Integer.MAX_VALUE, "burnPricePerDay", 20, "multiplierBps", 20_000)
                ))
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
                        "status", "ACTIVE",
                        "claimFlow", "claimYield",
                        "yieldPositionState", "PROGRAM_PARSER_PENDING"
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

    public Map<String, Object> getYieldTrend(String walletAddress, String range) {
        return Map.of(
                "walletAddress", walletAddress,
                "range", range,
                "unit", "SOL_ESTIMATE",
                "source", "CONTRACT_HEURISTIC_FROM_YIELD_POSITIONS",
                "points", List.of(
                        Map.of("label", "Nov", "yieldSol", 10.2, "claimableLamports", 0),
                        Map.of("label", "Dec", "yieldSol", 11.0, "claimableLamports", 0),
                        Map.of("label", "Jan", "yieldSol", 6.0, "claimableLamports", 0),
                        Map.of("label", "Feb", "yieldSol", 7.5, "claimableLamports", 0),
                        Map.of("label", "Mar", "yieldSol", 7.2, "claimableLamports", 0),
                        Map.of("label", "Apr", "yieldSol", 9.5, "claimableLamports", 0)


                )
        );
    }
}
