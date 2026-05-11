export interface FacilityAssetVO {
  serial: string
  location: string
  yield: string
  buyPrice: string
  image: string
  type: string
  mode: string
  status: string
  mintAddress: string | null
}

export interface FacilityQueueStatusVO {
  facilityId: string
  p1WaitDays: number
  p2WaitDays: number
  p3WaitDays: number
  updatedAt: string
}

export interface FacilityDetailVO {
  id: string
  name: string
  city: string
  region: string
  country: string
  location: string
  yield: string
  occupancy: number
  occupancyRate: number
  totalBeds: number
  queueCount: number
  queueBoost: string
  image: string
  detailHref: string
  description: string
  badges: Array<{
    label: string
    variant: 'default' | 'secondary' | 'tertiary'
  }>
}

export interface FacilityVO {
  id: string
  name: string
  location: string
  yield: string
  occupancy: number
  totalBeds: number
  queueCount: number
  queueBoost: string
  image: string
  badges: Array<{
    label: string
    variant: 'default' | 'secondary' | 'tertiary'
  }>
  detailHref: string
}

export interface FacilityListVO {
  items: FacilityVO[]
  page: number
  pageSize: number
  total: number
}
