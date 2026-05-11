package com.carechain.backend.facility.repository;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "facility_asset")
public class FacilityAssetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_id", nullable = false)
    private Long facilityId;

    @Column(name = "serial", nullable = false, length = 64)
    private String serial;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "yield_display", nullable = false, length = 32)
    private String yieldDisplay;

    @Column(name = "buy_price_display", nullable = false, length = 64)
    private String buyPriceDisplay;

    @Column(name = "image_url", nullable = false, length = 1024)
    private String imageUrl;

    @Column(name = "asset_type", nullable = false, length = 128)
    private String assetType;

    @Column(name = "mode", nullable = false, length = 64)
    private String mode;

    @Column(name = "status", nullable = false, length = 32)
    private String status;

    @Column(name = "mint_address", length = 128)
    private String mintAddress;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected FacilityAssetEntity() {
    }

    public String getSerial() {
        return serial;
    }

    public String getLocation() {
        return location;
    }

    public String getYieldDisplay() {
        return yieldDisplay;
    }

    public String getBuyPriceDisplay() {
        return buyPriceDisplay;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAssetType() {
        return assetType;
    }

    public String getMode() {
        return mode;
    }

    public String getStatus() {
        return status;
    }

    public String getMintAddress() {
        return mintAddress;
    }
}
