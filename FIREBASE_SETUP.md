# Firebase Setup Guide — Capital Mastery

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Create a project"**
3. Enter project name: `capital-mastery`
4. Disable Google Analytics (optional) → Click **Create Project**

---

## Step 2: Register Web App

1. In project dashboard, click the **Web icon** `</>` to add a web app
2. Enter app nickname: `capital-mastery-web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **Register App**
5. You'll get a config object like this — **copy it**:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "capital-mastery.firebaseapp.com",
  projectId: "capital-mastery",
  storageBucket: "capital-mastery.firebasestorage.app",
  messagingSenderId: "701476803616",
  appId: "1:701476803616:web:..."
};
```

---

## Step 3: Enable Authentication

1. In Firebase Console → **Build** → **Authentication** → Click **Get Started**
2. Go to **Sign-in method** tab
3. Enable these providers:
   - **Email/Password** → Toggle ON → Save
   - **Google** → Toggle ON → Select support email → Save

---

## Step 4: Enable Firestore Database

1. In Firebase Console → **Build** → **Firestore Database** → Click **Create Database**
2. Choose **Start in test mode** → Click Next
3. Select your closest region → Click **Enable**
4. After creation, go to **Rules** tab and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Profiles - anyone authenticated can read, only owner can write
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Conversations - authenticated users can manage
    match /conversations/{convId} {
      allow read, write: if request.auth != null;
    }

    // Messages - authenticated users can manage
    match /messages/{msgId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

---

## Step 5: Set Up Environment Variables

Create/update `.env.local` in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=capital-mastery.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=capital-mastery
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=capital-mastery.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=701476803616
NEXT_PUBLIC_FIREBASE_APP_ID=1:701476803616:web:...your_app_id

# AI Chatbot Keys
GEMINI_API_KEY=your_gemini_key
TAVILY_API_KEY=your_tavily_key
```

Replace the `...` values with your actual Firebase config from Step 2.

---

## Step 6: Create Firestore Indexes (if needed)

If you see errors about missing indexes in the browser console:

1. Go to Firebase Console → **Firestore Database** → **Indexes** tab
2. Click **Create Index** for each:

| Collection | Fields | Query scope |
|------------|--------|-------------|
| `messages` | `conversation_id` ASC, `created_at` ASC | Collection |
| `messages` | `conversation_id` ASC, `created_at` DESC | Collection |

Or click the link in the error message — it auto-creates the index.

---

## Step 7: Install Dependencies

```bash
npm install firebase
```

Remove Supabase (already done):
```bash
npm uninstall @supabase/supabase-js
```

---

## Step 8: Test the Setup

1. Run the dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/auth`

3. **Sign Up** with email/password:
   - Account is created in Firebase Auth
   - Firebase sends a verification email automatically
   - Check your inbox and click the verification link
   - Click "I've Verified — Continue" in the app
   - You'll be redirected to the dashboard

4. **Google Sign-In** → Should work if Google provider is enabled (no email verification needed)

5. After login, play around (earn coins, complete modules, etc.), then check Firebase Console → Firestore Database:
   - `profiles/{uid}` — should have your profile
   - `users/{uid}` — should have your progress data

6. Log out, log back in → Your data should persist from Firestore

---

## Email Verification Flow

1. User signs up → Firebase Auth creates account
2. `sendEmailVerification(user)` → Firebase sends verification email with link
3. User sees "Check your email" screen
4. User clicks the link in the email → email is verified
5. App auto-detects verification (polls every 3s) OR user clicks "I've Verified"
6. User is redirected to dashboard

If user logs in before verifying:
- They'll see the verification screen
- Can resend the verification email
- Can click "I've Verified" after clicking the link

---

## Firestore Collection Structure

```
firestore/
├── profiles/{uid}          ← User profile (name, email, status, city)
│   ├── display_name
│   ├── email
│   ├── last_sync
│   ├── name
│   ├── status
│   └── city
│
├── users/{uid}             ← Full app progress & data
│   ├── completedModules
│   ├── moduleProgress
│   ├── quizScores
│   ├── coins
│   ├── xp
│   ├── level
│   ├── streak
│   ├── badges
│   ├── earnedBadges
│   ├── activityLog
│   ├── goals
│   ├── expenses
│   ├── savingsChallenge
│   ├── habitTracker
│   ├── healthCheckup
│   └── ... (35+ fields)
│
├── conversations/{id}      ← Chat conversations
│   ├── title
│   └── updated_at
│
└── messages/{id}           ← Chat messages
    ├── conversation_id
    ├── role
    ├── content
    ├── created_at
    ├── route
    ├── latency_ms
    └── sources
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Firebase config is missing" | Check `.env.local` has all `NEXT_PUBLIC_FIREBASE_*` vars |
| "Permission denied" on Firestore | Check Rules are published, or set to test mode temporarily |
| Google sign-in popup blocked | Allow popups in browser for `localhost` |
| Data not syncing | Check browser console for errors, ensure `db` is initialized |
| Index errors | Click the link in the error to auto-create the index |
| Auth state lost on refresh | Normal — Firebase Auth persists automatically, Zustand also persists to localStorage |
| Verification email not received | Check spam folder, ensure Email/Password provider is enabled in Firebase Console |
| "Email already in use" | Account exists with this email — use Sign In instead |
