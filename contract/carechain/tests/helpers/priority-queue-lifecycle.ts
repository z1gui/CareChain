import * as anchor from "@coral-xyz/anchor";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { homedir } from "os";
import { resolve } from "path";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

const CARECHAIN_PROGRAM_ID = new PublicKey("2M14a3k2cbSVqAkViKMfVEqndLWESHwNTwCHRYD66PwY");
const PRIORITY_QUEUE_PROGRAM_ID = new PublicKey("GB7xr669643BvgwmoDJwCEKFXWN252ECQtq3G2MhaENr");
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

const INITIAL_BURN_PRICE_PER_DAY = 10n;

type QueueStateSnapshot = {
  p1Count: number;
  p2Count: number;
  p3Count: number;
  nextQueueNo: bigint;
  multiplierBps: number;
  burnPricePerDay: bigint;
};

type QueueEntrySnapshot = {
  applicantId: string;
  facilityId: string;
  wallet: PublicKey | null;
  mint: PublicKey | null;
  lane: number;
  queueNo: bigint;
  burnAmount: bigint;
  status: number;
  bedPosition: PublicKey | null;
};

type PriorityQueueScenario = {
  provider: anchor.AnchorProvider;
  facilityId: string;
  bedClassId: string;
  applicantId: string;
  nftMint: Keypair;
  addresses: {
    facilityPda: PublicKey;
    bedClassPda: PublicKey;
    queueStatePda: PublicKey;
    queueEntryPda: PublicKey;
    bedPositionPda: PublicKey;
  };
  initializeQueue: () => Promise<void>;
  joinQueue: () => Promise<void>;
  allocateBed: () => Promise<void>;
  confirmAdmission: () => Promise<void>;
  fetchQueueState: () => Promise<QueueStateSnapshot>;
  fetchQueueEntry: () => Promise<QueueEntrySnapshot>;
};

function encodeU16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function encodeU32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value, 0);
  return buffer;
}

function encodeU64(value: bigint) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(value, 0);
  return buffer;
}

function encodeString(value: string) {
  const data = Buffer.from(value, "utf8");
  return Buffer.concat([encodeU32(data.length), data]);
}

function discriminator(name: string) {
  return createHash("sha256").update(`global:${name}`).digest().subarray(0, 8);
}

function derivePda(programId: PublicKey, seeds: (Buffer | Uint8Array)[]) {
  return PublicKey.findProgramAddressSync(seeds, programId)[0];
}

function encodeInitializeFacilityData(facilityId: string, name: string, city: string, totalBeds: number) {
  return Buffer.concat([
    discriminator("initialize_facility"),
    encodeString(facilityId),
    encodeString(name),
    encodeString(city),
    encodeU16(totalBeds),
  ]);
}

function encodeCreateBedClassData(
  facilityId: string,
  bedClassId: string,
  roomType: string,
  careTier: string,
  priceUsdc: bigint,
  apyBps: number,
  totalSupply: number,
  privilegeLevel: string
) {
  return Buffer.concat([
    discriminator("create_bed_class"),
    encodeString(facilityId),
    encodeString(bedClassId),
    encodeString(roomType),
    encodeString(careTier),
    encodeU64(priceUsdc),
    encodeU16(apyBps),
    encodeU16(totalSupply),
    encodeString(privilegeLevel),
  ]);
}

function encodeMintBedrightNftData(facilityId: string, bedClassId: string) {
  return Buffer.concat([
    discriminator("mint_bedright_nft"),
    encodeString(facilityId),
    encodeString(bedClassId),
  ]);
}

function encodeInitializeQueueData(facilityId: string, burnPricePerDay: bigint) {
  return Buffer.concat([
    discriminator("initialize_queue"),
    encodeString(facilityId),
    encodeU64(burnPricePerDay),
  ]);
}

function encodeJoinP3QueueData(facilityId: string, applicantId: string) {
  return Buffer.concat([
    discriminator("join_p3_queue"),
    encodeString(facilityId),
    encodeString(applicantId),
  ]);
}

function encodeAllocateNextBedData(facilityId: string, applicantId: string) {
  return Buffer.concat([
    discriminator("allocate_next_bed"),
    encodeString(facilityId),
    encodeString(applicantId),
  ]);
}

function encodeConfirmAdmissionData(facilityId: string, applicantId: string) {
  return Buffer.concat([
    discriminator("confirm_admission"),
    encodeString(facilityId),
    encodeString(applicantId),
  ]);
}

function readAnchorString(data: Buffer, offset: number) {
  const length = data.readUInt32LE(offset);
  const start = offset + 4;
  return {
    value: data.subarray(start, start + length).toString("utf8"),
    nextOffset: start + length,
  };
}

function readOptionalPubkey(data: Buffer, offset: number) {
  const tag = data.readUInt8(offset);
  if (tag === 0) {
    return { value: null, nextOffset: offset + 1 };
  }

  const start = offset + 1;
  return {
    value: new PublicKey(data.subarray(start, start + 32)),
    nextOffset: start + 32,
  };
}

