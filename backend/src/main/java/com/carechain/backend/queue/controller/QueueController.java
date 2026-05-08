package com.carechain.backend.queue.controller;

import com.carechain.backend.chain.service.QueueState;
import com.carechain.backend.common.api.ApiResponse;
import com.carechain.backend.queue.dto.BurnPreviewRequest;
import com.carechain.backend.queue.dto.QueueApplicationPreviewRequest;
import com.carechain.backend.queue.service.QueueService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @PostMapping("/queue-applications/preview")
    public ApiResponse<Map<String, Object>> previewApplication(
            @Valid @RequestBody QueueApplicationPreviewRequest request
    ) {
        return ApiResponse.ok(queueService.previewApplication(request.facilityId(), request.bedAssetId()));
    }

    @PostMapping("/queue-applications")
    public ApiResponse<Map<String, Object>> createApplication(
            @Valid @RequestBody QueueApplicationPreviewRequest request
    ) {
        return ApiResponse.ok("Application created",
                queueService.createApplication(request.facilityId(), request.bedAssetId()));
    }

    @PostMapping("/queue-burn-orders/preview")
    public ApiResponse<Map<String, Object>> previewBurn(@Valid @RequestBody BurnPreviewRequest request) {
        return ApiResponse.ok(queueService.previewBurn(request.applicationId(), request.burnAmount()));
    }

    @PostMapping("/queue-burn-orders")
    public ApiResponse<Map<String, Object>> createBurnOrder(@Valid @RequestBody BurnPreviewRequest request) {
        return ApiResponse.ok("Burn order created",
                queueService.createBurnOrder(request.applicationId(), request.burnAmount()));
    }

    @GetMapping("/queue/global")
    public ApiResponse<Map<String, Object>> getGlobalQueue() {
        return ApiResponse.ok(queueService.getGlobalQueue());
    }

    @GetMapping("/queue/status")
    public ApiResponse<QueueState> getCurrentQueueState(@RequestParam String walletAddress) {
        return ApiResponse.ok(queueService.getCurrentQueueState(walletAddress));
    }
}
