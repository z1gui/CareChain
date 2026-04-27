import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, utils } from '@coral-xyz/anchor';
import { getCareChainProgram } from '../anchor/setup';

export default function InitializeFacility() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [facilityId, setFacilityId] = useState('FAC-001');
  const [name, setName] = useState('Sunny Care Home');
  const [city, setCity] = useState('Shanghai');
  const [totalBeds, setTotalBeds] = useState('100');
  const [treasuryAta, setTreasuryAta] = useState('');
  const [status, setStatus] = useState('');

  const handleInit = async () => {
    if (!wallet.publicKey) {
      alert("请先连接钱包");
      return;
    }
    if (!treasuryAta) {
      alert("请填写对应的 USDC Treasury Token Account (ATA)");
      return;
    }
    
    setStatus('处理中...');
    
    try {
      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "confirmed" });
      const program = getCareChainProgram(provider);

      const [facilityPda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("facility"), utils.bytes.utf8.encode(facilityId)],
        program.programId
      );

      const tx = await program.methods
        .initializeFacility(facilityId, name, city, parseInt(totalBeds))
        .accounts({
          authority: wallet.publicKey,
          facility: facilityPda,
          treasury: new PublicKey(treasuryAta),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus(`成功! TX: ${tx.slice(0, 8)}...`);
      console.log("Transaction signature", tx);
    } catch (err: any) {
      console.error(err);
      setStatus(`错误: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel">
      <div className="title">
        🏥 <span className="title-accent">初始化 Facility</span>
      </div>
      
      <div className="form-group">
        <label>设施 ID</label>
        <input className="input-field" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} />
      </div>

      <div className="form-group">
        <label>设施名称</label>
        <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>城市</label>
        <input className="input-field" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      <div className="form-group">
        <label>总床位数</label>
        <input className="input-field" type="number" value={totalBeds} onChange={(e) => setTotalBeds(e.target.value)} />
      </div>

      <div className="form-group">
        <label>金库 USDC ATA 地址</label>
        <input className="input-field" value={treasuryAta} placeholder="请填入上方SPL工具创建的ATA地址" onChange={(e) => setTreasuryAta(e.target.value)} />
      </div>

      <button className="btn-primary" onClick={handleInit} disabled={!wallet.publicKey}>
        {status || '执行 Initialize Facility'}
      </button>
    </div>
  );
}
