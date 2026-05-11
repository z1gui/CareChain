package com.carechain.backend.facility.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Import(FacilityService.class)
class FacilityServiceTests {

    @Autowired
    private FacilityService facilityService;

    @Test
    void listFacilitiesReturnsSeededFacilitiesFromDatabase() {
        Map<String, Object> response = facilityService.listFacilities();

        assertThat(response.get("total")).isEqualTo(3);
        assertThat(response.get("items")).asList().hasSize(3);
        assertThat(response.get("items")).asList().first().asInstanceOf(org.assertj.core.api.InstanceOfAssertFactories.MAP)
                .containsEntry("id", "facility_foshan")
                .containsEntry("name", "Foshan Leyi Care Center");
    }

    @Test
    void getAssetsReturnsDatabaseBackedAssetsForFacility() {
        List<Map<String, Object>> assets = facilityService.getAssets("facility_foshan");

        assertThat(assets).hasSize(3);
        assertThat(assets.get(0))
                .containsEntry("serial", "FSH-A301")
                .containsEntry("type", "Standard Bed")
                .containsEntry("status", "ACTIVE");
    }

    @Test
    void getQueueStatusReturnsSeededQueueStatus() {
        Map<String, Object> queueStatus = facilityService.getQueueStatus("facility_shenzhen");

        assertThat(queueStatus)
                .containsEntry("facilityId", "facility_shenzhen")
                .containsEntry("p1WaitDays", 18)
                .containsEntry("p2WaitDays", 60)
                .containsEntry("p3WaitDays", 240);
    }
}
