import type { FacilityAssetVO, FacilityDetailVO, FacilityListVO, FacilityQueueStatusVO } from './types'
import type { HttpRequestInit } from '@/libs/http'
import { http } from '@/libs/http'

export async function getFacilities(init?: HttpRequestInit) {
  return http<FacilityListVO>('/api/v1/facilities', init)
}

export async function getFacility(facilityId: string, init?: HttpRequestInit) {
  return http<FacilityDetailVO>(`/api/v1/facilities/${facilityId}`, init)
}

export async function getFacilityAssets(facilityId: string, init?: HttpRequestInit) {
  return http<FacilityAssetVO[]>(`/api/v1/facilities/${facilityId}/assets`, init)
}

export async function getFacilityQueueStatus(facilityId: string, init?: HttpRequestInit) {
  return http<FacilityQueueStatusVO>(`/api/v1/facilities/${facilityId}/queue-status`, init)
}
