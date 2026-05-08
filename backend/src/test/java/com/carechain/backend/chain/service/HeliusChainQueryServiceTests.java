package com.carechain.backend.chain.service;

import com.carechain.backend.chain.client.HeliusClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class HeliusChainQueryServiceTests {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getAssetsMapsDASAssetsByOwnerResponse() throws Exception {
        RecordingHeliusClient client = new RecordingHeliusClient(objectMapper.readTree("""
                {
                  "total": 2,
                  "items": [
                    {
                      "id": "asset-1",
                      "interface": "FungibleToken",
                      "content": { "metadata": { "name": "Care Token", "symbol": "CARE" } },
                      "token_info": { "balance": 1250, "decimals": 2 }
                    },
                    {
                      "id": "nft-1",
                      "interface": "V1_NFT",
                      "content": { "metadata": { "name": "Queue Pass", "symbol": "QP" } },
                      "grouping": [{ "group_key": "collection", "group_value": "collection-1" }]
                    }
                  ]
                }
                """));
        HeliusChainQueryService service = new HeliusChainQueryService(client);

        WalletAssets assets = service.getAssets("wallet-1");

        assertThat(client.method()).isEqualTo("getAssetsByOwner");
        assertThat(client.params().get("ownerAddress")).isEqualTo("wallet-1");
        assertThat(client.params().get("page")).isEqualTo(1);
        assertThat(client.params().get("limit")).isEqualTo(100);
        assertThat(assets.total()).isEqualTo(2);
        assertThat(assets.items()).hasSize(2);
        assertThat(assets.items().get(0).id()).isEqualTo("asset-1");
        assertThat(assets.items().get(0).name()).isEqualTo("Care Token");
        assertThat(assets.items().get(0).symbol()).isEqualTo("CARE");
        assertThat(assets.items().get(0).balance()).isEqualTo("1250");
        assertThat(assets.items().get(0).decimals()).isEqualTo(2);
    }

    @Test
    void getNftsReturnsOnlyNftInterfaces() throws Exception {
        RecordingHeliusClient client = new RecordingHeliusClient(objectMapper.readTree("""
                {
                  "total": 3,
                  "items": [
                    { "id": "token-1", "interface": "FungibleToken" },
                    {
                      "id": "nft-1",
                      "interface": "V1_NFT",
                      "content": { "metadata": { "name": "Queue Pass" } },
                      "grouping": [{ "group_key": "collection", "group_value": "collection-1" }]
                    },
                    {
                      "id": "nft-2",
                      "interface": "ProgrammableNFT",
                      "content": { "metadata": { "name": "Care Badge" } }
                    }
                  ]
                }
                """));
        HeliusChainQueryService service = new HeliusChainQueryService(client);

        List<NftHolding> nfts = service.getNfts("wallet-1");

        assertThat(nfts).extracting(NftHolding::id).containsExactly("nft-1", "nft-2");
        assertThat(nfts.get(0).collection()).isEqualTo("collection-1");
        assertThat(nfts.get(1).name()).isEqualTo("Care Badge");
    }

    @Test
    void getYieldUsesHeliusAssetSnapshot() throws Exception {
        RecordingHeliusClient client = new RecordingHeliusClient(objectMapper.readTree("""
                {
                  "total": 2,
                  "items": []
                }
                """));
        HeliusChainQueryService service = new HeliusChainQueryService(client);

        YieldSummary yield = service.getYield("wallet-1");

        assertThat(client.method()).isEqualTo("getAssetsByOwner");
        assertThat(yield.walletAddress()).isEqualTo("wallet-1");
        assertThat(yield.observedAssetCount()).isEqualTo(2);
        assertThat(yield.source()).contains("HELIUS_DAS_ASSETS");
    }

    @Test
    void getQueueStateUsesNftSnapshotForQueueDetails() throws Exception {
        RecordingHeliusClient client = new RecordingHeliusClient(objectMapper.readTree("""
                {
                  "total": 2,
                  "items": [
                    {
                      "id": "queue-nft-1",
                      "interface": "V1_NFT",
                      "content": { "metadata": { "name": "Queue Pass", "symbol": "QP" } }
                    },
                    {
                      "id": "badge-1",
                      "interface": "V1_NFT",
                      "content": { "metadata": { "name": "Care Badge", "symbol": "CARE" } }
                    }
                  ]
                }
                """));
        HeliusChainQueryService service = new HeliusChainQueryService(client);

        QueueState state = service.getQueueState("wallet-1");

        assertThat(client.method()).isEqualTo("getAssetsByOwner");
        assertThat(state.status()).isEqualTo("HAS_QUEUE_ASSETS");
        assertThat(state.queueAssetCount()).isEqualTo(1);
        assertThat(state.queueAssetIds()).containsExactly("queue-nft-1");
    }

    @Test
    void getHistoryUsesGetTransactionsForAddressAndMapsResponseData() throws Exception {
        RecordingHeliusClient client = new RecordingHeliusClient(objectMapper.readTree("""
                {
                  "data": [
                    {
                      "signature": "sig-1",
                      "slot": 101,
                      "blockTime": 1710000000,
                      "memo": "first",
                      "err": null
                    },
                    {
                      "signature": "sig-2",
                      "slot": 102,
                      "blockTime": 1710000100,
                      "memo": null,
                      "err": { "InstructionError": [0, "Custom"] }
                    }
                  ],
                  "paginationToken": "102:1"
                }
                """));
        HeliusChainQueryService service = new HeliusChainQueryService(client);

        List<ChainOperation> operations = service.getHistory("wallet-1", 25);

        assertThat(client.method()).isEqualTo("getTransactionsForAddress");
        assertThat(client.listParams()).hasSize(2);
        assertThat(client.listParams().get(0)).isEqualTo("wallet-1");
        assertThat(client.listParams().get(1)).isEqualTo(Map.of(
                "limit", 25,
                "transactionDetails", "signatures"
        ));
        assertThat(operations).hasSize(2);
        assertThat(operations.get(0).signature()).isEqualTo("sig-1");
        assertThat(operations.get(0).successful()).isTrue();
        assertThat(operations.get(1).signature()).isEqualTo("sig-2");
        assertThat(operations.get(1).successful()).isFalse();
        assertThat(operations.get(1).raw()).contains("InstructionError");
    }

    private static class RecordingHeliusClient implements HeliusClient {
        private final JsonNode response;
        private String method;
        private Object params;

        RecordingHeliusClient(JsonNode response) {
            this.response = response;
        }

        @Override
        public JsonNode call(String method, Object params) {
            this.method = method;
            this.params = params;
            return response;
        }

        String method() {
            return method;
        }

        Map<?, ?> params() {
            if (params instanceof Map<?, ?> paramsMap) {
                return paramsMap;
            }
            throw new AssertionError("Expected params to be a map but was " + params);
        }

        List<?> listParams() {
            if (params instanceof List<?> paramsList) {
                return paramsList;
            }
            throw new AssertionError("Expected params to be a list but was " + params);
        }
    }
}
