import type { PortfolioSummaryVO, YieldTrendVO } from './types'
import type { HttpRequestInit } from '@/libs/http'
import { http } from '@/libs/http'

export async function getPortfolioSummary(walletAddress: string, init?: HttpRequestInit) {
  return http<PortfolioSummaryVO>('/api/v1/portfolio/summary', {
    ...init,
    queries: {
      ...(init?.queries ?? {}),
      walletAddress,
    },
  })
}

export async function getPortfolioYieldTrend(walletAddress: string, range = '6m', init?: HttpRequestInit) {
  return http<YieldTrendVO>('/api/v1/portfolio/yield-trend', {
    ...init,
    queries: {
      ...(init?.queries ?? {}),
      walletAddress,
      range,
    },
  })
}
