# nilaa-os

Production-ready scaffold for a Khmer-first POS app using Firebase Hosting, Authentication, Firestore, and Cloud Functions.

## What is included

- Orders-only homepage for authenticated users
- Dashboard drawer for Money, Stock, Reports, and Admin
- Telegram request onboarding screen
- Admin user creation flow
- Firestore security rules and indexes
- Cloud Functions scaffold for:
  - admin account seeding
  - admin-only user creation
  - server-generated receipt PDF
- Local preview mode when `firebase-config.js` is still empty

## Before deploying

1. Copy `.firebaserc.example` to `.firebaserc` and set your Firebase project id.
2. Fill in `firebase-config.js` with your Firebase web app config.
3. Place a Khmer-compatible font file at `functions/assets/Battambang-Regular.ttf`.
4. Deploy Firestore rules, indexes, Hosting, and Functions with Firebase CLI.

## Admin seed account

The backend seed function is prepared to create:

- username: `nilaa-os0809$`
- password: `08090809`
- role: `admin`

For production, change these values through environment variables before seeding.
