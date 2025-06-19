'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/lib/contexts/AuthContext'
import { Heart } from 'lucide-react'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
  requireOnboarding?: boolean
}

export function AuthGuard({ 
  children, 
  redirectTo = '/login',
  requireOnboarding = false 
}: AuthGuardProps) {
  const router = useRouter()
  const { user, loading } = useAuthContext()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
      } else if (requireOnboarding) {
        // Check if user has completed onboarding
        // This would require fetching user profile from Firestore
        // For now, we'll assume onboarding is required if user doesn't have displayName
        if (!user.displayName) {
          router.push('/onboarding')
        }
      }
    }
  }, [user, loading, router, redirectTo, requireOnboarding])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full jona-gradient flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Carregando...</h3>
          <div className="animate-spin w-6 h-6 border-2 border-jona-green-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
} 