import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

import { createPriorityQueueScenario } from "./helpers/priority-queue-lifecycle";

describe("priority_queue", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PriorityQueue as Program<anchor.Idl> | undefined;
  let scenario: Awaited<ReturnType<typeof createPriorityQueueScenario>>;

  before(async function () {
    this.timeout(240000);

    scenario = await createPriorityQueueScenario();
  });

  it("exposes the queue program entrypoint when the workspace is built", function () {
    if (!program) {
      this.skip();
    }

    expect(program.programId.toBase58()).to.equal(
      "GB7xr669643BvgwmoDJwCEKFXWN252ECQtq3G2MhaENr",
    );
  });

  it("initializes the queue state", async function () {
    this.timeout(240000);

    await scenario.initializeQueue();

    const queueState = await scenario.fetchQueueState();

    expect(scenario.addresses.queueStatePda).to.exist;
    expect(queueState.p1Count).to.equal(0);
    expect(queueState.p2Count).to.equal(0);
    expect(queueState.p3Count).to.equal(0);
    expect(queueState.nextQueueNo).to.equal(1n);
    expect(queueState.multiplierBps).to.equal(10_000);
    expect(queueState.burnPricePerDay).to.equal(10n);
  });

  it("joins the applicant into the p3 queue", async function () {
    this.timeout(240000);

    await scenario.joinQueue();

    const queueState = await scenario.fetchQueueState();
    const queueEntry = await scenario.fetchQueueEntry();

    expect(queueState.p3Count).to.equal(1);
    expect(queueState.nextQueueNo).to.equal(2n);
    expect(queueEntry.applicantId).to.equal(scenario.applicantId);
    expect(queueEntry.facilityId).to.equal(scenario.facilityId);
    expect(queueEntry.wallet?.toBase58()).to.equal(scenario.provider.wallet.publicKey.toBase58());
    expect(queueEntry.lane).to.equal(2);
    expect(queueEntry.queueNo).to.equal(1n);
    expect(queueEntry.status).to.equal(0);
    expect(queueEntry.bedPosition).to.equal(null);
  });

  it("allocates the queue entry as invited", async function () {
    this.timeout(240000);

    await scenario.allocateBed();

    const queueState = await scenario.fetchQueueState();
    const queueEntry = await scenario.fetchQueueEntry();

    expect(queueState.p3Count).to.equal(0);
    expect(queueEntry.status).to.equal(1);
    expect(queueEntry.lane).to.equal(2);
  });

  it("confirms admission with the linked bed position", async function () {
    this.timeout(240000);

    await scenario.confirmAdmission();

    const queueEntry = await scenario.fetchQueueEntry();

    expect(queueEntry.status).to.equal(2);
    expect(queueEntry.bedPosition?.toBase58()).to.equal(scenario.addresses.bedPositionPda.toBase58());
  });
});
