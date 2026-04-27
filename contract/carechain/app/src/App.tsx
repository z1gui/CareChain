import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import InitializeFacility from './components/InitializeFacility';
import CreateBedClass from './components/CreateBedClass';
import MintBedrightNft from './components/MintBedrightNft';

export default function App() {
  // 设置为 Solana Devnet 测试网
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app-container">
            <header className="header">
              <h1>
                <span className="title-accent">CareChain</span> 测试网面板
              </h1>
              <WalletMultiButton />
            </header>

            <main className="panels-grid">
              <InitializeFacility />
              <CreateBedClass />
              <MintBedrightNft />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
