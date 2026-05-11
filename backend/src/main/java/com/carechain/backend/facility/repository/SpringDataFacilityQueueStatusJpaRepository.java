package com.carechain.backend.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataFacilityQueueStatusJpaRepository extends JpaRepository<FacilityQueueStatusEntity, Long> {
    Optional<FacilityQueueStatusEntity> findByFacilityId(Long facilityId);
}
