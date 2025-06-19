# Firebase Setup Guide for JonA

This guide will help you set up Firebase for the JonA onboarding system.

## Prerequisites

1. Google/Firebase account
2. Node.js installed
3. Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "jona-app")
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 3: Enable Authentication

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable desired providers:
   - Email/Password
   - Google (recommended)
   - Instagram (for social login)

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app icon
4. Register your app with a nickname
5. Copy the configuration object

## Step 5: Set Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 6: Set Up Firestore Security Rules

1. Go to Firestore Database > Rules
2. Replace with these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can write their own onboarding responses
    match /onboarding_responses/{document} {
      allow create: if request.auth != null && 
                   request.auth.uid == resource.data.userId;
      allow read: if request.auth != null && 
                 request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/onboarding`
3. The page should now:
   - Check for authentication
   - Save responses to Firestore
   - Update user profile
   - Handle errors gracefully

## Firestore Collections Structure

### `users` Collection
```typescript
{
  id: string                    // Firebase Auth UID
  email: string                 // User email
  name: string                  // Display name
  avatar?: string               // Profile picture URL
  onboardingCompleted: boolean  // Onboarding status
  instagramConnected: boolean   // Instagram connection status
  instagramData?: {             // Instagram profile data
    username: string
    profilePicture: string
    followersCount: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `onboarding_responses` Collection
```typescript
{
  userId: string                // Reference to user
  responses: Array<{            // Onboarding Q&A
    question: string
    answer: string
  }>
  instagramConnected: boolean   // Instagram status at completion
  completedAt: Timestamp
  createdAt: Timestamp
}
```

## Next Steps

1. **Authentication**: Implement login/signup pages using Firebase Auth
2. **Instagram Integration**: Set up Meta Graph API for real Instagram connectivity
3. **Data Encryption**: Implement AES-256 encryption for sensitive data
4. **Security**: Review and tighten Firestore security rules for production
5. **Monitoring**: Set up Firebase Analytics and Performance monitoring

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**: Check your environment variables
2. **Permission denied**: Review Firestore security rules
3. **Auth errors**: Ensure authentication is properly set up
4. **CORS errors**: Check Firebase project configuration

### Debug Mode

To enable Firebase debug mode, add to your `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## Production Considerations

1. **Security Rules**: Tighten rules for production
2. **Environment Variables**: Use proper secrets management
3. **Data Backup**: Set up automated backups
4. **Monitoring**: Enable error reporting and analytics
5. **Performance**: Optimize queries and indexes 