package com.carechain.backend.chain.service;

import com.carechain.backend.chain.client.HeliusClient;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@Slf4j
public class HeliusChainQueryService implements ChainQueryService {
    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_ASSET_LIMIT = 100;

    private final HeliusClient heliusClient;

    public HeliusChainQueryService(HeliusClient heliusClient) {
        this.heliusClient = heliusClient;
    }

    @Override
    public WalletAssets getAssets(String walletAddress) {
        JsonNode result = heliusClient.call("getAssetsByOwner", Map.of(
                "ownerAddress", walletAddress,
                "page", DEFAULT_PAGE,
                "limit", DEFAULT_ASSET_LIMIT
        ));
        log.info("result:"+result  );

        List<ChainAsset> assets = new ArrayList<>();
        for (JsonNode item : result.path("items")) {
            assets.add(toChainAsset(item));
        }
        return new WalletAssets(result.path("total").asInt(assets.size()), assets);
    }

    @Override
    public List<NftHolding> getNfts(String walletAddress) {
        JsonNode result = heliusClient.call("getAssetsByOwner", Map.of(
                "ownerAddress", walletAddress,
                "page", DEFAULT_PAGE,
                "limit", DEFAULT_ASSET_LIMIT
        ));
        log.info("result:"+result  );
        List<NftHolding> nfts = new ArrayList<>();
        for (JsonNode item : result.path("items")) {
            if (isNft(item)) {
                nfts.add(toNftHolding(item));
            }
        }
        return nfts;
    }

    @Override
    public YieldSummary getYield(String walletAddress) {
        List<NftHolding> nfts = getNfts(walletAddress);
        int yieldBearingAssetCount = (int) nfts.stream()
                .filter(this::isYieldRelatedNft)
                .count();
        BigDecimal estimatedAnnualYield = BigDecimal.valueOf(yieldBearingAssetCount)
                .multiply(new BigDecimal("2050.00"));
        BigDecimal estimatedMonthlyYield = estimatedAnnualYield
                .divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);

        return new YieldSummary(
                walletAddress,
                BigDecimal.ZERO,
                "LAMPORTS",
                "HELIUS_DAS_NFTS; claimable yield requires the yield_vault program account parser.",
                nfts.size(),
                yieldBearingAssetCount,
                0L,
                0L,
                yieldBearingAssetCount > 0 ? "POSITIONS_DETECTED_PARSER_PENDING" : "NO_YIELD_POSITIONS",
                estimatedMonthlyYield,
                estimatedAnnualYield
        );
    }

    @Override
    public QueueState getQueueState(String walletAddress) {
        List<NftHolding> nfts = getNfts(walletAddress);
        boolean hasPriorityBedRight = nfts.stream().anyMatch(this::isBedRightOccupancyNft);
        List<String> queueAssetIds = nfts.stream()
                .filter(nft -> isQueueRelatedNft(nft) || isBedRightOccupancyNft(nft))
                .map(NftHolding::id)
                .toList();
        String status = queueAssetIds.isEmpty() ? "NO_QUEUE_ASSETS" : "WAITING";
        String lane = null;
        Integer estimatedRank = null;
        Integer estimatedWaitDays = null;
        Long burnPricePerDay = null;
        Integer multiplierBps = null;
        boolean burnUpgradeAvailable = false;
        String suggestedInstruction = null;

        if (!queueAssetIds.isEmpty()) {
            lane = hasPriorityBedRight ? "P1" : "P3";
            estimatedRank = CareChainContractHeuristics.estimatedRankForLane(lane, queueAssetIds.size());
            estimatedWaitDays = CareChainContractHeuristics.estimatedWaitDaysForLane(lane);
            Map<String, Object> pricing = CareChainContractHeuristics.pricingForP3Count(queueAssetIds.size() * 10);
            burnPricePerDay = (Long) pricing.get("burnPricePerDay");
            multiplierBps = (Integer) pricing.get("multiplierBps");
            burnUpgradeAvailable = "P3".equals(lane);
            suggestedInstruction = hasPriorityBedRight ? "registerP1FromNft" : "joinP3Queue";
        }

        return new QueueState(
                walletAddress,
                status,
                "HELIUS_DAS_NFTS",
                queueAssetIds.size(),
                queueAssetIds,
                "Detailed queue rank requires the CareChain queue program account parser.",
                lane,
                estimatedRank,
                estimatedWaitDays,
                burnPricePerDay,
                multiplierBps,
                hasPriorityBedRight,
                burnUpgradeAvailable,
                suggestedInstruction
        );
    }

    @Override
    public List<ChainOperation> getHistory(String walletAddress, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 100));
        JsonNode result = heliusClient.call("getTransactionsForAddress", List.of(
                walletAddress,
                Map.of(
                        "limit", safeLimit,
                        "transactionDetails", "signatures"
                )
        ));

        List<ChainOperation> operations = new ArrayList<>();
        for (JsonNode item : result.path("data")) {
            operations.add(new ChainOperation(
                    text(item, "signature"),
                    number(item, "slot"),
                    number(item, "blockTime"),
                    text(item, "memo"),
                    item.path("err").isNull() || item.path("err").isMissingNode(),
                    item.toString()
            ));
        }
        return operations;
    }

    private ChainAsset toChainAsset(JsonNode item) {
        return new ChainAsset(
                text(item, "id"),
                text(item, "interface"),
                metadataText(item, "name"),
                metadataText(item, "symbol"),
                item.path("token_info").path("balance").asText(null),
                item.path("token_info").has("decimals") ? item.path("token_info").path("decimals").asInt() : null
        );
    }

    private NftHolding toNftHolding(JsonNode item) {
        return new NftHolding(
                text(item, "id"),
                text(item, "interface"),
                metadataText(item, "name"),
                metadataText(item, "symbol"),
                collection(item),
                item.toString()
        );
    }

    private boolean isNft(JsonNode item) {
        String interfaceType = text(item, "interface");
        return interfaceType != null && interfaceType.toUpperCase(Locale.ROOT).contains("NFT");
    }

    private boolean isQueueRelatedNft(NftHolding nft) {
        return CareChainContractHeuristics.isQueueRelated(nft.name(), nft.symbol());
    }

    private boolean isBedRightOccupancyNft(NftHolding nft) {
        return CareChainContractHeuristics.isBedRightOccupancy(nft.name(), nft.symbol());
    }

    private boolean isYieldRelatedNft(NftHolding nft) {
        return CareChainContractHeuristics.isYieldRelated(nft.name(), nft.symbol());
    }

    private String collection(JsonNode item) {
        for (JsonNode group : item.path("grouping")) {
            if ("collection".equals(text(group, "group_key"))) {
                return text(group, "group_value");
            }
        }
        return null;
    }

    private String metadataText(JsonNode item, String fieldName) {
        JsonNode value = item.path("content").path("metadata").path(fieldName);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }

    private String text(JsonNode item, String fieldName) {
        JsonNode value = item.path(fieldName);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }

    private Long number(JsonNode item, String fieldName) {
        JsonNode value = item.path(fieldName);
        return value.isMissingNode() || value.isNull() ? null : value.asLong();
    }
}
