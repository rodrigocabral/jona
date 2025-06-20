import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { OnboardingResponse, User } from '@/types';

import { auth, db } from './firebase';

// Firestore collection names
const USERS_COLLECTION = 'users';
const ONBOARDING_RESPONSES_COLLECTION = 'onboarding_responses';
const QUESTIONS_COLLECTION = 'onboarding_questions';

export interface OnboardingData {
  answers: Record<number, string>;
  instagramConnected: boolean;
  completedAt: Date;
}

export interface SaveOnboardingParams {
  userId: string;
  answers: Record<number, string>;
  questions: Question[];
  instagramConnected: boolean;
}

export interface Question {
  id: number;
  title: string;
  subtitle: string;
  order: number;
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface InstagramData {
  username?: string;
  profilePicture?: string;
  followersCount?: number;
}

/**
 * Fetch active onboarding questions from Firebase
 */
export async function getOnboardingQuestions(): Promise<Question[]> {
  try {
    console.log('🔍 Fetching onboarding questions from Firebase...');

    const questionsRef = collection(db, QUESTIONS_COLLECTION);
    const q = query(
      questionsRef,
      where('active', '==', true),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const questions: Question[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      questions.push({
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        order: data.order,
        active: data.active,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    console.log(`✅ Fetched ${questions.length} questions from Firebase`);
    return questions;
  } catch (error) {
    console.error('❌ Error fetching questions:', error);

    // Fallback to default questions if Firebase fetch fails
    console.log('🔄 Using fallback questions...');
    return [
      {
        id: 1,
        title: 'O que mais te motiva no dia a dia?',
        subtitle:
          'Conte sobre suas paixões, hobbies ou atividades que te fazem sentir vivo(a).',
        order: 1,
        active: true,
      },
      {
        id: 2,
        title: 'Como você gosta de passar seu tempo livre?',
        subtitle:
          'Descreva suas atividades favoritas, lugares que gosta de frequentar ou como relaxa.',
        order: 2,
        active: true,
      },
      {
        id: 3,
        title: 'Quais valores são mais importantes para você?',
        subtitle:
          'Fale sobre princípios, crenças ou causas que guiam suas decisões e relacionamentos.',
        order: 3,
        active: true,
      },
      {
        id: 4,
        title: 'Como você se conecta melhor com outras pessoas?',
        subtitle:
          'Descreva situações, ambientes ou tipos de conversa onde você se sente mais à vontade.',
        order: 4,
        active: true,
      },
      {
        id: 5,
        title: 'O que você busca em uma amizade verdadeira?',
        subtitle:
          'Conte sobre qualidades, experiências ou momentos que considera importantes em relacionamentos.',
        order: 5,
        active: true,
      },
      {
        id: 6,
        title: 'Como você imagina seu futuro ideal?',
        subtitle:
          'Compartilhe seus sonhos, objetivos ou como gostaria que sua vida fosse daqui alguns anos.',
        order: 6,
        active: true,
      },
    ];
  }
}

/**
 * Save onboarding responses to Firestore
 */
export async function saveOnboardingResponses({
  userId,
  answers,
  questions,
  instagramConnected,
}: SaveOnboardingParams): Promise<void> {
  try {
    // Convert answers to OnboardingResponse format with actual question titles
    const responses: OnboardingResponse[] = Object.entries(answers).map(
      ([questionId, answer]) => {
        const questionData = questions.find(q => q.id === parseInt(questionId));
        return {
          question: questionData?.title || `Question ${questionId}`,
          answer: answer.trim(),
        };
      }
    );

    // Save to onboarding_responses collection
    const onboardingDoc = {
      userId,
      responses,
      instagramConnected,
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    await addDoc(
      collection(db, ONBOARDING_RESPONSES_COLLECTION),
      onboardingDoc
    );

    // Update user document to mark onboarding as completed
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      onboardingCompleted: true,
      instagramConnected,
      updatedAt: serverTimestamp(),
    });

    console.log('Onboarding responses saved successfully');
  } catch (error) {
    console.error('Error saving onboarding responses:', error);
    throw new Error('Failed to save onboarding responses');
  }
}

/**
 * Create or update user profile
 */
export async function createOrUpdateUserProfile(
  userData: Partial<User>
): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    console.log('🔍 Checking if user profile exists for:', currentUser.uid);
    const userRef = doc(db, USERS_COLLECTION, currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log('📝 Updating existing user profile');
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ User profile updated successfully');
    } else {
      console.log(
        '🆕 Creating new user profile with onboardingCompleted: false'
      );
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
        ...userData,
      });
      console.log('✅ New user profile created successfully');
    }
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw new Error('Failed to update user profile');
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
    const userRef = doc(db, USERS_COLLECTION, userId);
    const updateData: {
      instagramConnected: boolean;
      updatedAt: ReturnType<typeof serverTimestamp>;
      instagramData?: InstagramData | null;
    } = {
      instagramConnected: connected,
      updatedAt: serverTimestamp(),
    };

    if (connected && instagramData) {
      updateData.instagramData = instagramData;
    } else if (!connected) {
      // Remove Instagram data when disconnecting
      updateData.instagramData = null;
    }

    await updateDoc(userRef, updateData);
    console.log('Instagram connection status updated successfully');
  } catch (error) {
    console.error('Error updating Instagram connection:', error);
    throw new Error('Failed to update Instagram connection');
  }
}

/**
 * Get user's onboarding status
 */
export async function getUserOnboardingStatus(userId: string): Promise<{
  completed: boolean;
  instagramConnected: boolean;
}> {
  try {
    console.log('🔍 Getting onboarding status for user:', userId);
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('📊 User data from Firestore:', {
        onboardingCompleted: userData.onboardingCompleted,
        instagramConnected: userData.instagramConnected,
      });
      return {
        completed: userData.onboardingCompleted || false,
        instagramConnected: userData.instagramConnected || false,
      };
    }

    console.log('⚠️ User document does not exist, returning default values');
    return {
      completed: false,
      instagramConnected: false,
    };
  } catch (error) {
    console.error('❌ Error getting user onboarding status:', error);
    throw new Error('Failed to get onboarding status');
  }
}
