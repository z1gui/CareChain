package com.carechain.backend.queue.service;

import com.carechain.backend.chain.service.CareChainContractHeuristics;
import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.chain.service.QueueState;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
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
        String inferredLane = CareChainContractHeuristics.previewLaneForBedAsset(bedAssetId);
        int simulatedP3Count = "P1".equals(inferredLane) ? 18 : 24;
        Map<String, Object> pricing = CareChainContractHeuristics.pricingForP3Count(simulatedP3Count);

        LinkedHashMap<String, Object> payload = new LinkedHashMap<>();
        payload.put("facilityId", facilityId);
        payload.put("bedAssetId", bedAssetId);
        payload.put("currentTier", inferredLane);
        payload.put("projectedStatus", "WAITING");
        payload.put("currentRank", CareChainContractHeuristics.estimatedRankForLane(inferredLane, 2));
        payload.put("estimatedWaitDays", CareChainContractHeuristics.estimatedWaitDaysForLane(inferredLane));
        payload.put("queueNoPreview", "P1".equals(inferredLane) ? 0 : 125);
        payload.put("suggestedInstruction", CareChainContractHeuristics.suggestedQueueInstruction(inferredLane));
        payload.put("pricingSnapshot", pricing);
        payload.put("eligibility", Map.of(
                "p1Eligible", "P1".equals(inferredLane),
                "p2UpgradeAvailable", "P3".equals(inferredLane),
                "requiresBedRightOccupancyNft", "P1".equals(inferredLane)
        ));
        payload.put("nextActions", "P1".equals(inferredLane)
                ? List.of("connect-wallet", "verify-bedright-occupancy-nft", "register-p1-from-nft")
                : List.of("connect-wallet", "join-p3-queue", "optional-burn-care-and-upgrade"));
        payload.put("contractHints", Map.of(
                "queueStatePdaSeed", List.of("queue_state", facilityId),
                "queueEntryPdaSeed", List.of("queue_entry", facilityId, "applicantId"),
                "bedAllocationPolicy", "ADMIN_SELECTS_APPLICANT_BY_ID"
        ));
        return payload;
    }

    public Map<String, Object> createApplication(String facilityId, String bedAssetId) {
        String inferredLane = CareChainContractHeuristics.previewLaneForBedAsset(bedAssetId);
        String applicationId = "qa_" + UUID.randomUUID();
        LinkedHashMap<String, Object> payload = new LinkedHashMap<>();
        payload.put("applicationId", applicationId);
        payload.put("facilityId", facilityId);
        payload.put("bedAssetId", bedAssetId);
        payload.put("status", "WAITING");
        payload.put("lane", inferredLane);
        payload.put("queueNo", "P1".equals(inferredLane) ? 0 : 125);
        payload.put("estimatedRank", CareChainContractHeuristics.estimatedRankForLane(inferredLane, 2));
        payload.put("estimatedWaitDays", CareChainContractHeuristics.estimatedWaitDaysForLane(inferredLane));
        payload.put("onchainPlan", Map.of(
                "program", "priority_queue",
                "instruction", CareChainContractHeuristics.suggestedQueueInstruction(inferredLane),
                "followUpInstructions", "P3".equals(inferredLane)
                        ? List.of("allocateNextBed", "confirmAdmission", "optional burnCareAndUpgrade")
                        : List.of("allocateNextBed", "confirmAdmission")
        ));
        payload.put("pricingSnapshot", CareChainContractHeuristics.pricingForP3Count("P1".equals(inferredLane) ? 18 : 24));
        return payload;
    }

    public Map<String, Object> previewBurn(String applicationId, long burnAmount) {
        boolean executable = burnAmount > 0;
        int beforeWaitDays = CareChainContractHeuristics.estimatedWaitDaysForLane("P3");
        int afterWaitDays = executable ? CareChainContractHeuristics.estimatedWaitDaysForLane("P2") : beforeWaitDays;
        int currentRank = CareChainContractHeuristics.estimatedRankForLane("P3", 2);
        int newRank = executable ? CareChainContractHeuristics.estimatedRankForLane("P2", 2) : currentRank;

        LinkedHashMap<String, Object> payload = new LinkedHashMap<>();
        payload.put("applicationId", applicationId);
        payload.put("currentTier", "P3");
        payload.put("currentRank", currentRank);
        payload.put("newTier", executable ? "P2" : "P3");
        payload.put("newRank", newRank);
        payload.put("estimatedWaitDaysBefore", beforeWaitDays);
        payload.put("estimatedWaitDaysAfter", afterWaitDays);
        payload.put("timeSavedDays", Math.max(beforeWaitDays - afterWaitDays, 0));
        payload.put("burnAmount", burnAmount);
        payload.put("burnValueUsdc", burnAmount <= 0 ? "0.00" : "1240.50");
        payload.put("estimatedGasUsdc", burnAmount <= 0 ? "0.00" : "2.40");
        payload.put("eligible", executable);
        payload.put("blockingReason", executable ? "" : "priority_queue.burnCareAndUpgrade requires burn_amount > 0");
        payload.put("suggestedInstruction", "burnCareAndUpgrade");
        payload.put("pricingAfterUpgrade", CareChainContractHeuristics.pricingForP3Count(18));
        return payload;
    }

    public Map<String, Object> createBurnOrder(String applicationId, long burnAmount) {
        String burnOrderId = "bo_" + UUID.randomUUID();
        LinkedHashMap<String, Object> payload = new LinkedHashMap<>();
        payload.put("burnOrderId", burnOrderId);
        payload.put("applicationId", applicationId);
        payload.put("burnAmount", burnAmount);
        payload.put("status", burnAmount > 0 ? "PENDING_SIGNATURE" : "INVALID_PREVIEW");
        payload.put("instruction", "burnCareAndUpgrade");
        payload.put("expectedLaneTransition", burnAmount > 0 ? "P3_TO_P2" : "NO_CHANGE");
        payload.put("requiresUserSignature", true);
        payload.put("tokenRequirements", Map.of(
                "mintSymbol", "CARE",
                "ataOwnerMustMatchApplicant", true,
                "minimumBurnAmount", 1
        ));
        return payload;
    }

    public Map<String, Object> getGlobalQueue() {
        LinkedHashMap<String, Object> payload = new LinkedHashMap<>();
        payload.put("queueModel", "priority_queue");
        payload.put("allocationMode", "ADMIN_TARGETS_APPLICANT_ID");
        payload.put("admissionRequirement", "INVITED_ENTRY_REQUIRED_BEFORE_CONFIRM_ADMISSION");
        payload.put("laneSummary", Map.of(
                "p1", Map.of("count", 3, "estimatedWaitDays", 14, "eligibility", "BEDRIGHT_OCCUPANCY"),
                "p2", Map.of("count", 8, "estimatedWaitDays", 45, "eligibility", "CARE_BURN_UPGRADE"),
                "p3", Map.of("count", 24, "estimatedWaitDays", 180, "eligibility", "DEFAULT_ENTRY")
        ));
        payload.put("currentPricing", CareChainContractHeuristics.pricingForP3Count(24));
        payload.put("pricingRules", List.of(
                Map.of("p3CountMin", 0, "p3CountMax", 9, "multiplierBps", 10_000, "burnPricePerDay", 10),
                Map.of("p3CountMin", 10, "p3CountMax", 50, "multiplierBps", 15_000, "burnPricePerDay", 15),
                Map.of("p3CountMin", 51, "p3CountMax", Integer.MAX_VALUE, "multiplierBps", 20_000, "burnPricePerDay", 20)
        ));
        payload.put("examples", Map.of(
                "p1", List.of(Map.of("wallet", "Wallet...7x9a", "rank", 1, "status", "WAITING")),
                "p2", List.of(Map.of("wallet", "Wallet...z2b4", "rank", 1, "status", "WAITING")),
                "p3", List.of(Map.of("wallet", "Wallet...r3q1", "rank", 1, "status", "WAITING"))
        ));
        return payload;
    }

    public QueueState getCurrentQueueState(String walletAddress) {
        return chainQueryService.getQueueState(walletAddress);
    }
}
