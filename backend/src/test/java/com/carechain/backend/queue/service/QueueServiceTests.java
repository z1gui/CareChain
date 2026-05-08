package com.carechain.backend.queue.service;

import com.carechain.backend.chain.service.ChainOperation;
import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.NftHolding;
import com.carechain.backend.chain.service.QueueState;
import com.carechain.backend.chain.service.WalletAssets;
import com.carechain.backend.chain.service.YieldSummary;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class QueueServiceTests {

    @Test
    void getCurrentQueueStateDelegatesToChainQueryService() {
        RecordingChainQueryService chainQueryService = new RecordingChainQueryService();
        QueueService service = new QueueService(chainQueryService);

        QueueState state = service.getCurrentQueueState("wallet-1");

        assertThat(chainQueryService.queueWallet).isEqualTo("wallet-1");
        assertThat(state.status()).isEqualTo("WAITING");
    }

    private static class RecordingChainQueryService implements ChainQueryService {
        private String queueWallet;

        @Override
        public WalletAssets getAssets(String walletAddress) {
            return new WalletAssets(0, List.of());
        }

        @Override
        public List<NftHolding> getNfts(String walletAddress) {
            return List.of();
        }

        @Override
        public YieldSummary getYield(String walletAddress) {
            return YieldSummary.empty(walletAddress);
        }

        @Override
        public QueueState getQueueState(String walletAddress) {
            queueWallet = walletAddress;
            return new QueueState(walletAddress, "WAITING", "test");
        }

        @Override
        public List<ChainOperation> getHistory(String walletAddress, int limit) {
            return List.of();
        }
    }
}
