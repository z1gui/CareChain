package com.carechain.backend.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataFacilityJpaRepository extends JpaRepository<FacilityEntity, Long> {
    Optional<FacilityEntity> findByFacilityKey(String facilityKey);
}
