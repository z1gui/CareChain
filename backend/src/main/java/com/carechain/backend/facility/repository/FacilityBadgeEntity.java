package com.carechain.backend.facility.repository;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "facility_badge")
public class FacilityBadgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_id", nullable = false)
    private Long facilityId;

    @Column(name = "label", nullable = false, length = 128)
    private String label;

    @Column(name = "variant", nullable = false, length = 32)
    private String variant;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected FacilityBadgeEntity() {
    }

    public Long getFacilityId() {
        return facilityId;
    }

    public String getLabel() {
        return label;
    }

    public String getVariant() {
        return variant;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
