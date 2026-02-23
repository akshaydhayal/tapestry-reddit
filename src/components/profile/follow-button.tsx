'use client'

import { Alert } from '@/components/common/alert'
import { Button } from '@/components/common/button'
import { LoadCircle } from '@/components/common/load-circle'
import { useFollowUser } from '@/components/profile/hooks/use-follow-user'
import { useGetFollowersState } from '@/components/profile/hooks/use-get-follower-state'
import { useCurrentWallet } from '../auth/hooks/use-current-wallet'
import { useFollowEvent } from '@/hooks/use-follow-event'
import { useUnfollowUser } from './hooks/use-unfollow-user'
import { useState, useEffect } from 'react'

interface Props {
  username: string
}

export function FollowButton({ username }: Props) {
  const { walletAddress, mainUsername, loadingMainUsername } =
    useCurrentWallet()
  const { followUser, loading, error, success } = useFollowUser()
  const { unfollowUser } = useUnfollowUser()

  const { data, refetch } = useGetFollowersState({
    followeeUsername: username,
    followerUsername: mainUsername || '',
  })

  const { emitFollowChange } = useFollowEvent(refetch)
  const [localIsFollowing, setLocalIsFollowing] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (data?.isFollowing !== undefined) {
      setLocalIsFollowing(data.isFollowing)
    }
  }, [data?.isFollowing])

  const isFollowing = localIsFollowing ?? data?.isFollowing

  const handleFollowToggleClicked = async () => {
    if (mainUsername && username) {
      const originalState = isFollowing
      setLocalIsFollowing(!originalState) // Optimistic update
      
      try {
        if (originalState) {
          await unfollowUser({
            followerUsername: mainUsername,
            followeeUsername: username,
          })
        } else {
          await followUser({
            followerUsername: mainUsername,
            followeeUsername: username,
          })
        }
        console.log('Follow action successful, emitting event...')
        emitFollowChange()
      } catch (err) {
        setLocalIsFollowing(originalState) // Rollback
        console.error('Follow toggle failed:', err)
      }
    } else {
      console.error('No main username or followee username')
    }
  }

  if (!walletAddress) {
    return null
  }

  if (mainUsername === username) {
    return null
  }

  return (
    <>
      {loadingMainUsername ? (
        <span>
          <LoadCircle />
        </span>
      ) : (
        <Button onClick={handleFollowToggleClicked} disabled={loading}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}

      {success && (
        <Alert
          type="success"
          message="Followed user successfully!"
          duration={5000}
        />
      )}

      {error && (
        <Alert
          type="error"
          message="There was an error following the user."
          duration={5000}
        />
      )}
    </>
  )
}
