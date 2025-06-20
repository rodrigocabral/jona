'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '../firebase'
import { createOrUpdateUserProfile, getUserOnboardingStatus } from '../onboarding'
import { syncAuthWithCookies, clearAuthCookie } from '../auth-utils'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
  onboardingCompleted: boolean | null
  signOut: () => Promise<void>
  redirectAfterAuth: (fallback?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async user => {
        try {
          console.log('🔥 Auth state changed:', user ? `User: ${user.uid}` : 'No user')
          setUser(user)
          setError(null)

          // Sync auth state with cookies for middleware detection
          syncAuthWithCookies()

          if (user) {
            console.log('👤 Creating/updating user profile...')
            // Create or update user profile when user signs in
            await createOrUpdateUserProfile({
              id: user.uid,
              email: user.email || '',
              name: user.displayName || '',
              avatar: user.photoURL || '',
            })

            console.log('🔍 Checking onboarding status...')
            // Check onboarding status
            const onboardingStatus = await getUserOnboardingStatus(user.uid)
            console.log('📊 Onboarding status:', onboardingStatus)
            setOnboardingCompleted(onboardingStatus.completed)
            setHasCheckedOnboarding(true)
            console.log('✅ Onboarding check completed:', onboardingStatus.completed)
          } else {
            setOnboardingCompleted(null)
            setHasCheckedOnboarding(false)
            // Clear auth cookie when user signs out
            clearAuthCookie()
          }
        } catch (error) {
          console.error('❌ Error updating user profile:', error)
          setError('Erro ao atualizar perfil do usuário')

          // Even if there's an error, we should mark that we've attempted to check onboarding
          // This prevents the app from getting stuck in a loading state
          if (user) {
            setHasCheckedOnboarding(true)
            // Set a default onboarding status to prevent null state
            setOnboardingCompleted(false)
          }
        } finally {
          setLoading(false)
          console.log('🏁 Auth loading completed')
        }
      },
      error => {
        console.error('❌ Auth state change error:', error)
        setError(error.message)
        setLoading(false)
        setHasCheckedOnboarding(false)
        setOnboardingCompleted(null)
        // Clear auth cookie on error
        clearAuthCookie()
      }
    )

    return () => unsubscribe()
  }, [])

  // Function to get redirect URL from current page URL
  const getRedirectUrl = (): string | null => {
    if (typeof window === 'undefined') return null

    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('redirect')
  }

  // Function to handle redirection after authentication
  const redirectAfterAuth = (fallback: string = '/dashboard') => {
    const redirectTo = getRedirectUrl() || fallback

    console.log('🔄 Redirecting after auth:', {
      redirectTo,
      onboardingCompleted,
      fallback,
      hasCheckedOnboarding,
    })

    // If onboarding status hasn't been checked yet, wait
    if (!hasCheckedOnboarding) {
      console.log('⏳ Waiting for onboarding status to be checked...')
      return
    }

    // Use requestAnimationFrame for consistent timing
    requestAnimationFrame(() => {
      // If user hasn't completed onboarding, always go to onboarding first
      if (onboardingCompleted === false) {
        console.log('🎯 Redirecting to onboarding from redirectAfterAuth')
        router.push('/onboarding')
        return
      }

      // If onboarding is completed, redirect to intended destination or fallback
      if (onboardingCompleted === true) {
        console.log('🎯 Redirecting to:', redirectTo)
        router.push(redirectTo)
        return
      }

      // If onboarding status is still null, something went wrong - default to dashboard
      console.log('⚠️ Onboarding status is null in redirectAfterAuth, redirecting to dashboard')
      router.push('/dashboard')
    })
  }

  // Handle automatic redirection after authentication
  useEffect(() => {
    console.log('🔄 Redirect effect triggered:', {
      loading,
      user: user?.uid,
      hasCheckedOnboarding,
      onboardingCompleted,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
    })

    // Only proceed if we have all the required information
    if (loading || !user || !hasCheckedOnboarding) {
      console.log('🚫 Redirect conditions not met:', {
        loading,
        hasUser: !!user,
        hasCheckedOnboarding,
      })
      return
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    console.log('🗺️ Current path:', currentPath)

    // Use requestAnimationFrame to ensure DOM is ready and avoid timing issues
    requestAnimationFrame(() => {
      // Handle redirection based on onboarding status
      if (onboardingCompleted === false) {
        // User needs onboarding - always redirect unless already on onboarding page
        if (currentPath !== '/onboarding') {
          console.log('🎯 User needs onboarding - redirecting to /onboarding')
          router.push('/onboarding')
        } else {
          console.log('⏭️ Already on onboarding page')
        }
      } else if (onboardingCompleted === true) {
        // User completed onboarding - only redirect from auth pages
        if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/') {
          console.log('🎯 User completed onboarding - using redirectAfterAuth')
          redirectAfterAuth()
        } else {
          console.log('⏭️ User on valid page, no redirect needed')
        }
      } else {
        // onboardingCompleted is null - this shouldn't happen after our fix, but handle it
        console.log('⚠️ Onboarding status is null, defaulting to dashboard')
        if (currentPath !== '/dashboard') {
          router.push('/dashboard')
        }
      }
    })
  }, [user, loading, onboardingCompleted, hasCheckedOnboarding, router])

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setError(null)
      setOnboardingCompleted(null)
      setHasCheckedOnboarding(false)
      // Clear auth cookie
      clearAuthCookie()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    error,
    onboardingCompleted,
    signOut,
    redirectAfterAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
