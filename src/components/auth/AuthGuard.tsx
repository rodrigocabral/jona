'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

import { useAuthContext } from '@/lib/contexts/AuthContext'


interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
  requireOnboarding?: boolean
}

export function AuthGuard({
  children,
  redirectTo = '/login',
  requireOnboarding = false,
}: AuthGuardProps) {
  const router = useRouter()
  const { user, loading, onboardingCompleted } = useAuthContext()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
      } else if (requireOnboarding && onboardingCompleted === false) {
        // User is authenticated but hasn't completed onboarding
        router.push('/onboarding')
      }
    }
  }, [user, loading, onboardingCompleted, router, redirectTo, requireOnboarding])

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

  // Don't render children if onboarding is required but not completed
  if (requireOnboarding && onboardingCompleted === false) {
    return null
  }

  return <>{children}</>
}
