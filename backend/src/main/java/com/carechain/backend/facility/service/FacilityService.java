package com.carechain.backend.facility.service;

import com.carechain.backend.common.exception.BusinessException;
import com.carechain.backend.facility.repository.FacilityAssetEntity;
import com.carechain.backend.facility.repository.FacilityBadgeEntity;
import com.carechain.backend.facility.repository.FacilityEntity;
import com.carechain.backend.facility.repository.FacilityQueueStatusEntity;
import com.carechain.backend.facility.repository.SpringDataFacilityAssetJpaRepository;
import com.carechain.backend.facility.repository.SpringDataFacilityBadgeJpaRepository;
import com.carechain.backend.facility.repository.SpringDataFacilityJpaRepository;
import com.carechain.backend.facility.repository.SpringDataFacilityQueueStatusJpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class FacilityService {

    private final SpringDataFacilityJpaRepository facilityRepository;
    private final SpringDataFacilityBadgeJpaRepository badgeRepository;
    private final SpringDataFacilityAssetJpaRepository assetRepository;
    private final SpringDataFacilityQueueStatusJpaRepository queueStatusRepository;

    public FacilityService(
            SpringDataFacilityJpaRepository facilityRepository,
            SpringDataFacilityBadgeJpaRepository badgeRepository,
            SpringDataFacilityAssetJpaRepository assetRepository,
            SpringDataFacilityQueueStatusJpaRepository queueStatusRepository
    ) {
        this.facilityRepository = facilityRepository;
        this.badgeRepository = badgeRepository;
        this.assetRepository = assetRepository;
        this.queueStatusRepository = queueStatusRepository;
    }

    public Map<String, Object> listFacilities() {
        List<FacilityEntity> facilities = facilityRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        List<Map<String, Object>> items = facilities.stream()
                .map(this::toFacilityListItem)
                .toList();

        LinkedHashMap<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("page", 1);
        result.put("pageSize", items.size());
        result.put("total", items.size());
        return result;
    }

    public Map<String, Object> getFacility(String facilityId) {
        FacilityEntity facility = getFacilityEntity(facilityId);

        LinkedHashMap<String, Object> result = new LinkedHashMap<>();
        result.put("id", facility.getFacilityKey());
        result.put("name", facility.getName());
        result.put("city", facility.getCity());
        result.put("region", facility.getRegion());
        result.put("country", facility.getCountry());
        result.put("location", facility.getLocation());
        result.put("yield", facility.getYieldDisplay());
        result.put("occupancy", facility.getOccupancyPercent());
        result.put("occupancyRate", facility.getOccupancyPercent() / 100.0d);
        result.put("totalBeds", facility.getTotalBeds());
        result.put("queueCount", facility.getQueueCount());
        result.put("queueBoost", facility.getQueueBoost());
        result.put("image", facility.getImageUrl());
        result.put("detailHref", facility.getDetailHref());
        result.put("description", facility.getDescription());
        result.put("badges", getBadges(facility.getId()));
        return result;
    }

    public List<Map<String, Object>> getAssets(String facilityId) {
        FacilityEntity facility = getFacilityEntity(facilityId);
        return assetRepository.findByFacilityIdOrderBySortOrderAsc(facility.getId()).stream()
                .map(this::toFacilityAssetItem)
                .toList();
    }

    public Map<String, Object> getQueueStatus(String facilityId) {
        FacilityEntity facility = getFacilityEntity(facilityId);
        FacilityQueueStatusEntity queueStatus = queueStatusRepository.findByFacilityId(facility.getId())
                .orElseThrow(() -> notFound("Queue status not found for facility: " + facilityId));

        LinkedHashMap<String, Object> result = new LinkedHashMap<>();
        result.put("facilityId", facility.getFacilityKey());
        result.put("p1WaitDays", queueStatus.getP1WaitDays());
        result.put("p2WaitDays", queueStatus.getP2WaitDays());
        result.put("p3WaitDays", queueStatus.getP3WaitDays());
        result.put("updatedAt", queueStatus.getUpdatedAt().toString());
        return result;
    }

    private Map<String, Object> toFacilityListItem(FacilityEntity facility) {
        LinkedHashMap<String, Object> item = new LinkedHashMap<>();
        item.put("id", facility.getFacilityKey());
        item.put("name", facility.getName());
        item.put("location", facility.getLocation());
        item.put("yield", facility.getYieldDisplay());
        item.put("occupancy", facility.getOccupancyPercent());
        item.put("totalBeds", facility.getTotalBeds());
        item.put("queueCount", facility.getQueueCount());
        item.put("queueBoost", facility.getQueueBoost());
        item.put("image", facility.getImageUrl());
        item.put("badges", getBadges(facility.getId()));
        item.put("detailHref", facility.getDetailHref());
        return item;
    }

    private List<Map<String, Object>> getBadges(Long facilityDbId) {
        return badgeRepository.findByFacilityIdOrderBySortOrderAsc(facilityDbId).stream()
                .map(this::toBadgeItem)
                .toList();
    }

    private Map<String, Object> toBadgeItem(FacilityBadgeEntity badge) {
        LinkedHashMap<String, Object> item = new LinkedHashMap<>();
        item.put("label", badge.getLabel());
        item.put("variant", badge.getVariant());
        return item;
    }

    private Map<String, Object> toFacilityAssetItem(FacilityAssetEntity asset) {
        LinkedHashMap<String, Object> item = new LinkedHashMap<>();
        item.put("serial", asset.getSerial());
        item.put("location", asset.getLocation());
        item.put("yield", asset.getYieldDisplay());
        item.put("buyPrice", asset.getBuyPriceDisplay());
        item.put("image", asset.getImageUrl());
        item.put("type", asset.getAssetType());
        item.put("mode", asset.getMode());
        item.put("status", asset.getStatus());
        item.put("mintAddress", asset.getMintAddress());
        return item;
    }

    private FacilityEntity getFacilityEntity(String facilityId) {
        return facilityRepository.findByFacilityKey(facilityId)
                .orElseThrow(() -> notFound("Facility not found: " + facilityId));
    }

    private BusinessException notFound(String message) {
        return new BusinessException(message, "FACILITY_NOT_FOUND", message, HttpStatus.NOT_FOUND);
    }
}
