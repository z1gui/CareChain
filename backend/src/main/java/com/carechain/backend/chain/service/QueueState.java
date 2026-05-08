package com.carechain.backend.chain.service;

import java.util.List;

public record QueueState(
        String walletAddress,
        String status,
        String source,
        int queueAssetCount,
        List<String> queueAssetIds,
        String details
) {
    public QueueState(String walletAddress, String status, String source) {
        this(walletAddress, status, source, 0, List.of(), "");
    }

    public static QueueState unknown(String walletAddress) {
        return new QueueState(
                walletAddress,
                "UNKNOWN",
                "PROGRAM_PARSER_NOT_CONFIGURED",
                0,
                List.of(),
                "Program account parser is not configured yet."
        );
    }
}
