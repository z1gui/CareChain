package com.carechain.backend.facility.repository;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "facility_queue_status")
public class FacilityQueueStatusEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_id", nullable = false)
    private Long facilityId;

    @Column(name = "p1_wait_days", nullable = false)
    private int p1WaitDays;

    @Column(name = "p2_wait_days", nullable = false)
    private int p2WaitDays;

    @Column(name = "p3_wait_days", nullable = false)
    private int p3WaitDays;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected FacilityQueueStatusEntity() {
    }

    public int getP1WaitDays() {
        return p1WaitDays;
    }

    public int getP2WaitDays() {
        return p2WaitDays;
    }

    public int getP3WaitDays() {
        return p3WaitDays;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
