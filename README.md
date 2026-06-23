# Wedding Invitation Tracker

A web application to track and manage marriage invitation guests — who's been invited, by what method, and expected attendance count.

---

## Features

- **PIN-protected access** — single shared password for family use (stored in Firestore, changeable from Setup page)
- **Dashboard** — at-a-glance summary with live stats and charts:
  - Total invitees, already invited, pending, and expected guests
  - Pie chart: invitation status breakdown (Pending / Phone / Direct)
  - Bar chart: invitee count per category
  - Category-wise summary cards with progress bars
- **Invite List** — full filterable and searchable list of all members:
  - Grouped by category with collapsible sections
  - Filter by category, invitation status, and chance to attend
  - Tap a status badge to cycle: Pending → By Phone → Direct
  - Edit or delete any member inline
- **Add / Edit Member form** — slide-up modal with fields:
  - Name, phone number
  - Category + subcategory (dynamic based on Setup)
  - Invitation status (3-button toggle)
  - Number of guests expected (including the invitee)
  - Chance to attend (Confirmed / High / Medium / Low / Declined)
  - Notes
- **Setup page** — manage categories and subcategories:
  - Add, rename, or delete categories
  - Add, rename, or delete subcategories under each category
  - Change the app PIN
- **Real-time sync** — all changes sync instantly via Firestore live listeners (multiple family members can use simultaneously)

### Default Categories
1. My Friends
2. Relatives
3. Neighbours
4. Father's Friends
5. Mother's Friends
6. Shiyas' Friends
7. Shibila's Friends
8. Shafna's Friends

---

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Frontend framework | React 18 | UI components and state |
| Build tool | Vite | Fast dev server and production build |
| Styling | Tailwind CSS v3 | Utility-first CSS, rose/pink wedding theme |
| Routing | React Router v6 | Client-side navigation (Dashboard / Invites / Setup) |
| Charts | Recharts | Pie chart and horizontal bar chart on dashboard |
| Forms | React Hook Form | Controlled form state, validation |
| Icons | Lucide React | Clean icon set throughout the UI |
| Database | Firebase Firestore | NoSQL real-time database |
| Unique IDs | uuid (v4) | Generating subcategory IDs client-side |

---

## Architecture

```
src/
├── firebase/
│   └── config.js          # Firebase app init, exports `db` (Firestore)
│
├── contexts/
│   └── DataContext.jsx    # Global state: real-time Firestore listeners
│                            for `categories` and `invitees` collections.
│                            Exposes CRUD functions + PIN helpers.
│
├── hooks/
│   ├── useAuth.js         # PIN auth state in sessionStorage
│   └── useSeed.js         # Seeds 8 default categories + PIN on first run
│
├── pages/
│   ├── LoginPage.jsx      # PIN entry screen (shown when not authed)
│   ├── Dashboard.jsx      # Stats cards + charts + category summary
│   ├── InviteList.jsx     # Searchable/filterable grouped list
│   └── SetupPage.jsx      # Category/subcategory management + PIN change
│
├── components/
│   ├── Navbar.jsx         # Sticky top nav with route links + logout
│   ├── StatCard.jsx       # Single metric display card
│   ├── StatusBadge.jsx    # Color-coded status and chance badges
│   ├── MemberFormModal.jsx # Add/edit member slide-up modal
│   └── charts/
│       ├── StatusPieChart.jsx   # Recharts donut chart
│       └── CategoryBarChart.jsx # Recharts horizontal bar chart
│
├── App.jsx                # Router setup, PIN guard, modal state
├── main.jsx               # React root mount
└── index.css              # Tailwind directives + base reset
```

### Data Flow

```
Firestore ──onSnapshot──► DataContext ──Context API──► Pages / Components
                                  ▲
                          CRUD functions (addDoc, updateDoc, deleteDoc)
                          called from forms and inline actions
```

### Authentication

Simple PIN gate — no Firebase Auth used. The PIN is stored as plain text in `settings/app` Firestore document (suitable for a private family app). Auth state lives in `sessionStorage` and is cleared when the browser is closed.

---

## Firestore Collections

### `categories`
```
{
  name: string,
  order: number,
  subcategories: [ { id: string, name: string } ],
  createdAt: timestamp
}
```

### `invitees`
```
{
  name: string,
  phone: string,
  categoryId: string,
  categoryName: string,       // denormalized for display
  subcategoryId: string,
  subcategoryName: string,    // denormalized for display
  invitationStatus: "pending" | "invited_phone" | "invited_direct",
  guestsCount: number,        // total persons expected including invitee
  chanceToAttend: "confirmed" | "high" | "medium" | "low" | "declined",
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `settings/app`
```
{ pin: string }
```

---

## Setup & Running

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Create a `.env.local` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Get these values from Firebase Console → Project Settings → Your apps → Web app config.

### 3. Enable Firestore
In the Firebase Console, go to **Firestore Database** → **Create database** → choose Production mode.

### 4. Run the dev server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## Default PIN
`1234` — change it from the **Setup** page after first login.
