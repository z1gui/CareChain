import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Keypair, Transaction, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { AnchorProvider, utils } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync, createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
import { getCareChainProgram } from '../anchor/setup';

export default function MintBedrightNft() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [facilityId, setFacilityId] = useState('FAC-001');
  const [bedClassId, setBedClassId] = useState('BED-S1');
  const [usdcMintStr, setUsdcMintStr] = useState('');
  
  const [status, setStatus] = useState('');

  // 辅助函数: 创建测试 USDC
  const handleCreateTestUsdc = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    setStatus('正在创建测试 USDC...');
    try {
      const mintKeypair = Keypair.generate();
      
      // 我们用一段原始的 tx 来构建 mint
      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "confirmed" });
      setStatus(`请在钱包中确认以构建虚假 USDC...`);
      
      // 注意: 在前端完整创建 Mint 需要发起多次交易或一个长交易，为了简单，我们可以提示用户。
      // 这个测试脚本建议在拥有测试网代币的情况下执行，或者由管理员预先派发。
      // 为保持代码简洁，暂时假设用户会输入有效的 Mint 或者我们可以简化处理
      alert(`测试代码: 为了完整跑通，请使用命令行先在本地生成一个 token 作为 USDC，然后填入下方的 USDC Mint 输入框中。`);
      setStatus('等待输入 Mint');
    } catch (err: any) {
      setStatus(`错误: ${err.message}`);
    }
  };

  const handleMint = async () => {
    if (!wallet.publicKey || !usdcMintStr) {
      alert("请先连接钱包并输入测试 USDC Mint 地址");
      return;
    }
    
    setStatus('处理中...');
    
    try {
      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "confirmed" });
      const program = getCareChainProgram(provider);

      // 解析 PDAs
      const [facilityPda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("facility"), utils.bytes.utf8.encode(facilityId)],
        program.programId
      );

      const [bedClassPda] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("bed_class"), 
          utils.bytes.utf8.encode(facilityId),
          utils.bytes.utf8.encode(bedClassId)
        ],
        program.programId
      );

      const [mintAuthorityPda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("mint_authority")],
        program.programId
      );

      // 为 NFT 生成新的 Keypair
      const nftMintKeypair = Keypair.generate();
      
      const usdcMint = new PublicKey(usdcMintStr);
      
      // 计算 ATAs
      const userNftAta = getAssociatedTokenAddressSync(nftMintKeypair.publicKey, wallet.publicKey);
      const userUsdcAta = getAssociatedTokenAddressSync(usdcMint, wallet.publicKey);
      
      // 金库 ATA - 我们假设 Facility 的 treasury 被设置成了 facility PDA 自身的 ATA，或者某个特定的 ATA
      // 如果报错 InvalidTreasury，说明初始化时填入的地址不匹配。
      // 我们先 fetch facility 来知道它登记的 config
      const facilityAcc = await program.account.facility.fetch(facilityPda);
      const treasuryUsdcAta = facilityAcc.treasury;

      const [bedPositionPda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("bed_position"), nftMintKeypair.publicKey.toBuffer()],
        program.programId
      );

      const [metadataPda] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          nftMintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      setStatus('请在钱包中确认交易...');
      const tx = await program.methods
        .mintBedrightNft(facilityId, bedClassId)
        .accounts({
          user: wallet.publicKey,
          facility: facilityPda,
          bedClass: bedClassPda,
          mintAuthority: mintAuthorityPda,
          nftMint: nftMintKeypair.publicKey,
          userNftAta: userNftAta,
          bedPosition: bedPositionPda,
          usdcMint: usdcMint,
          userUsdcAta: userUsdcAta,
          treasuryUsdcAta: treasuryUsdcAta,
          metadataAccount: metadataPda,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([nftMintKeypair])
        .rpc();

      setStatus(`成功! NFT Mint: ${nftMintKeypair.publicKey.toBase58()} TX: ${tx.slice(0, 8)}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`错误: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel">
      <div className="title">
        🪙 <span className="title-accent">Mint BedRight NFT</span>
      </div>
      
      <div className="form-group">
        <label>设施 ID</label>
        <input className="input-field" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} />
      </div>

      <div className="form-group">
        <label>床位分类 ID</label>
        <input className="input-field" value={bedClassId} onChange={(e) => setBedClassId(e.target.value)} />
      </div>

      <div className="form-group">
        <label>USDC Mint 地址</label>
        <input 
          className="input-field" 
          placeholder="请填入本地测试代币的 Mint 地址"
          value={usdcMintStr} 
          onChange={(e) => setUsdcMintStr(e.target.value)} 
        />
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <button className="btn-primary" style={{ background: '#475569' }} onClick={handleCreateTestUsdc}>
          协助工具
        </button>
        <button className="btn-primary" onClick={handleMint} disabled={!wallet.publicKey}>
          {status || '执行 Mint NFT'}
        </button>
      </div>
    </div>
  );
}
