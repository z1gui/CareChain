package com.carechain.backend.chain.service;

import com.carechain.backend.chain.client.HeliusClient;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
        WalletAssets assets = getAssets(walletAddress);
        return YieldSummary.fromAssetSnapshot(walletAddress, assets.total());
    }

    @Override
    public QueueState getQueueState(String walletAddress) {
        List<NftHolding> nfts = getNfts(walletAddress);
        List<String> queueAssetIds = nfts.stream()
                .filter(this::isQueueRelatedNft)
                .map(NftHolding::id)
                .toList();
        String status = queueAssetIds.isEmpty() ? "NO_QUEUE_ASSETS" : "HAS_QUEUE_ASSETS";
        return new QueueState(
                walletAddress,
                status,
                "HELIUS_DAS_NFTS",
                queueAssetIds.size(),
                queueAssetIds,
                "Detailed queue rank requires the CareChain queue program account parser."
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
        String name = nft.name() == null ? "" : nft.name().toLowerCase(Locale.ROOT);
        String symbol = nft.symbol() == null ? "" : nft.symbol().toLowerCase(Locale.ROOT);
        return name.contains("queue") || symbol.contains("queue") || symbol.contains("qp");
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
