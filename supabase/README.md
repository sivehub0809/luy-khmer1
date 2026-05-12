# Supabase setup

This app now expects Supabase as the production backend.

## What to create in Supabase

1. A project
2. Email/Password auth enabled
3. Run `schema.sql` in the SQL editor
4. Create Edge Functions:
   - `admin-create-user`
   - `checkout-order`
   - `delete-order`
   - `generate-receipt-pdf`
5. Set function secrets/environment values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Frontend config

Put your project values in `supabase-config.js`:

- `url`
- `anonKey`

## Admin seed account

Create the first admin in Supabase Auth using a real email, for example:

- email: `nilaademo@gmail.com`
- password: `08090809`

Then insert the matching row in `users` with:

- `username = 'nilaa-os0809$'`
- `role = 'admin'`

The site can now log in with either:

- the real email, such as `nilaademo@gmail.com`
- or the app username when it follows the generated local-email pattern

## Admin-created accounts without email confirmation

To let `nilaademo@gmail.com` create shop accounts without waiting for email confirmation:

1. Deploy the `supabase/functions/admin-create-user` edge function
2. Set `SUPABASE_SERVICE_ROLE_KEY` for that function
3. Keep the frontend configured with `url` and `anonKey`

When deployed, the app will call `admin-create-user` first for admin-created shop accounts and use a service-role flow with `email_confirm: true`.
