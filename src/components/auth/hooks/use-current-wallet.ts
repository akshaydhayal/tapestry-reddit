'use client'

import { useGetProfiles } from '@/components/auth/hooks/use-get-profiles'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

export function useCurrentWallet() {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const { publicKey, connected } = useWallet()

  const { profiles, loading } = useGetProfiles({
    walletAddress: walletAddress || '',
  })

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58())
    } else {
      setWalletAddress('')
    }
  }, [publicKey, connected])

  return {
    walletIsConnected: !(walletAddress === ''),
    walletAddress,
    mainUsername: profiles?.[0]?.profile?.username,
    loadingMainUsername: loading,
    setWalletAddress,
  }
}
