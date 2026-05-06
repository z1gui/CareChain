package com.carechain.backend.queue.service;

import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.QueueState;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QueueService {

    private final ChainQueryService chainQueryService;

    public QueueService(ChainQueryService chainQueryService) {
        this.chainQueryService = chainQueryService;
    }

    public Map<String, Object> previewApplication(String facilityId, String bedAssetId) {
        return Map.of(
                "facilityId", facilityId,
                "bedAssetId", bedAssetId,
                "currentTier", "P3",
                "currentRank", 142,
                "estimatedWaitDays", 540
        );
    }

    public Map<String, Object> createApplication(String facilityId, String bedAssetId) {
        return Map.of(
                "applicationId", "qa_" + UUID.randomUUID(),
                "facilityId", facilityId,
                "bedAssetId", bedAssetId,
                "status", "WAITING"
        );
    }

    public Map<String, Object> previewBurn(String applicationId, long burnAmount) {
        return Map.ofEntries(
                Map.entry("applicationId", applicationId),
                Map.entry("currentTier", "P3"),
                Map.entry("currentRank", 142),
                Map.entry("newTier", "P2"),
                Map.entry("newRank", 12),
                Map.entry("estimatedWaitDaysBefore", 540),
                Map.entry("estimatedWaitDaysAfter", 30),
                Map.entry("timeSavedDays", 510),
                Map.entry("burnAmount", burnAmount),
                Map.entry("burnValueUsdc", "1240.50"),
                Map.entry("estimatedGasUsdc", "2.40")
        );
    }

    public Map<String, Object> createBurnOrder(String applicationId, long burnAmount) {
        return Map.of(
                "burnOrderId", "bo_" + UUID.randomUUID(),
                "applicationId", applicationId,
                "burnAmount", burnAmount,
                "status", "PENDING_SIGNATURE"
        );
    }

    public Map<String, Object> getGlobalQueue() {
        return Map.of(
                "p1", List.of(Map.of("wallet", "Wallet...7x9a", "rank", 1)),
                "p2", List.of(Map.of("wallet", "Wallet...z2b4", "rank", 1)),
                "p3", List.of(Map.of("wallet", "Wallet...r3q1", "rank", 1))
        );
    }

    public QueueState getCurrentQueueState(String walletAddress) {
        return chainQueryService.getQueueState(walletAddress);
    }
}
