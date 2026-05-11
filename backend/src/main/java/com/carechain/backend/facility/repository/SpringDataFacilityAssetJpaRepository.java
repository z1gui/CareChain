package com.carechain.backend.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataFacilityAssetJpaRepository extends JpaRepository<FacilityAssetEntity, Long> {
    List<FacilityAssetEntity> findByFacilityIdOrderBySortOrderAsc(Long facilityId);
}
