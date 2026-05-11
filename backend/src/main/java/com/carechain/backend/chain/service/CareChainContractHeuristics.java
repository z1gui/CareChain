package com.carechain.backend.chain.service;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public final class CareChainContractHeuristics {
    public static final int BASE_MULTIPLIER_BPS = 10_000;
    public static final int MID_MULTIPLIER_BPS = 15_000;
    public static final int HIGH_MULTIPLIER_BPS = 20_000;
    public static final long BASE_BURN_PRICE_PER_DAY = 10L;
    public static final long MID_BURN_PRICE_PER_DAY = 15L;
    public static final long HIGH_BURN_PRICE_PER_DAY = 20L;

    private CareChainContractHeuristics() {
    }

    public static boolean isQueueRelated(String name, String symbol) {
        String haystack = normalize(name) + " " + normalize(symbol);
        return haystack.contains("queue") || haystack.contains("queue pass") || haystack.contains("qp");
    }

    public static boolean isBedRightOccupancy(String name, String symbol) {
        String haystack = normalize(name) + " " + normalize(symbol);
        return haystack.contains("bedright")
                || haystack.contains("occupancy")
                || haystack.contains("bed position")
                || haystack.contains("care bed");
    }

    public static boolean isYieldRelated(String name, String symbol) {
        String haystack = normalize(name) + " " + normalize(symbol);
        return haystack.contains("yield")
                || haystack.contains("vault")
                || haystack.contains("apy")
                || haystack.contains("bedright")
                || haystack.contains("care bed");
    }

    public static Map<String, Object> pricingForP3Count(int p3Count) {
        LinkedHashMap<String, Object> pricing = new LinkedHashMap<>();
        pricing.put("p3Count", p3Count);

        if (p3Count < 10) {
            pricing.put("multiplierBps", BASE_MULTIPLIER_BPS);
            pricing.put("burnPricePerDay", BASE_BURN_PRICE_PER_DAY);
            pricing.put("pricingBand", "BASE");
        } else if (p3Count <= 50) {
            pricing.put("multiplierBps", MID_MULTIPLIER_BPS);
            pricing.put("burnPricePerDay", MID_BURN_PRICE_PER_DAY);
            pricing.put("pricingBand", "MID");
        } else {
            pricing.put("multiplierBps", HIGH_MULTIPLIER_BPS);
            pricing.put("burnPricePerDay", HIGH_BURN_PRICE_PER_DAY);
            pricing.put("pricingBand", "HIGH");
        }

        return pricing;
    }

    public static int estimatedWaitDaysForLane(String lane) {
        return switch (lane) {
            case "P1" -> 14;
            case "P2" -> 45;
            case "P3" -> 180;
            default -> 0;
        };
    }

    public static int estimatedRankForLane(String lane, int signalCount) {
        int sanitizedSignalCount = Math.max(signalCount, 1);
        return switch (lane) {
            case "P1" -> sanitizedSignalCount;
            case "P2" -> 10 + sanitizedSignalCount * 2;
            case "P3" -> 100 + sanitizedSignalCount * 20;
            default -> 0;
        };
    }

    public static String previewLaneForBedAsset(String bedAssetId) {
        String normalized = normalize(bedAssetId);
        if (normalized.contains("nft")
                || normalized.contains("bedright")
                || normalized.contains("occupancy")
                || normalized.contains("mint")) {
            return "P1";
        }
        return "P3";
    }

    public static String suggestedQueueInstruction(String lane) {
        return "P1".equals(lane) ? "registerP1FromNft" : "joinP3Queue";
    }

    private static String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}
