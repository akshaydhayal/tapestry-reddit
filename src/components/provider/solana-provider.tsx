'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Use Devnet RPC
  const network = WalletAdapterNetwork.Devnet
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl(network)
  
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
