'use client'

import { useEffect, useCallback } from 'react'

const FOLLOW_CHANGE_EVENT = 'tapestry-follow-change'

export const useFollowEvent = (onFollowChange?: () => void) => {
  const emitFollowChange = useCallback(() => {
    window.dispatchEvent(new CustomEvent(FOLLOW_CHANGE_EVENT))
  }, [])

  useEffect(() => {
    if (!onFollowChange) return

    const handler = () => {
      onFollowChange()
    }

    window.addEventListener(FOLLOW_CHANGE_EVENT, handler)
    return () => window.removeEventListener(FOLLOW_CHANGE_EVENT, handler)
  }, [onFollowChange])

  return { emitFollowChange }
}
