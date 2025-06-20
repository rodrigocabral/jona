# Firebase 400 Bad Request Troubleshooting Guide

## 🚨 **Quick Fixes for Common Issues**

### **1. Environment Variables Issues**

**Check your `.env.local` file:**

```bash
# Verify your .env.local file exists in project root
ls -la .env.local

# Check if variables are properly set (should show values, not placeholders)
cat .env.local | grep FIREBASE
```

**Common problems:**

- ❌ Using placeholder values like `your-firebase-api-key-here`
- ❌ Missing `.env.local` file (only `env.example` exists)
- ❌ Incorrect variable names (missing `NEXT_PUBLIC_` prefix)
- ❌ Extra spaces or quotes around values

**Fix:**

```bash
# 1. Copy the example file
cp env.example .env.local

# 2. Get real values from Firebase Console
# Go to: https://console.firebase.google.com
# Select your project → Project Settings → General → Your apps
# Copy each value exactly as shown

# 3. Restart your development server
npm run dev
```

### **2. Firebase Console Configuration**

**Authentication not enabled:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

**Domain not authorized:**

1. In Firebase Console → Authentication → Settings
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - `your-production-domain.com` (for production)

### **3. API Key Issues**

**Invalid API Key format:**

```javascript
// ❌ Wrong - placeholder value
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key-here

// ✅ Correct - real API key format
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxx...xxxXXX
```

**API Key restrictions:**

1. Firebase Console → Project Settings → General
2. Under "Your apps" → Web app → Config
3. Copy the `apiKey` value exactly

### **4. Project ID Problems**

**Incorrect Project ID:**

```javascript
// ❌ Wrong - placeholder or incorrect ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your - project - id

// ✅ Correct - actual project ID from Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID = jona - app - 12345
```

**Find your correct Project ID:**

1. Firebase Console → Project Settings → General
2. Look for "Project ID" field
3. Copy exactly as shown

### **5. Auth Domain Issues**

**Incorrect Auth Domain format:**

```javascript
// ❌ Wrong - missing .firebaseapp.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project

// ✅ Correct - includes .firebaseapp.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jona-app-12345.firebaseapp.com
```

## 🔧 **Step-by-Step Debugging**

### **Step 1: Verify Environment Variables**

Create this debug script to check your configuration:

```javascript
// Debug script - add to a test file
console.log('Firebase Config Check:')
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
console.log('Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
console.log(
  'Messaging Sender ID:',
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'
)
console.log('App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing')
```

### **Step 2: Test Firebase Connection**

Visit your debug page: `http://localhost:3000/debug-firebase`

This page will:

- ✅ Check all environment variables
- ✅ Test Firebase initialization
- ✅ Attempt a test signup
- ✅ Show detailed error messages

### **Step 3: Check Browser Console**

Open browser DevTools (F12) and look for:

```
❌ Firebase: Error (auth/invalid-api-key)
❌ Firebase: Error (auth/operation-not-allowed)
❌ Firebase: Error (auth/project-not-found)
❌ CORS error or network failure
```

## 🛠️ **Advanced Troubleshooting**

### **Network Issues**

**CORS Problems:**

```bash
# Try in incognito/private browsing mode
# Disable browser extensions temporarily
# Check if your network/firewall blocks Firebase
```

**Firewall/Proxy Issues:**

- Corporate networks may block Firebase endpoints
- Try from a different network (mobile hotspot)
- Check with network administrator

### **Firebase Project Issues**

**Project Quota Exceeded:**

1. Firebase Console → Usage tab
2. Check if you've exceeded free tier limits
3. Upgrade to paid plan if needed

**Project Deleted/Suspended:**

1. Verify project exists in Firebase Console
2. Check project status
3. Ensure billing is set up correctly

### **Browser-Specific Issues**

**Safari:**

- Enable "Disable Cross-Origin Restrictions" in Develop menu
- Clear cookies and site data

**Chrome:**

- Clear site data: Settings → Privacy → Site Settings
- Disable ad blockers temporarily

**Firefox:**

- Check Enhanced Tracking Protection settings
- Clear cookies and site data

## 🔍 **Error Code Reference**

| Error Code                    | Meaning                    | Fix                                   |
| ----------------------------- | -------------------------- | ------------------------------------- |
| `auth/invalid-api-key`        | API key is wrong/missing   | Check NEXT_PUBLIC_FIREBASE_API_KEY    |
| `auth/operation-not-allowed`  | Email/Password not enabled | Enable in Firebase Console            |
| `auth/project-not-found`      | Project ID is wrong        | Check NEXT_PUBLIC_FIREBASE_PROJECT_ID |
| `auth/invalid-email`          | Email format is invalid    | Validate email format                 |
| `auth/weak-password`          | Password < 6 characters    | Use stronger password                 |
| `auth/email-already-in-use`   | Email already registered   | Try signing in instead                |
| `auth/network-request-failed` | Network/CORS issue         | Check network/firewall                |

## ✅ **Quick Verification Checklist**

- [ ] `.env.local` file exists in project root
- [ ] All environment variables have real values (not placeholders)
- [ ] Firebase project exists and is active
- [ ] Email/Password authentication is enabled in Firebase Console
- [ ] Domain is authorized in Firebase Console
- [ ] Development server was restarted after env changes
- [ ] No browser extensions blocking requests
- [ ] Network allows Firebase connections

## 🚀 **Test Commands**

```bash
# 1. Check environment file
cat .env.local | grep FIREBASE

# 2. Restart development server
npm run dev

# 3. Test in browser
open http://localhost:3000/debug-firebase

# 4. Try signup with test credentials
# Email: test@example.com
# Password: testpassword123
```

## 📞 **Still Having Issues?**

If you're still getting 400 Bad Request errors:

1. **Share your error details:**

   - Exact error message from browser console
   - Environment variable status (without actual values)
   - Firebase Console screenshots

2. **Common overlooked items:**

   - Restart development server after env changes
   - Check for typos in environment variable names
   - Verify Firebase project billing status
   - Test with a completely new email address

3. **Emergency backup:**
   - Try creating a new Firebase project
   - Use Firebase emulator for local testing
   - Test with different browser/network

Remember: The debug page at `/debug-firebase` will help identify the exact issue! 🎯
