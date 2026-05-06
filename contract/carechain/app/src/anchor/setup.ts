import { Program, type Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import carechainIdl from "../../../target/idl/carechain.json";

export const PROGRAM_ID = new PublicKey(carechainIdl.address);

// 使用 Provider 或 Connection 创建 Program 实例
export const getCareChainProgram = (provider: any) => {
    return new Program(carechainIdl as Idl, provider);
};

export type CarechainIdlType = typeof carechainIdl;
export const IDL = carechainIdl;
