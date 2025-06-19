import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  getDoc,
  addDoc 
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { OnboardingResponse, User } from '@/types'

// Firestore collection names
const USERS_COLLECTION = 'users'
const ONBOARDING_RESPONSES_COLLECTION = 'onboarding_responses'

export interface OnboardingData {
  answers: Record<number, string>
  instagramConnected: boolean
  completedAt: Date
}

export interface SaveOnboardingParams {
  userId: string
  answers: Record<number, string>
  instagramConnected: boolean
}

interface InstagramData {
  username?: string
  profilePicture?: string
  followersCount?: number
}

/**
 * Save onboarding responses to Firestore
 */
export async function saveOnboardingResponses({
  userId,
  answers,
  instagramConnected
}: SaveOnboardingParams): Promise<void> {
  try {
    // Convert answers to OnboardingResponse format
    const responses: OnboardingResponse[] = Object.entries(answers).map(([questionId, answer]) => ({
      question: `Question ${questionId}`,
      answer: answer.trim()
    }))

    // Save to onboarding_responses collection
    const onboardingDoc = {
      userId,
      responses,
      instagramConnected,
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }

    await addDoc(collection(db, ONBOARDING_RESPONSES_COLLECTION), onboardingDoc)

    // Update user document to mark onboarding as completed
    const userRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(userRef, {
      onboardingCompleted: true,
      instagramConnected,
      updatedAt: serverTimestamp()
    })

    console.log('Onboarding responses saved successfully')
  } catch (error) {
    console.error('Error saving onboarding responses:', error)
    throw new Error('Failed to save onboarding responses')
  }
}

/**
 * Create or update user profile
 */
export async function createOrUpdateUserProfile(userData: Partial<User>): Promise<void> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user found')
    }

    const userRef = doc(db, USERS_COLLECTION, currentUser.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      })
    } else {
      // Create new user document
      await setDoc(userRef, {
        id: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName || '',
        avatar: currentUser.photoURL || '',
        onboardingCompleted: false,
        instagramConnected: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...userData
      })
    }

    console.log('User profile updated successfully')
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}

/**
 * Update Instagram connection status
 */
export async function updateInstagramConnection(
  userId: string, 
  connected: boolean,
  instagramData?: InstagramData
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId)
    const updateData: {
      instagramConnected: boolean
      updatedAt: ReturnType<typeof serverTimestamp>
      instagramData?: InstagramData | null
    } = {
      instagramConnected: connected,
      updatedAt: serverTimestamp()
    }

    if (connected && instagramData) {
      updateData.instagramData = instagramData
    } else if (!connected) {
      // Remove Instagram data when disconnecting
      updateData.instagramData = null
    }

    await updateDoc(userRef, updateData)
    console.log('Instagram connection status updated successfully')
  } catch (error) {
    console.error('Error updating Instagram connection:', error)
    throw new Error('Failed to update Instagram connection')
  }
}

/**
 * Get user's onboarding status
 */
export async function getUserOnboardingStatus(userId: string): Promise<{
  completed: boolean
  instagramConnected: boolean
}> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        completed: userData.onboardingCompleted || false,
        instagramConnected: userData.instagramConnected || false
      }
    }

    return {
      completed: false,
      instagramConnected: false
    }
  } catch (error) {
    console.error('Error getting user onboarding status:', error)
    throw new Error('Failed to get onboarding status')
  }
} 