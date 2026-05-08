import { Program, type Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import carechainIdl from "../../../target/idl/carechain.json";
import priorityQueueIdl from "../../../target/idl/priority_queue.json";
import yieldVaultIdl from "../../../target/idl/yield_vault.json";

export const CARECHAIN_PROGRAM_ID = new PublicKey(carechainIdl.address);
export const PRIORITY_QUEUE_PROGRAM_ID = new PublicKey(priorityQueueIdl.address);
export const YIELD_VAULT_PROGRAM_ID = new PublicKey(yieldVaultIdl.address);

// 使用 Provider 或 Connection 创建 Program 实例
export const getCareChainProgram = (provider: any) => {
    return new Program(carechainIdl as Idl, provider);
};

export const getPriorityQueueProgram = (provider: any) => {
    return new Program(priorityQueueIdl as Idl, provider);
};

export const getYieldVaultProgram = (provider: any) => {
    return new Program(yieldVaultIdl as Idl, provider);
};

export type CarechainIdlType = typeof carechainIdl;
export const IDL = carechainIdl;
