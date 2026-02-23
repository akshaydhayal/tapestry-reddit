'use client'

import { DialectSolanaSdk } from '@dialectlabs/react-sdk-blockchain-solana'
import { NotificationsButton } from '@dialectlabs/react-ui'
import '@dialectlabs/react-ui/index.css'
import { useState, useEffect } from 'react'

export const DialectNotificationComponent = () => {
  const [mounted, setMounted] = useState(false)
  const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!DAPP_ADDRESS || !mounted) {
    return null
  }

  return (
    <DialectSolanaSdk dappAddress={DAPP_ADDRESS}>
      <NotificationsButton />
    </DialectSolanaSdk>
  )
}
