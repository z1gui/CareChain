package com.carechain.backend.portfolio.service;

import com.carechain.backend.chain.service.ChainAsset;
import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.NftHolding;
import com.carechain.backend.chain.service.QueueState;
import com.carechain.backend.chain.service.WalletAssets;
import com.carechain.backend.chain.service.YieldSummary;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PortfolioServiceTests {

    @Test
    void getWalletAssetsDelegatesToChainQueryService() {
        RecordingChainQueryService chainQueryService = new RecordingChainQueryService();
        PortfolioService service = new PortfolioService(chainQueryService);

        WalletAssets assets = service.getWalletAssets("wallet-1");

        assertThat(chainQueryService.assetsWallet).isEqualTo("wallet-1");
        assertThat(assets.total()).isEqualTo(1);
        assertThat(assets.items().get(0).name()).isEqualTo("Care Token");
    }

    @Test
    void getWalletYieldDelegatesToChainQueryService() {
        RecordingChainQueryService chainQueryService = new RecordingChainQueryService();
        PortfolioService service = new PortfolioService(chainQueryService);

        YieldSummary yield = service.getWalletYield("wallet-1");

        assertThat(chainQueryService.yieldWallet).isEqualTo("wallet-1");
        assertThat(yield.totalYield()).isEqualByComparingTo("12.50");
    }

    @Test
    void getWalletNftsDelegatesToChainQueryService() {
        RecordingChainQueryService chainQueryService = new RecordingChainQueryService();
        PortfolioService service = new PortfolioService(chainQueryService);

        List<NftHolding> nfts = service.getWalletNfts("wallet-1");

        assertThat(chainQueryService.nftsWallet).isEqualTo("wallet-1");
        assertThat(nfts).extracting(NftHolding::name).containsExactly("Queue Pass");
    }

    private static class RecordingChainQueryService implements ChainQueryService {
        private String assetsWallet;
        private String yieldWallet;
        private String nftsWallet;

        @Override
        public WalletAssets getAssets(String walletAddress) {
            assetsWallet = walletAddress;
            return new WalletAssets(1, List.of(new ChainAsset("asset-1", "FungibleToken", "Care Token", "CARE", "100", 2)));
        }

        @Override
        public List<NftHolding> getNfts(String walletAddress) {
            nftsWallet = walletAddress;
            return List.of(new NftHolding("nft-1", "V1_NFT", "Queue Pass", "QP", "collection-1", "{}"));
        }

        @Override
        public YieldSummary getYield(String walletAddress) {
            yieldWallet = walletAddress;
            return new YieldSummary(walletAddress, new BigDecimal("12.50"), "USDC", "test");
        }

        @Override
        public QueueState getQueueState(String walletAddress) {
            return QueueState.unknown(walletAddress);
        }

        @Override
        public List<com.carechain.backend.chain.service.ChainOperation> getHistory(String walletAddress, int limit) {
            return List.of();
        }
    }
}
