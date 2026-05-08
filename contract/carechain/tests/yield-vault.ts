import { expect } from "chai";

import { createYieldVaultScenario } from "./helpers/yield-vault-lifecycle";

describe("yield_vault", () => {
  let scenario: Awaited<ReturnType<typeof createYieldVaultScenario>>;

  before(async function () {
    this.timeout(240000);

    try {
      scenario = await createYieldVaultScenario();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `yield_vault fixture setup failed. Confirm the Anchor test validator or the configured ANCHOR_PROVIDER_URL/ANCHOR_WALLET is available. Original error: ${message}`
      );
    }
  });

  it("initializes the vault and facility pool", async function () {
    this.timeout(240000);

    await scenario.initializeVaultAndPool();

    const poolState = await scenario.fetchFacilityYieldPoolState();

    expect(scenario.addresses.yieldVaultPda).to.exist;
    expect(scenario.addresses.facilityYieldPoolPda).to.exist;
    expect(poolState.pendingUnallocatedLamports).to.equal(0n);
    expect(poolState.totalClaimedLamports).to.equal(0n);
  });

  it("creates the bedright position and initializes yield position", async function () {
    this.timeout(240000);

    await scenario.mintBedrightAndInitPosition();

    const positionState = await scenario.fetchYieldPositionState();

    expect(scenario.addresses.bedPositionPda).to.exist;
    expect(scenario.addresses.yieldPositionPda).to.exist;
    expect(positionState.claimableLamports).to.equal(0n);
    expect(positionState.claimedLamports).to.equal(0n);
  });

  it("deposits and allocates yield to the position", async function () {
    this.timeout(240000);

    await scenario.depositAndAllocate();

    const positionState = await scenario.fetchYieldPositionState();
    const poolState = await scenario.fetchFacilityYieldPoolState();

    expect(positionState.claimableLamports).to.equal(1_250_000n);
    expect(positionState.claimedLamports).to.equal(0n);
    expect(poolState.pendingUnallocatedLamports).to.equal(750_000n);
    expect(poolState.totalClaimedLamports).to.equal(0n);
  });

  it("claims the allocated yield", async function () {
    this.timeout(240000);

    await scenario.claimYield();

    const positionState = await scenario.fetchYieldPositionState();
    const poolState = await scenario.fetchFacilityYieldPoolState();

    expect(positionState.claimableLamports).to.equal(0n);
    expect(positionState.claimedLamports).to.equal(1_250_000n);
    expect(poolState.pendingUnallocatedLamports).to.equal(750_000n);
    expect(poolState.totalClaimedLamports).to.equal(1_250_000n);
  });
});
