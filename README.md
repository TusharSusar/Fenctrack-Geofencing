# 👶 Smart Child Tracker — React + Firebase Migration

A complete, production-grade React (Vite) application migrated from a vanilla HTML/JS dashboard.
Real-time child location tracking with client-side geofencing, Firebase Auth, Realtime Database, and Firestore.

---

## 📁 Project Structure

```
child-tracker/
├── index.html
├── vite.config.js
├── package.json
├── firebase.json              ← Hosting + DB + Firestore deploy config
├── database.rules.json        ← RTDB security rules
├── firestore.rules            ← Firestore security rules
├── .env.example               ← Copy to .env and fill in values
└── src/
    ├── main.jsx               ← React entry point
    ├── App.jsx                ← Router + AuthProvider wrapper
    ├── firebase.js            ← Firebase SDK init (Auth, RTDB, Firestore)
    ├── context/
    │   └── AuthContext.jsx    ← Auth state: login/logout, user
    ├── hooks/
    │   ├── useChildren.js     ← CRUD via Axios → RTDB REST API
    │   ├── useDeviceLocation.js ← RTDB onValue listener for live coords
    │   ├── useGeofence.js     ← Client-side breach detection + Firestore logging
    │   └── useAlertSound.js   ← Audio alert lifecycle management
    ├── pages/
    │   ├── LoginPage.jsx      ← Email/password sign-in form
    │   └── DashboardPage.jsx  ← Main tracking UI orchestrator
    ├── components/
    │   ├── ProtectedRoute.jsx ← Auth guard for private routes
    │   ├── LiveMap.jsx        ← React-Leaflet map with marker + zone circle
    │   ├── ChildCard.jsx      ← Selectable/deletable child item
    │   ├── AddChildForm.jsx   ← Controlled form with toast feedback
    │   ├── StatusBar.jsx      ← Distance / breach status display
    │   ├── RadiusSlider.jsx   ← Geofence radius control
    │   └── AlertBanner.jsx    ← Breach overlay with push notification
    ├── utils/
    │   ├── axiosInstance.js   ← Axios pre-configured w/ Firebase auth token
    │   └── geofence.js        ← Pure Haversine distance functions
    └── styles/
        └── global.css         ← Full design system (dark mission-control theme)
```

---

## 🗺️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React (Vite) App                      │
│                                                         │
│  LoginPage ──→ Firebase Auth (Email/Password)           │
│                      │                                  │
│             ProtectedRoute guard                        │
│                      │                                  │
│           DashboardPage (orchestrator)                  │
│           ┌───────────┬──────────────────┐              │
│      Sidebar           Map Panel                        │
│      ├ useChildren     ├ LiveMap (Leaflet)               │
│      │  └─ Axios →     ├ useDeviceLocation               │
│      │     RTDB REST   │  └─ RTDB onValue listener       │
│      └ ChildCards      └ useGeofence                     │
│                           ├─ RTDB zone read/write        │
│                           ├─ Haversine check (client)   │
│                           └─ Firestore alert log        │
└─────────────────────────────────────────────────────────┘

Firebase Services:
  RTDB     → /devices/{id}    (live ESP32 coords — read-only)
  RTDB     → /geofence/{id}   (zone center + radius)
  RTDB     → /parents/{uid}/children  (child registry)
  Firestore → /alerts         (breach event log, immutable)
  Auth     → Email/Password
  Hosting  → dist/ folder
```

---

## ⚡ Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.x | UI framework |
| `react-dom` | 18.x | DOM renderer |
| `react-router-dom` | 6.x | Client-side routing + ProtectedRoute |
| `firebase` | 10.x | Auth, RTDB, Firestore (modular SDK) |
| `axios` | 1.x | HTTP client — RTDB REST API calls |
| `leaflet` | 1.9.x | Map rendering engine |
| `react-leaflet` | 4.x | React bindings for Leaflet |
| `react-hot-toast` | 2.x | Non-blocking toast notifications |
| `vite` | 5.x | Build tool + dev server |
| `@vitejs/plugin-react` | 4.x | Vite React JSX transform |

---

## 🚀 Setup & Installation

### 1. Clone and install

```bash
git clone <your-repo>
cd child-tracker
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in all `VITE_FIREBASE_*` values from your Firebase Console → Project Settings → Your Apps.

