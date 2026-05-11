package com.carechain.backend.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataFacilityBadgeJpaRepository extends JpaRepository<FacilityBadgeEntity, Long> {
    List<FacilityBadgeEntity> findByFacilityIdOrderBySortOrderAsc(Long facilityId);
}
