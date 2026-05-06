package com.carechain.backend.payment.controller;

import com.carechain.backend.common.api.ApiResponse;
import com.carechain.backend.payment.dto.CheckInPaymentPreviewRequest;
import com.carechain.backend.payment.service.PaymentService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/check-in/preview")
    public ApiResponse<Map<String, Object>> previewCheckIn(
            @Valid @RequestBody CheckInPaymentPreviewRequest request
    ) {
        return ApiResponse.ok(paymentService.previewCheckIn(request.applicationId()));
    }

    @PostMapping("/check-in")
    public ApiResponse<Map<String, Object>> createCheckIn(
            @Valid @RequestBody CheckInPaymentPreviewRequest request
    ) {
        return ApiResponse.ok("Check-in payment order created",
                paymentService.createCheckInPayment(request.applicationId()));
    }
}
