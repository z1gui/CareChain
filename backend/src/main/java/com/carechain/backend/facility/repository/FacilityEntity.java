package com.carechain.backend.facility.repository;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "facility",
        uniqueConstraints = @UniqueConstraint(name = "uk_facility_key", columnNames = "facility_key")
)
public class FacilityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_key", nullable = false, length = 64)
    private String facilityKey;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "city", nullable = false, length = 128)
    private String city;

    @Column(name = "region", nullable = false, length = 128)
    private String region;

    @Column(name = "country", nullable = false, length = 128)
    private String country;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "yield_display", nullable = false, length = 32)
    private String yieldDisplay;

    @Column(name = "occupancy_percent", nullable = false)
    private int occupancyPercent;

    @Column(name = "total_beds", nullable = false)
    private int totalBeds;

    @Column(name = "queue_count", nullable = false)
    private int queueCount;

    @Column(name = "queue_boost", nullable = false, length = 64)
    private String queueBoost;

    @Column(name = "image_url", nullable = false, length = 1024)
    private String imageUrl;

    @Column(name = "detail_href", nullable = false, length = 255)
    private String detailHref;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected FacilityEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getFacilityKey() {
        return facilityKey;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getCity() {
        return city;
    }

    public String getRegion() {
        return region;
    }

    public String getCountry() {
        return country;
    }

    public String getDescription() {
        return description;
    }

    public String getYieldDisplay() {
        return yieldDisplay;
    }

    public int getOccupancyPercent() {
        return occupancyPercent;
    }

    public int getTotalBeds() {
        return totalBeds;
    }

    public int getQueueCount() {
        return queueCount;
    }

    public String getQueueBoost() {
        return queueBoost;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDetailHref() {
        return detailHref;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
