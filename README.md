# Trade Tracker — Deployment Guide

## Files
- `index.html` — Main app (single-file PWA)
- `manifest.json` — PWA manifest (installable on mobile/desktop)
- `sw.js` — Service worker (offline support)

---

## Step 1: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `trade-tracker`
3. Disable Google Analytics (optional) → **Create project**
4. Go to **Firestore Database** → **Create database** → Start in **production mode** → pick a region → **Done**
5. Go to **Firestore → Rules** and set:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   *(Secure this with auth later if needed)*
6. Go to **Project Settings → Your apps** → click `</>` (Web)
7. Register app as `trade-tracker-web`
8. Copy the `firebaseConfig` object

---

## Step 2: Add Firebase Config to index.html

Open `index.html` and find this section near the bottom:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace each `"YOUR_..."` value with the values from your Firebase project.

---

## Step 3: Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `trade-tracker`)
2. Upload all 3 files (`index.html`, `manifest.json`, `sw.js`) to the root
3. Go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch, **/ (root)** folder → **Save**
6. Wait ~1 minute → your app will be live at:
   `https://YOUR_USERNAME.github.io/trade-tracker/`

---

## Step 4: Install as App

**On Mobile (Android/iOS):**
- Open the URL in Chrome/Safari
- Tap the **Share** button → **Add to Home Screen**

**On Desktop (Chrome):**
- Click the install icon in the address bar

---

## Features
- ✅ Daily Trade logging with all fields
- ✅ Stats page with charts (by level, week, month)
- ✅ Trading day gap analysis (weekends excluded)
- ✅ Entry type / Structure / Exit category breakdowns
- ✅ Firebase sync across devices
- ✅ Offline fallback with localStorage
- ✅ Installable PWA on mobile & desktop
- ✅ 12-hour time format (manual HH/MM + AM/PM)
- ✅ Stats page is the default landing page
- ✅ Filter trades by sector, strategy, entry type
