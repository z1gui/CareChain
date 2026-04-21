import type { Cluster } from '@/contexts'
import type { PropsWithChildren } from 'react'
import { resolveCluster } from '@solana/client'
import { useState } from 'react'
import { ClusterContext } from '@/contexts'

const clusters = [
  resolveCluster({ moniker: 'devnet' }),
  resolveCluster({ moniker: 'localnet' }),
]

function _findCluster(moniker: Cluster['moniker'] | null) {
  const ret = clusters.find((cluster) => {
    return cluster.moniker === moniker
  })

  if (!ret)
    console.warn('The current cluster was not found.')

  return ret
}

const STORAGE_KEY = 'solana-cluster'

export function ClusterProvider({ children }: PropsWithChildren) {
  const [currentCluster, setCurrentCluster] = useState<Cluster>(() => {
    const moniker = localStorage.getItem(STORAGE_KEY)
    const ret = _findCluster(moniker as Cluster['moniker'])

    if (!ret) {
      return clusters[0]
    }

    return ret
  })

  const setCluster = (moniker: Cluster['moniker'] | null) => {
    const ret = _findCluster(moniker)
    if (ret && moniker) {
      setCurrentCluster(ret)
      localStorage.setItem(STORAGE_KEY, moniker)
    }
  }

  return (
    <ClusterContext
      value={
        {
          clusters,
          cluster: currentCluster,
          setCluster,
        }
      }
    >
      {children}
    </ClusterContext>
  )
}
