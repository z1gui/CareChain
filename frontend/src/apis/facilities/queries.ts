import { queryOptions } from '@tanstack/react-query'
import { getFacilities, getFacility, getFacilityAssets, getFacilityQueueStatus } from './request'

export function getFacilitiesQuery(options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getFacilities', ...options?.extraQueryKey || []],
    queryFn: () => getFacilities(options?.init),
    ...options,
  })
}

export function getFacilityAssetsQuery(facilityId: string, options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getFacilityAssets', facilityId, ...options?.extraQueryKey || []],
    queryFn: () => getFacilityAssets(facilityId, options?.init),
    ...options,
  })
}

export function getFacilityQuery(facilityId: string, options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getFacility', facilityId, ...options?.extraQueryKey || []],
    queryFn: () => getFacility(facilityId, options?.init),
    ...options,
  })
}

export function getFacilityQueueStatusQuery(facilityId: string, options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getFacilityQueueStatus', facilityId, ...options?.extraQueryKey || []],
    queryFn: () => getFacilityQueueStatus(facilityId, options?.init),
    ...options,
  })
}
