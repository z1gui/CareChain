import { queryOptions } from '@tanstack/react-query'
import { getPortfolioSummary, getPortfolioYieldTrend } from './request'

export function getPortfolioSummaryQuery(walletAddress: string, options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getPortfolioSummary', walletAddress, ...options?.extraQueryKey || []],
    queryFn: () => getPortfolioSummary(walletAddress, options?.init),
    ...options,
  })
}

export function getPortfolioYieldTrendQuery(walletAddress: string, range = '6m', options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getPortfolioYieldTrend', walletAddress, range, ...options?.extraQueryKey || []],
    queryFn: () => getPortfolioYieldTrend(walletAddress, range, options?.init),
    ...options,
  })
}
