import type { Cluster } from '@/contexts'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCluster } from '@/hooks'

export function WalletClusterSelector() {
  const { clusters, cluster, setCluster } = useCluster()

  return (
    <Select<Cluster['moniker']>
      defaultValue={cluster.moniker}
      onValueChange={setCluster}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger>
        <SelectGroup>
          {clusters.map(cluster => (
            <SelectItem key={cluster.moniker} value={cluster.moniker}>
              {cluster.moniker}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
