export interface PortfolioSummaryVO {
  walletAddress: string
  totalNfts: number
  totalValueSol: number
  monthlyYieldSol: number
  accruedYieldSol: number
  annualApy: number
  averageOccupancy: number
  scarcityStatus: string
  queueJumpCostPerDay: number
  queuePricingBands: Array<{
    p3CountMin: number
    p3CountMax: number
    burnPricePerDay: number
    multiplierBps: number
  }>
}

export interface YieldTrendPointVO {
  label: string
  yieldSol: number
  claimableLamports: number
}

export interface YieldTrendVO {
  range: string
  unit: string
  source: string
  points: YieldTrendPointVO[]
}
