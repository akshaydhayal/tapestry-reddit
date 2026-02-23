'use client'

import { IProfileList } from '@/models/profile.models'
import { useCallback, useState, useEffect } from 'react'

export const useAllProfiles = () => {
  const [profiles, setProfiles] = useState<IProfileList[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllProfiles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profiles/all-profiles')

      if (!response.ok) {
        throw new Error('Failed to fetch all profiles')
      }

      const data = await response.json()
      // Handle potential pagination or object wrapper
      const profilesArray = Array.isArray(data) 
        ? data 
        : (data.profiles || data.contents || data.identities || []);
      
      setProfiles(profilesArray)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllProfiles()
  }, [getAllProfiles])

  return {
    profiles,
    loading,
    error,
    refresh: getAllProfiles,
  }
}