function decodeQueueState(data: Buffer): QueueStateSnapshot {
  let offset = 8;
  offset = readAnchorString(data, offset).nextOffset;
  offset += 32;
  offset += 32;
  const p1Count = data.readUInt32LE(offset);
  offset += 4;
  const p2Count = data.readUInt32LE(offset);
  offset += 4;
  const p3Count = data.readUInt32LE(offset);
  offset += 4;
  const nextQueueNo = data.readBigUInt64LE(offset);
  offset += 8;
  const multiplierBps = data.readUInt16LE(offset);
  offset += 2;
  const burnPricePerDay = data.readBigUInt64LE(offset);

  return {
    p1Count,
    p2Count,
    p3Count,
    nextQueueNo,
    multiplierBps,
    burnPricePerDay,
  };
}

function decodeQueueEntry(data: Buffer): QueueEntrySnapshot {
  let offset = 8;
  const applicant = readAnchorString(data, offset);
  offset = applicant.nextOffset;
  const facility = readAnchorString(data, offset);
  offset = facility.nextOffset;
  const wallet = readOptionalPubkey(data, offset);
  offset = wallet.nextOffset;
  const mint = readOptionalPubkey(data, offset);
  offset = mint.nextOffset;
  const lane = data.readUInt8(offset);
  offset += 1;
  const queueNo = data.readBigUInt64LE(offset);
  offset += 8;
  const burnAmount = data.readBigUInt64LE(offset);
  offset += 8;
  const status = data.readUInt8(offset);
  offset += 1;
  const bedPosition = readOptionalPubkey(data, offset);

  return {
    applicantId: applicant.value,
    facilityId: facility.value,
    wallet: wallet.value,
    mint: mint.value,
    lane,
    queueNo,
    burnAmount,
    status,
    bedPosition: bedPosition.value,
  };
}

async function fetchRequiredAccount(connection: anchor.web3.Connection, address: PublicKey) {
  const info = await connection.getAccountInfo(address, "confirmed");
  if (!info) {
    throw new Error(`Missing expected account: ${address.toBase58()}`);
  }
  return info;
}

async function sendInstruction(
  provider: anchor.AnchorProvider,
  instruction: TransactionInstruction,
  signers: Keypair[] = []
) {
  const transaction = new Transaction().add(instruction);
  return provider.sendAndConfirm(transaction, signers, { commitment: "confirmed" });
}

async function ensureWalletBalance(provider: anchor.AnchorProvider, minimumLamports: number) {
  const currentBalance = await provider.connection.getBalance(provider.wallet.publicKey, "confirmed");
  if (currentBalance >= minimumLamports) {
    return;
  }

  const signature = await provider.connection.requestAirdrop(
    provider.wallet.publicKey,
    minimumLamports - currentBalance + 1_000_000_000
  );
  await provider.connection.confirmTransaction(signature, "confirmed");
}

function expandHome(pathValue: string) {
  return pathValue.startsWith("~/") ? resolve(homedir(), pathValue.slice(2)) : resolve(pathValue);
}

