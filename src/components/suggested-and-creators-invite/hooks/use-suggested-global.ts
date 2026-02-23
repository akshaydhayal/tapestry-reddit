'use client'

import { ISuggestedProfile } from '@/models/profile.models'
import { useCallback, useState } from 'react'

export const useSuggestedGlobal = () => {
  const [profiles, setProfiles] = useState<ISuggestedProfile[]>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSuggestedGlobal = useCallback(async (walletAddress: string) => {
    if (!walletAddress) {
      setError('Owner wallet address is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/profiles/suggested/global?walletAddress=${walletAddress}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch suggested global profiles')
      }

      const data = await response.json()
      // Make it robust: handle if it's an object with profiles array or contents array
      const profilesArray = Array.isArray(data) 
        ? data 
        : (data.profiles || data.contents || data.suggestedProfiles || []);
      setProfiles(profilesArray)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    profiles,
    loading,
    error,
    getSuggestedGlobal,
  }
}
