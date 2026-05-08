package com.carechain.backend.chain.controller;

import com.carechain.backend.chain.service.ChainOperation;
import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.NftHolding;
import com.carechain.backend.chain.service.QueueState;
import com.carechain.backend.chain.service.WalletAssets;
import com.carechain.backend.chain.service.YieldSummary;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ChainControllerTests {

    @Test
    void getHistoryDelegatesWalletAndLimitToChainQueryService() {
        RecordingChainQueryService chainQueryService = new RecordingChainQueryService();
        ChainController controller = new ChainController(chainQueryService);

        List<ChainOperation> operations = controller.getHistory("wallet-1", 25).data();

        assertThat(chainQueryService.historyWallet).isEqualTo("wallet-1");
        assertThat(chainQueryService.historyLimit).isEqualTo(25);
        assertThat(operations).extracting(ChainOperation::signature).containsExactly("sig-1");
    }

    private static class RecordingChainQueryService implements ChainQueryService {
        private String historyWallet;
        private int historyLimit;

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
            return QueueState.unknown(walletAddress);
        }

        @Override
        public List<ChainOperation> getHistory(String walletAddress, int limit) {
            historyWallet = walletAddress;
            historyLimit = limit;
            return List.of(new ChainOperation("sig-1", 100L, 200L, null, true, "{}"));
        }
    }
}