function createProvider() {
  const rpcUrl = process.env.ANCHOR_PROVIDER_URL || "http://127.0.0.1:8899";
  const walletPath = expandHome(process.env.ANCHOR_WALLET || "~/.config/solana/id.json");
  const secretKey = Uint8Array.from(JSON.parse(readFileSync(walletPath, "utf8")));
  const wallet = new anchor.Wallet(Keypair.fromSecretKey(secretKey));

  return new anchor.AnchorProvider(new Connection(rpcUrl, "confirmed"), wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
}

export async function createPriorityQueueScenario(): Promise<PriorityQueueScenario> {
  const provider = createProvider();
  anchor.setProvider(provider);

  await ensureWalletBalance(provider, 3_000_000_000);

  const payer = (provider.wallet as anchor.Wallet).publicKey;
  const treasuryOwner = Keypair.generate();
  const nftMint = Keypair.generate();
  const unique = `${Date.now()}-${Keypair.generate().publicKey.toBase58().slice(0, 6)}`;
  const facilityId = `FAC-${unique}`.slice(0, 32);
  const bedClassId = `BED-${unique}`.slice(0, 32);
  const applicantId = `APP-${unique}`.slice(0, 32);

  const usdcMint = await createMint(provider.connection, (provider.wallet as any).payer, payer, null, 6);
  const userUsdcAta = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    (provider.wallet as any).payer,
    usdcMint,
    payer
  );
  const treasuryUsdcAta = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    (provider.wallet as any).payer,
    usdcMint,
    treasuryOwner.publicKey
  );

  await mintTo(
    provider.connection,
    (provider.wallet as any).payer,
    usdcMint,
    userUsdcAta.address,
    payer,
    10_000_000_000n
  );

  const facilityPda = derivePda(CARECHAIN_PROGRAM_ID, [Buffer.from("facility"), Buffer.from(facilityId)]);
  const bedClassPda = derivePda(CARECHAIN_PROGRAM_ID, [
    Buffer.from("bed_class"),
    Buffer.from(facilityId),
    Buffer.from(bedClassId),
  ]);
  const mintAuthorityPda = derivePda(CARECHAIN_PROGRAM_ID, [Buffer.from("mint_authority")]);
  const userNftAta = getAssociatedTokenAddressSync(nftMint.publicKey, payer);
  const bedPositionPda = derivePda(CARECHAIN_PROGRAM_ID, [Buffer.from("bed_position"), nftMint.publicKey.toBuffer()]);
  const metadataPda = derivePda(TOKEN_METADATA_PROGRAM_ID, [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    nftMint.publicKey.toBuffer(),
  ]);
  const queueStatePda = derivePda(PRIORITY_QUEUE_PROGRAM_ID, [
    Buffer.from("queue_state"),
    Buffer.from(facilityId),
  ]);
  const queueEntryPda = derivePda(PRIORITY_QUEUE_PROGRAM_ID, [
    Buffer.from("queue_entry"),
    Buffer.from(facilityId),
    Buffer.from(applicantId),
  ]);

  let initializedQueue = false;
  let joinedQueue = false;
  let allocatedBed = false;
  let admitted = false;
  let initializedBedrightFixture = false;

  async function initializeBedrightFixture() {
    if (initializedBedrightFixture) {
      return;
    }

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: CARECHAIN_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: facilityPda, isSigner: false, isWritable: true },
          { pubkey: treasuryUsdcAta.address, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeInitializeFacilityData(facilityId, "CareChain Queue Facility", "Shanghai", 10),
      })
    );

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: CARECHAIN_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: facilityPda, isSigner: false, isWritable: false },
          { pubkey: bedClassPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeCreateBedClassData(
          facilityId,
          bedClassId,
          "Single Suite",
          "Self Care",
          1_000_000_000n,
          650,
          1,
          "P1"
        ),
      })
    );

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: CARECHAIN_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: facilityPda, isSigner: false, isWritable: true },
          { pubkey: bedClassPda, isSigner: false, isWritable: true },
          { pubkey: mintAuthorityPda, isSigner: false, isWritable: false },
          { pubkey: nftMint.publicKey, isSigner: true, isWritable: true },
          { pubkey: userNftAta, isSigner: false, isWritable: true },
          { pubkey: bedPositionPda, isSigner: false, isWritable: true },
          { pubkey: usdcMint, isSigner: false, isWritable: false },
          { pubkey: userUsdcAta.address, isSigner: false, isWritable: true },
          { pubkey: treasuryUsdcAta.address, isSigner: false, isWritable: true },
          { pubkey: metadataPda, isSigner: false, isWritable: true },
          { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeMintBedrightNftData(facilityId, bedClassId),
      }),
      [nftMint]
    );

    initializedBedrightFixture = true;
  }

  async function initializeQueue() {
    if (initializedQueue) {
      return;
    }

    await initializeBedrightFixture();

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: PRIORITY_QUEUE_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: facilityPda, isSigner: false, isWritable: false },
          { pubkey: queueStatePda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeInitializeQueueData(facilityId, INITIAL_BURN_PRICE_PER_DAY),
      })
    );

    initializedQueue = true;
  }

  async function joinQueue() {
    if (joinedQueue) {
      return;
    }

    await initializeQueue();

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: PRIORITY_QUEUE_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: queueStatePda, isSigner: false, isWritable: true },
          { pubkey: queueEntryPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeJoinP3QueueData(facilityId, applicantId),
      })
    );

    joinedQueue = true;
  }

  async function allocateBed() {
    if (allocatedBed) {
      return;
    }

    await joinQueue();

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: PRIORITY_QUEUE_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: queueStatePda, isSigner: false, isWritable: true },
          { pubkey: queueEntryPda, isSigner: false, isWritable: true },
        ],
        data: encodeAllocateNextBedData(facilityId, applicantId),
      })
    );

    allocatedBed = true;
  }

  async function confirmAdmission() {
    if (admitted) {
      return;
    }

    await allocateBed();

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: PRIORITY_QUEUE_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: queueStatePda, isSigner: false, isWritable: true },
          { pubkey: queueEntryPda, isSigner: false, isWritable: true },
          { pubkey: CARECHAIN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: bedPositionPda, isSigner: false, isWritable: false },
        ],
        data: encodeConfirmAdmissionData(facilityId, applicantId),
      })
    );

    admitted = true;
  }

  async function fetchQueueState() {
    const account = await fetchRequiredAccount(provider.connection, queueStatePda);
    return decodeQueueState(account.data);
  }

  async function fetchQueueEntry() {
    const account = await fetchRequiredAccount(provider.connection, queueEntryPda);
    return decodeQueueEntry(account.data);
  }

  return {
    provider,
    facilityId,
    bedClassId,
    applicantId,
    nftMint,
    addresses: {
      facilityPda,
      bedClassPda,
      queueStatePda,
      queueEntryPda,
      bedPositionPda,
    },
    initializeQueue,
    joinQueue,
    allocateBed,
    confirmAdmission,
    fetchQueueState,
    fetchQueueEntry,
  };
}
