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
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";

const CARECHAIN_PROGRAM_ID = new PublicKey("2M14a3k2cbSVqAkViKMfVEqndLWESHwNTwCHRYD66PwY");
const YIELD_VAULT_PROGRAM_ID = new PublicKey("AEDNejZqKMWRXPp8E2mtqmeBooNAr4rtkEN5mdAbv8Tp");
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

const FACILITY_INCOME_SOURCE = 0;
const DEPOSITED_LAMPORTS = 2_000_000n;
const ALLOCATED_LAMPORTS = 1_250_000n;

type YieldLifecycleResult = {
  depositedLamports: bigint;
  allocatedLamports: bigint;
  claimedLamports: bigint;
  positionClaimableLamports: bigint;
  positionClaimedLamports: bigint;
  poolPendingLamports: bigint;
  poolClaimedLamports: bigint;
};

type YieldPositionState = {
  claimableLamports: bigint;
  claimedLamports: bigint;
};

type FacilityYieldPoolState = {
  pendingUnallocatedLamports: bigint;
  totalClaimedLamports: bigint;
};

type YieldVaultScenario = {
  provider: anchor.AnchorProvider;
  facilityId: string;
  bedClassId: string;
  snapshotId: string;
  nftMint: Keypair;
  addresses: {
    facilityPda: PublicKey;
    bedClassPda: PublicKey;
    bedPositionPda: PublicKey;
    yieldVaultPda: PublicKey;
    facilityYieldPoolPda: PublicKey;
    yieldPositionPda: PublicKey;
    yieldDistributionPda: PublicKey;
  };
  initializeVaultAndPool: () => Promise<void>;
  mintBedrightAndInitPosition: () => Promise<void>;
  depositAndAllocate: () => Promise<void>;
  claimYield: () => Promise<void>;
  fetchYieldPositionState: () => Promise<YieldPositionState>;
  fetchFacilityYieldPoolState: () => Promise<FacilityYieldPoolState>;
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

function encodeInitializeYieldVaultData(bedrightProgramId: PublicKey) {
  return Buffer.concat([discriminator("initialize_yield_vault"), bedrightProgramId.toBuffer()]);
}

function encodeInitializeFacilityYieldPoolData(facilityId: string) {
  return Buffer.concat([discriminator("initialize_facility_yield_pool"), encodeString(facilityId)]);
}

function encodeInitializeYieldPositionData(facilityId: string) {
  return Buffer.concat([discriminator("initialize_yield_position"), encodeString(facilityId)]);
}

function encodeDepositYieldData(facilityId: string, amountLamports: bigint, snapshotId: string) {
  return Buffer.concat([
    discriminator("deposit_yield"),
    encodeString(facilityId),
    encodeU64(amountLamports),
    Buffer.from([FACILITY_INCOME_SOURCE]),
    encodeString(snapshotId),
  ]);
}

function encodeAllocateYieldToPositionsData(facilityId: string, snapshotId: string, amountLamports: bigint) {
  return Buffer.concat([
    discriminator("allocate_yield_to_positions"),
    encodeString(facilityId),
    encodeString(snapshotId),
    encodeU64(amountLamports),
  ]);
}

function encodeClaimYieldData(mint: PublicKey) {
  return Buffer.concat([discriminator("claim_yield"), mint.toBuffer()]);
}

function readAnchorString(data: Buffer, offset: number) {
  const length = data.readUInt32LE(offset);
  const start = offset + 4;
  return {
    value: data.subarray(start, start + length).toString("utf8"),
    nextOffset: start + length,
  };
}

function decodeYieldPositionState(data: Buffer): YieldPositionState {
  let offset = 8;
  offset += 32;
  offset += 32;
  offset = readAnchorString(data, offset).nextOffset;
  offset += 32;

  const claimableLamports = data.readBigUInt64LE(offset);
  offset += 8;
  const claimedLamports = data.readBigUInt64LE(offset);

  return { claimableLamports, claimedLamports };
}

function decodeFacilityYieldPoolState(data: Buffer): FacilityYieldPoolState {
  let offset = 8;
  offset = readAnchorString(data, offset).nextOffset;
  offset += 32;
  offset += 32;
  offset += 8;
  offset += 8;
  const totalClaimedLamports = data.readBigUInt64LE(offset);
  offset += 8;
  const pendingUnallocatedLamports = data.readBigUInt64LE(offset);

  return { pendingUnallocatedLamports, totalClaimedLamports };
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

export async function runYieldVaultLifecycle(): Promise<YieldLifecycleResult> {
  const scenario = await createYieldVaultScenario();
  await scenario.initializeVaultAndPool();
  await scenario.mintBedrightAndInitPosition();
  await scenario.depositAndAllocate();
  await scenario.claimYield();

  const positionState = await scenario.fetchYieldPositionState();
  const poolState = await scenario.fetchFacilityYieldPoolState();

  return {
    depositedLamports: DEPOSITED_LAMPORTS,
    allocatedLamports: ALLOCATED_LAMPORTS,
    claimedLamports: positionState.claimedLamports,
    positionClaimableLamports: positionState.claimableLamports,
    positionClaimedLamports: positionState.claimedLamports,
    poolPendingLamports: poolState.pendingUnallocatedLamports,
    poolClaimedLamports: poolState.totalClaimedLamports,
  };
}

export async function createYieldVaultScenario(): Promise<YieldVaultScenario> {
  const provider = createProvider();
  anchor.setProvider(provider);

  await ensureWalletBalance(provider, 3_000_000_000);

  const payer = (provider.wallet as anchor.Wallet).publicKey;
  const treasuryOwner = Keypair.generate();
  const nftMint = Keypair.generate();
  const unique = `${Date.now()}-${Keypair.generate().publicKey.toBase58().slice(0, 6)}`;
  const facilityId = `FAC-${unique}`.slice(0, 32);
  const bedClassId = `BED-${unique}`.slice(0, 32);
  const snapshotId = `SNAP-${unique}`.slice(0, 32);

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
  const yieldVaultPda = derivePda(YIELD_VAULT_PROGRAM_ID, [Buffer.from("yield_vault")]);
  const facilityYieldPoolPda = derivePda(YIELD_VAULT_PROGRAM_ID, [
    Buffer.from("facility_yield_pool"),
    Buffer.from(facilityId),
  ]);
  const yieldPositionPda = derivePda(YIELD_VAULT_PROGRAM_ID, [
    Buffer.from("yield_position"),
    nftMint.publicKey.toBuffer(),
  ]);
  const yieldDistributionPda = derivePda(YIELD_VAULT_PROGRAM_ID, [
    Buffer.from("yield_distribution"),
    Buffer.from(snapshotId),
  ]);

  let initializedVaultAndPool = false;
  let initializedPosition = false;
  let allocatedYield = false;
  let claimedYield = false;

  async function initializeVaultAndPool() {
    if (initializedVaultAndPool) {
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
        data: encodeInitializeFacilityData(facilityId, "CareChain Test Facility", "Shanghai", 10),
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
        programId: YIELD_VAULT_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: yieldVaultPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeInitializeYieldVaultData(CARECHAIN_PROGRAM_ID),
      })
    );

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: YIELD_VAULT_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: yieldVaultPda, isSigner: false, isWritable: false },
          { pubkey: facilityPda, isSigner: false, isWritable: false },
          { pubkey: facilityYieldPoolPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeInitializeFacilityYieldPoolData(facilityId),
      })
    );

    initializedVaultAndPool = true;
  }

  async function mintBedrightAndInitPosition() {
    if (initializedPosition) {
      return;
    }

    await initializeVaultAndPool();

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

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: YIELD_VAULT_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: yieldVaultPda, isSigner: false, isWritable: false },
          { pubkey: facilityYieldPoolPda, isSigner: false, isWritable: false },
          { pubkey: nftMint.publicKey, isSigner: false, isWritable: false },
          { pubkey: bedPositionPda, isSigner: false, isWritable: false },
          { pubkey: yieldPositionPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeInitializeYieldPositionData(facilityId),
      })
    );

    initializedPosition = true;
  }

  async function depositAndAllocate() {
    if (allocatedYield) {
      return;
    }

    await mintBedrightAndInitPosition();

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: YIELD_VAULT_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: yieldVaultPda, isSigner: false, isWritable: true },
          { pubkey: payer, isSigner: false, isWritable: false },
          { pubkey: facilityYieldPoolPda, isSigner: false, isWritable: true },
          { pubkey: yieldDistributionPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeDepositYieldData(facilityId, DEPOSITED_LAMPORTS, snapshotId),
      })
    );

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: YIELD_VAULT_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: facilityYieldPoolPda, isSigner: false, isWritable: true },
          { pubkey: yieldDistributionPda, isSigner: false, isWritable: true },
          { pubkey: yieldPositionPda, isSigner: false, isWritable: true },
        ],
        data: encodeAllocateYieldToPositionsData(facilityId, snapshotId, ALLOCATED_LAMPORTS),
      })
    );

    allocatedYield = true;
  }

  async function claimYield() {
    if (claimedYield) {
      return;
    }

    await depositAndAllocate();

    await sendInstruction(
      provider,
      new TransactionInstruction({
        programId: YIELD_VAULT_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: yieldVaultPda, isSigner: false, isWritable: true },
          { pubkey: facilityYieldPoolPda, isSigner: false, isWritable: true },
          { pubkey: yieldPositionPda, isSigner: false, isWritable: true },
        ],
        data: encodeClaimYieldData(nftMint.publicKey),
      })
    );

    claimedYield = true;
  }

  async function fetchYieldPositionState() {
    const account = await fetchRequiredAccount(provider.connection, yieldPositionPda);
    return decodeYieldPositionState(account.data);
  }

  async function fetchFacilityYieldPoolState() {
    const account = await fetchRequiredAccount(provider.connection, facilityYieldPoolPda);
    return decodeFacilityYieldPoolState(account.data);
  }

  return {
    provider,
    facilityId,
    bedClassId,
    snapshotId,
    nftMint,
    addresses: {
      facilityPda,
      bedClassPda,
      bedPositionPda,
      yieldVaultPda,
      facilityYieldPoolPda,
      yieldPositionPda,
      yieldDistributionPda,
    },
    initializeVaultAndPool,
    mintBedrightAndInitPosition,
    depositAndAllocate,
    claimYield,
    fetchYieldPositionState,
    fetchFacilityYieldPoolState,
  };
}