### 3. Run development server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🔐 Firebase Setup Checklist

### Authentication
- Firebase Console → Authentication → Sign-in method
- Enable **Email/Password**
- Create a test parent account manually or via Firebase Console

### Realtime Database
- Firebase Console → Realtime Database → Rules
- Paste contents of `database.rules.json`
- Publish rules

### Firestore
- Firebase Console → Firestore Database → Rules
- Paste contents of `firestore.rules`
- Publish rules

### Firestore Indexes (if needed)
If you add queries to the alerts collection later, create composite indexes via the Firebase Console link shown in the browser console error.

---

## 🌐 Deployment to Firebase Hosting

```bash
# 1. Install Firebase CLI globally
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialise (only needed once)
firebase init
# Select: Hosting, Database, Firestore
# Public directory: dist
# Single-page app: Yes

# 4. Build the React app
npm run build

# 5. Deploy everything (hosting + rules)
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

Your app will be live at: `https://<your-project-id>.web.app`

---

## 🔄 Migration Summary: HTML → React

| HTML/JS | React Equivalent |
|---|---|
| `firebase-app` CDN script | `firebase` npm package, modular SDK |
| Inline `firebaseConfig` | `.env` → `VITE_FIREBASE_*` variables |
| `window.login = function()` | `AuthContext.login()` |
| `onAuthStateChanged` global | `AuthContext` provider + `useAuth()` hook |
| `loginSection.style.display` | React Router `<ProtectedRoute>` |
| `onValue(ref(...))` for children | `useChildren` hook |
| `onValue(ref(...))` for coords | `useDeviceLocation` hook |
| `getDistance()` + `checkGeofence()` | `useGeofence` hook + `utils/geofence.js` |
| `L.map()` + `L.circle()` | `<MapContainer>` + `<Circle>` (react-leaflet) |
| `document.getElementById().innerText` | React state + controlled components |
| `axios` (not used originally) | `axiosInstance.js` for RTDB REST (add/delete children) |
| Direct `new Notification()` | `AlertBanner` component |
| `new Audio().play()` | `useAlertSound` hook |
| `document.body.classList.add("flash")` | CSS class on dashboard root driven by state |

---

## 🛡️ Security Rules Logic

### RTDB (`database.rules.json`)
- `/devices/**` — any authenticated user can read (parents track devices)
- `/geofence/**` — authenticated users read/write zones
- `/parents/$uid/**` — users can ONLY access their own children list (UID scoped)

### Firestore (`firestore.rules`)
- `/alerts` — authenticated users can create and read alerts
- All other paths denied by default

---

## 🧪 Testing Plan

### Unit Tests (Vitest recommended)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

| Test | File | What to test |
|---|---|---|
| `haversineDistance` | `utils/geofence.test.js` | Known coords → expected metres |
| `isOutsideZone` | `utils/geofence.test.js` | Inside/outside boundary conditions |
| `LoginPage` | `pages/LoginPage.test.jsx` | Form renders, submit calls login |
| `ChildCard` | `components/ChildCard.test.jsx` | Click selects, delete button fires handler |
| `AddChildForm` | `components/AddChildForm.test.jsx` | Validation, onAdd called with correct args |

### Integration / E2E (Cypress or Playwright)
1. Sign in with test credentials
2. Add a child with a known device ID
3. Verify map marker appears at known coordinates
4. Set safe zone, verify circle renders green
5. Simulate out-of-zone coordinates (requires test RTDB write)
6. Verify alert banner, red circle, sound trigger

---

## 📋 Environment Variables Reference

| Variable | Where to find |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database → Data tab (URL at top) |
| `VITE_FIREBASE_PROJECT_ID` | Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Project Settings |
| `VITE_FIREBASE_APP_ID` | Project Settings |

---

## 🔮 Future Enhancements

- **Multi-parent support** — share child tracking with co-parents
- **Alert history page** — query Firestore `/alerts` with pagination
- **Push notifications** — Firebase Cloud Messaging (FCM) for background alerts
- **Offline support** — Firebase RTDB persistence: `enablePersistence()`
- **Route history** — store coordinate trail in Firestore for playback
- **Cloud Functions** — server-side geofence check as backup + SMS via Twilio