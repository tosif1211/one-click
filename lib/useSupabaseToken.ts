// utils/useSupabaseToken.ts
'use client'

import { useEffect, useState } from 'react'
import { createAdminClient } from './client'

export function useSupabaseToken() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createAdminClient()

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setToken(session?.access_token ?? null)
      } catch (error) {
        console.error('Error getting token:', error)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    getToken()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setToken(session?.access_token ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return { token, loading }
}
