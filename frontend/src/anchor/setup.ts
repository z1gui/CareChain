import type { AnchorProvider, Idl } from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { carechainIdl, priorityQueueIdl, yieldVaultIdl } from '@/idl'

export function getPriorityQueueProgram(provider: AnchorProvider) {
  return new Program(priorityQueueIdl as Idl, provider)
}

export function getCarechainProgram(provider: AnchorProvider) {
  return new Program(carechainIdl as Idl, provider)
}

export function getYieldVaultProgram(provider: AnchorProvider) {
  return new Program(yieldVaultIdl as Idl, provider)
}
