package com.carechain.backend.payment.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    public Map<String, Object> previewCheckIn(String applicationId) {
        return Map.of(
                "applicationId", applicationId,
                "assignedAssetCode", "FSH-A301",
                "facilityName", "Singapore RWA Center",
                "entranceFeeUsdc", 2500,
                "totalDueUsdc", 2500,
                "receiverWallet", "Wallet...owner",
                "payToken", "USDC"
        );
    }

    public Map<String, Object> createCheckInPayment(String applicationId) {
        return Map.of(
                "paymentId", "pay_" + UUID.randomUUID(),
                "applicationId", applicationId,
                "status", "PENDING_SIGNATURE"
        );
    }
}
