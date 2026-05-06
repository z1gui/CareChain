import { use } from 'react'
import { ClusterContext } from '@/contexts'

export function useCluster() {
  const clusterContext = use(ClusterContext)!
  if (!clusterContext)
    throw new Error('clusterContext must be used within ClusterProvider')

  return clusterContext
}
