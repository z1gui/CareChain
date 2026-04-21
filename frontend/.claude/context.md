# CareChain — Project Context

## What is CareChain?

CareChain is a **senior-care real-estate RWA protocol** on Solana. It converts underused commercial properties into tokenized elderly-care facilities. BedRight NFTs represent both usage rights and yield rights to individual beds. The protocol introduces a **priority-queue mechanism**: NFT holders get instant admission, regular applicants queue up, and $CARE token burns let families skip the line — creating genuine token demand.

**One-liner pitch**: Turn a nursing-home bed into an investable, tradable, usable on-chain asset.

---

## Core Innovation: Dual-Track Admission

This is the key differentiator from every other RWA protocol — **scarcity of beds drives real token demand**.

### Three-Channel Priority Queue

When a bed becomes vacant, it is allocated in this priority order:

```
P1 — VIP Channel (immediate admission)
     └── BedRight NFT holder (usage right already locked)

P2 — Fast Track (24–72 hours)
     └── Family that burns $CARE tokens
         More burned → higher queue priority

P3 — Standard Queue (first-come-first-served, indefinite wait)
     └── Regular applicant with no tokens
```

### Dynamic $CARE Burn Pricing

Skip-queue cost scales with current P3 queue length:

| P3 Queue Size | Burn Multiplier | Daily Cost | Signal |
|--------------|-----------------|------------|--------|
| < 10 | 1× | 10 $CARE | Beds plentiful |
| 10–50 | 1.5× | 15 $CARE | Supply tight |
| > 50 | 2× | 20 $CARE | Scarcity premium |

Powered by Pyth Oracle real-time occupancy data.

### Token Economic Flywheel

```
More families apply for beds
        ↓
  P3 queue grows longer
        ↓
  $CARE burn demand rises
        ↓
   $CARE circulating supply drops
        ↓
  Investor yields rise + token appreciates
        ↓
  More capital flows into protocol
        ↓
  More facilities join CareChain
        ↓
  More beds available → attracts more families ← (loop)
```

---

## Four Core Smart Contracts

| Contract | Purpose |
|----------|---------|
| **BedRight NFT Program** | Metaplex Core NFT per bed. Holders toggle between "yield mode" (earn USDC) and "stay mode" (direct admission). 30-day cooldown on toggle. |
| **PriorityQueue Program** | On-chain waitlist for 3 channels. Receives $CARE burn instructions, updates applicant rankings. Auto-invites on vacancy. |
| **YieldVault Program** | Facility operator deposits USDC monthly. Auto-distributes proportionally to all circulating BedRight NFT holders. 50% of $CARE burn revenue also injected here. |
| **$CARE Token Program** | SPL fixed-supply token. Burned permanently on every skip-queue transaction. Staking by NFT holders adds up to +2% APY. |

### NFT Metadata Example

```json
{
  "bed_id": "FSH-A301",
  "facility": "Foshan Leyi Care Center",
  "room_type": "Standard Single",
  "care_tier": "Self-Care",
  "annual_yield_rate": "7.2%",
  "face_value_usdc": 500,
  "status": "yield_mode"
}
```

### NFT Tiers (Foshan Pilot — 200 beds)

| Type | Count | Face Value | Expected APY | Privilege |
|------|-------|------------|--------------|-----------|
| Standard Room NFT | 100 | 500 USDC | 6.5% | Base yield + P1 admission |
| Suite NFT | 60 | 1,200 USDC | 7.8% | Priority room selection + governance weight |
| Memory-Care NFT | 40 | 2,000 USDC | 9.0% | Professional care + 2× governance votes |

---

## Monthly Revenue Distribution

```
Facility Monthly Revenue = Bed Fees + Care Fees + Premium Service Fees
                    ↓
   ┌────────────────────────────────────┐
   │  65% → YieldVault → NFT holders    │
   │  + additional 50% of $CARE burns   │
   │  20% → Facility reinvestment       │
   │  10% → Protocol treasury (DAO)     │
   │   5% → Insurance reserve           │
   └────────────────────────────────────┘
```

---

## User Paths

