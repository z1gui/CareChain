import type { ClusterMoniker } from '@solana/client'
import type { ClusterUrl } from '@solana/kit'
import { createContext } from 'react'

export type Cluster = Readonly<{
  endpoint: ClusterUrl
  moniker: ClusterMoniker | 'custom'
  websocketEndpoint: ClusterUrl
}>

export interface ClusterContextState {
  clusters: Cluster[]
  cluster: Cluster
  setCluster: (moniker: Cluster['moniker'] | null) => void
}

export const ClusterContext = createContext<ClusterContextState | undefined>(undefined)
