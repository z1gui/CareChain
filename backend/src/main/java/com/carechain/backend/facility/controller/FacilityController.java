package com.carechain.backend.facility.controller;

import com.carechain.backend.common.api.ApiResponse;
import com.carechain.backend.facility.service.FacilityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ApiResponse<Map<String, Object>> listFacilities() {
        return ApiResponse.ok(facilityService.listFacilities());
    }

    @GetMapping("/{facilityId}")
    public ApiResponse<Map<String, Object>> getFacility(@PathVariable String facilityId) {
        return ApiResponse.ok(facilityService.getFacility(facilityId));
    }

    @GetMapping("/{facilityId}/assets")
    public ApiResponse<List<Map<String, Object>>> getAssets(@PathVariable String facilityId) {
        return ApiResponse.ok(facilityService.getAssets(facilityId));
    }

    @GetMapping("/{facilityId}/queue-status")
    public ApiResponse<Map<String, Object>> getQueueStatus(@PathVariable String facilityId) {
        return ApiResponse.ok(facilityService.getQueueStatus(facilityId));
    }
}
