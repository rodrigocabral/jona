import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth'

import { auth } from './firebase'
import { createOrUpdateUserProfile } from './onboarding'

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Debug and log authentication errors with detailed information
 */
function debugAuthError(error: AuthError, operation: string) {
  console.error(`🚨 Firebase Auth Error during ${operation}:`)
  console.error('- Code:', error.code)
  console.error('- Message:', error.message)
  console.error('- Stack:', error.stack)

  // Log request details for debugging
  if (error.customData) {
    console.error('- Custom Data:', error.customData)
  }

  // Check for common 400 Bad Request causes
  if (error.message.includes('400')) {
    console.error('🔍 400 Bad Request - Possible causes:')
    console.error('  1. Invalid API key or project configuration')
    console.error('  2. Authentication method not enabled in Firebase Console')
    console.error('  3. Invalid email format or weak password')
    console.error('  4. CORS issues or network problems')
    console.error('  5. Firebase project quota exceeded')
  }
}

/**
 * Validate email format before sending to Firebase
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength before sending to Firebase
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  if (password.length > 4096) {
    return { valid: false, error: 'A senha é muito longa (máximo 4096 caracteres).' }
  }

  return { valid: true }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail({
  email,
  password,
  name,
}: SignUpData): Promise<FirebaseUser> {
  try {
    console.log('🚀 Starting email signup process...')

    // Validate inputs before sending to Firebase
    if (!validateEmail(email)) {
      throw new Error('Email inválido. Verifique o formato.')
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error || 'Senha inválida.')
    }

    if (!name.trim()) {
      throw new Error('Nome é obrigatório.')
    }

    console.log('✅ Input validation passed')
    console.log('- Email:', email)
    console.log('- Name:', name)
    console.log('- Password length:', password.length)

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('✅ User created successfully:', user.uid)

    // Update the user's display name
    await updateProfile(user, {
      displayName: name,
    })

    console.log('✅ Display name updated')

    // Create user profile in Firestore
    await createOrUpdateUserProfile({
      id: user.uid,
      email: user.email || '',
      name: name,
      avatar: '',
      onboardingCompleted: false,
      instagramConnected: false,
    })

    console.log('✅ User profile created in Firestore')
    return user
  } catch (error) {
    const authError = error as AuthError
    debugAuthError(authError, 'sign up')
    throw new Error(getAuthErrorMessage(authError.code))
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail({ email, password }: SignInData): Promise<FirebaseUser> {
  try {
    console.log('🚀 Starting email signin process...')

    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error('Email inválido. Verifique o formato.')
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error || 'Senha inválida.')
    }

    console.log('✅ Input validation passed')
    console.log('- Email:', email)

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('✅ User signed in successfully:', user.uid)
    return user
  } catch (error) {
    const authError = error as AuthError
    debugAuthError(authError, 'sign in')
    throw new Error(getAuthErrorMessage(authError.code))
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    console.log('🚀 Starting Google signin process...')

    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')

    console.log('✅ Google provider configured')

    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    console.log('✅ Google signin successful:', user.uid)

    // Create or update user profile in Firestore
    await createOrUpdateUserProfile({
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      avatar: user.photoURL || '',
    })

    console.log('✅ User profile updated in Firestore')
    return user
  } catch (error) {
    const authError = error as AuthError
    debugAuthError(authError, 'Google sign in')
    throw new Error(getAuthErrorMessage(authError.code))
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    console.log('🚀 Starting password reset process...')

    if (!validateEmail(email)) {
      throw new Error('Email inválido. Verifique o formato.')
    }

    console.log('✅ Email validation passed:', email)

    await sendPasswordResetEmail(auth, email)
    console.log('✅ Password reset email sent successfully')
  } catch (error) {
    const authError = error as AuthError
    debugAuthError(authError, 'password reset')
    throw new Error(getAuthErrorMessage(authError.code))
  }
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique seu email.'
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.'
    case 'auth/email-already-in-use':
      return 'Este email já está sendo usado por outra conta.'
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.'
    case 'auth/invalid-email':
      return 'Email inválido. Verifique o formato.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.'
    case 'auth/user-disabled':
      return 'Esta conta foi desabilitada.'
    case 'auth/operation-not-allowed':
      return 'Operação não permitida. Verifique se o método de autenticação está habilitado no Firebase Console.'
    case 'auth/popup-closed-by-user':
      return 'Login cancelado pelo usuário.'
    case 'auth/popup-blocked':
      return 'Popup bloqueado. Permita popups para este site.'
    case 'auth/invalid-api-key':
      return 'Chave de API inválida. Verifique a configuração do Firebase.'
    case 'auth/network-request-failed':
      return 'Erro de rede. Verifique sua conexão com a internet.'
    case 'auth/internal-error':
      return 'Erro interno do servidor. Tente novamente.'
    default:
      return `Erro de autenticação (${errorCode}). Tente novamente.`
  }
}
