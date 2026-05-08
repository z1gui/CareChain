package com.carechain.backend.chain.service;

import java.util.List;

public record WalletAssets(
        int total,
        List<ChainAsset> items
) {
}
