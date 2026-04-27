import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, utils } from '@coral-xyz/anchor';
import { BN } from 'bn.js';
import { getCareChainProgram } from '../anchor/setup';

export default function CreateBedClass() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [facilityId, setFacilityId] = useState('FAC-001');
  const [bedClassId, setBedClassId] = useState('BED-S1');
  const [roomType, setRoomType] = useState('Standard Single');
  const [careTier, setCareTier] = useState('Independent Living');
  const [priceUsdc, setPriceUsdc] = useState('500000000'); // defaults to 500 USDC
  const [apyBps, setApyBps] = useState('650'); // 6.5%
  const [totalSupply, setTotalSupply] = useState('50');
  const [privilegeLevel, setPrivilegeLevel] = useState('P1');
  
  const [status, setStatus] = useState('');

  const handleCreate = async () => {
    if (!wallet.publicKey) {
      alert("请先连接钱包");
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

      const [bedClassPda] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("bed_class"), 
          utils.bytes.utf8.encode(facilityId),
          utils.bytes.utf8.encode(bedClassId)
        ],
        program.programId
      );

      const tx = await program.methods
        .createBedClass(
          facilityId,
          bedClassId,
          roomType,
          careTier,
          new BN(priceUsdc),
          parseInt(apyBps),
          parseInt(totalSupply),
          privilegeLevel
        )
        .accounts({
          authority: wallet.publicKey,
          facility: facilityPda,
          bedClass: bedClassPda,
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
        🛏️ <span className="title-accent">创建 Bed Class</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="form-group">
          <label>所属设施 ID</label>
          <input className="input-field" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>床位分类 ID</label>
          <input className="input-field" value={bedClassId} onChange={(e) => setBedClassId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>房间类型</label>
          <input className="input-field" value={roomType} onChange={(e) => setRoomType(e.target.value)} />
        </div>
        <div className="form-group">
          <label>护理等级</label>
          <input className="input-field" value={careTier} onChange={(e) => setCareTier(e.target.value)} />
        </div>
        <div className="form-group">
          <label>售价 (含精度)</label>
          <input className="input-field" type="number" value={priceUsdc} onChange={(e) => setPriceUsdc(e.target.value)} />
        </div>
        <div className="form-group">
          <label>年化收益 (BPS)</label>
          <input className="input-field" type="number" value={apyBps} onChange={(e) => setApyBps(e.target.value)} />
        </div>
      </div>

      <button className="btn-primary" onClick={handleCreate} disabled={!wallet.publicKey}>
        {status || '执行 Create Bed Class'}
      </button>
    </div>
  );
}