### Path A — Investor (Web3 native)
1. Connect wallet
2. Browse facility Dashboard (occupancy, yield history, bed map, P3 queue length)
3. Select bed type → purchase BedRight NFT with USDC
4. NFT arrives, enters "yield mode" auto-accruing
5. Receive USDC distribution monthly 1st (includes $CARE burn boost)
6. Optionally stake $CARE for extra yield

### Path B — Planning Family (Web3 native)
1. Enter "planning mode"
2. Input parents' estimated admission year → recommend bed type
3. Buy BedRight NFT (earning yield while holding)
4. At admission time switch to "stay mode" → direct P1 channel
5. After admission NFT becomes SBT (soulbound), records care history

### Path C — Regular Family (Web2, no wallet needed)
1. Submit application on facility website
2. Enter P3 standard queue, receive estimated wait time
3. If want faster → guided to $CARE purchase page (fiat on-ramp)
4. Choose skip days → system auto-burns corresponding $CARE
5. Promoted to P2 fast track → admission confirmed within 24–72h

> **Key design**: Path C families never need to understand Web3. They just know "pay to skip the line" — the on-chain $CARE burn is invisible to them.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Smart Contracts | Solana / Anchor | <$0.001/tx, high TPS for frequent distributions |
| NFT Standard | Metaplex Core | Native Solana, Tensor/MagicEden compatible |
| Token Standard | SPL Token-2022 | Transfer hooks auto-trigger queue upgrade on burn |
| Yield Currency | USDC (Circle) | Compliant stablecoin, no FX risk |
| Oracle | Pyth Network | Native Solana, feeds occupancy data for dynamic pricing |
| Governance | Realms (SPL Governance) | Native DAO framework |
| Frontend | Next.js 16 + @solana/react-hooks | Solana-official recommendation |
| Fiat On-ramp | Stripe + custodial purchase | Web2 families use credit card |
| Data Indexing | Helius RPC | High-performance NFT/asset indexing |

---

## Protocol Revenue Streams

| Revenue Type | Rate | Trigger |
|--------------|------|---------|
| NFT Minting Fee | 1.5% of face value | Each new bed NFT minted |
| Monthly Management Fee | 2% of distribution | Each YieldVault settlement |
| Secondary Market Royalty | 2% of sale price | Each NFT transfer |
| Skip-Queue Fee | 5% of burned $CARE | Each skip-queue (fiat channel) |
| SaaS Facility Onboarding | $2,000/month | New facility joins protocol |

---

## Competitive Moat

| Project | Chain | Asset Type | Queue / Priority | Gap |
|---------|-------|------------|-----------------|-----|
| RealT | Ethereum | US rental | None | Pure yield, no service rights |
| Landshare | BNB Chain | US commercial | None | Not Solana, no senior-care |
| Parcl | Solana | Price index derivative | None | No physical asset backing |
| Homebase | Solana | US residential | None | Single asset, not facility-based |
| **CareChain** | **Solana** | **Senior-care beds** | **✅ 3-channel priority + $CARE burn skip** | **Asia-first, token刚需 consumption** |

---

## Scaling Roadmap

| Phase | Timeline | Milestone |
|-------|----------|-----------|
| **Phase 1 (Hackathon MVP)** | Now | Foshan single facility, 200 beds. Validate minting, distribution, 3-channel queue end-to-end |
| **Phase 2** | +6 months | 3–5 Pearl-River-Delta facilities, 1,000+ beds. Launch $CARE token + skip-queue |
| **Phase 3** | +12 months | Southeast Asia (Thailand, Malaysia). Become "Solana's senior-care REITs + admission-right protocol" |

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Low occupancy → yield drops | Insurance reserve compensation + dynamic mint cap adjustment |
| Short P3 queue → weak $CARE demand | Early multi-facility joint waitlist to maintain queue length |
| Low NFT liquidity | Protocol buyback at 90% face value from treasury |
| Data authenticity | Oracle auto-capture occupancy + third-party quarterly audit on-chain |

---

*Version: v2.0 · April 2026 · Solana Frontier Hackathon*
