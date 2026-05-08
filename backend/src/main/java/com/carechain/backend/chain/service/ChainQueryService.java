package com.carechain.backend.chain.service;

import java.util.List;

public interface ChainQueryService {
    WalletAssets getAssets(String walletAddress);

    List<NftHolding> getNfts(String walletAddress);

    YieldSummary getYield(String walletAddress);

    QueueState getQueueState(String walletAddress);

    List<ChainOperation> getHistory(String walletAddress, int limit);
}
