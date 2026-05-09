import { PublicKey } from '@solana/web3.js'
import { CARECHAIN_PROGRAM_ID, PRIORITY_QUEUE_PROGRAM_ID, YIELD_VAULT_PROGRAM_ID } from '@/idl'

export const carechainProgramId = new PublicKey(CARECHAIN_PROGRAM_ID)
export const priorityQueueProgramId = new PublicKey(PRIORITY_QUEUE_PROGRAM_ID)
export const yieldVaultProgramId = new PublicKey(YIELD_VAULT_PROGRAM_ID)

function utf8(str: string) {
  return new TextEncoder().encode(str)
}

export function deriveQueueStatePda(facilityId: string, programId: PublicKey = priorityQueueProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('queue_state'), utf8(facilityId)],
    programId,
  )[0]
}

export function deriveQueueEntryPda(
  facilityId: string,
  applicantId: string,
  programId: PublicKey = priorityQueueProgramId,
) {
  return PublicKey.findProgramAddressSync(
    [
      utf8('queue_entry'),
      utf8(facilityId),
      utf8(applicantId),
    ],
    programId,
  )[0]
}

export function deriveBedPositionPda(mint: PublicKey, programId: PublicKey = carechainProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('bed_position'), mint.toBuffer()],
    programId,
  )[0]
}

export function deriveFacilityPda(facilityId: string, programId: PublicKey = carechainProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('facility'), utf8(facilityId)],
    programId,
  )[0]
}

export function deriveYieldVaultPda(programId: PublicKey = yieldVaultProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('yield_vault')],
    programId,
  )[0]
}

export function deriveFacilityYieldPoolPda(facilityId: string, programId: PublicKey = yieldVaultProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('facility_yield_pool'), utf8(facilityId)],
    programId,
  )[0]
}

export function deriveYieldPositionPda(mint: PublicKey, programId: PublicKey = yieldVaultProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('yield_position'), mint.toBuffer()],
    programId,
  )[0]
}

export function deriveYieldDistributionPda(snapshotId: string, programId: PublicKey = yieldVaultProgramId) {
  return PublicKey.findProgramAddressSync(
    [utf8('yield_distribution'), utf8(snapshotId)],
    programId,
  )[0]
}

const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0]
}
