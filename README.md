# nilaa-os

Production-ready scaffold for a Khmer-first POS app using Supabase Auth, Postgres, and Edge Functions.

## What is included

- Orders-only homepage for authenticated users
- Dashboard drawer for Money, Stock, Reports, and Admin
- Telegram request onboarding screen
- Admin user creation flow
- Supabase-ready backend adapter
- SQL schema and RLS policy scaffold
- Edge Function integration points for:
  - admin-only user creation
  - order checkout / stock sync
  - order deletion / stock restore
  - server-generated receipt PDF
- Local preview mode when `supabase-config.js` is still empty

## Before deploying

1. Create a Supabase project.
2. Fill in `supabase-config.js` with your project URL and anon key.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Create the needed Edge Functions listed in `supabase/README.md`.

## Admin seed account

Create the first Supabase auth user as a real email, for example:

- email: `dalisyes@gmail.com`
- password: `123`

Then add the matching row in table `users` with username `nilaa-os0809$` and role `admin`.
