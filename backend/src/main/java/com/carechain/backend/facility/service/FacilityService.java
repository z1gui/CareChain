package com.carechain.backend.facility.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FacilityService {

    public Map<String, Object> listFacilities() {
        return Map.of(
                "items", List.of(
                        Map.of(
                                "id", "facility_foshan",
                                "name", "Foshan Leyi Care Center",
                                "region", "Greater Bay Area",
                                "city", "Foshan",
                                "occupancyRate", 0.942,
                                "apyRange", "7.2% - 11.2%",
                                "queueWaitDays", 180
                        )
                ),
                "page", 1,
                "pageSize", 10,
                "total", 1
        );
    }

    public Map<String, Object> getFacility(String facilityId) {
        return Map.of(
                "id", facilityId,
                "name", "Foshan Leyi Care Center",
                "city", "Foshan",
                "country", "China",
                "occupancyRate", 0.942,
                "description", "Flagship RWA elderly care facility integrated with CareChain."
        );
    }

    public List<Map<String, Object>> getAssets(String facilityId) {
        return List.of(
                Map.of(
                        "id", "asset_standard",
                        "facilityId", facilityId,
                        "title", "Standard Care Unit",
                        "priceUsdc", 25000,
                        "apy", 7.8
                ),
                Map.of(
                        "id", "asset_memory",
                        "facilityId", facilityId,
                        "title", "Memory Care Center",
                        "priceUsdc", 55000,
                        "apy", 11.2
                )
        );
    }

    public Map<String, Object> getQueueStatus(String facilityId) {
        return Map.of(
                "facilityId", facilityId,
                "p1WaitDays", 12,
                "p2WaitDays", 45,
                "p3WaitDays", 180,
                "updatedAt", "2026-04-15T00:00:00Z"
        );
    }
}
