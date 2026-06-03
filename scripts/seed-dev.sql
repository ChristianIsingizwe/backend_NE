-- ---------------------------------------------------------------------------
-- Development seed data (NOT for production).
--
-- Seeds only the default admin account used for local development.
--
-- Admin credentials:
--   admin@tzw.test  -> admin
--   Password123
--
-- The bcrypt hash below is `Password123` hashed with bcryptjs (cost 12) - the
-- same algorithm the auth service uses to verify logins. The email is marked
-- verified so you skip the OTP step.
--
-- Run:
--   pnpm db:seed
-- or directly:
--   psql postgresql://postgres:postgres@localhost:5432/auth -f scripts/seed-dev.sql
--
-- Idempotent: the admin user is upserted by email and forced back to the
-- expected seeded credentials on every run.
-- ---------------------------------------------------------------------------

\set ON_ERROR_STOP on

\connect auth

INSERT INTO users (
  id,
  first_name,
  last_name,
  display_name,
  email,
  password,
  role,
  email_verified,
  created_at,
  updated_at
)
VALUES (
  'seed-usr-admin',
  'CHRISTIAN',
  'Admin',
  'CHRISTIAN Admin',
  'admin@tzw.test',
  '$2b$12$HJJ.Ck4K3qhnHgqBLg2ZWukqlPVT.RPXG0e2HAcwPyM3IS43L9LVO',
  'admin',
  now(),
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  display_name = EXCLUDED.display_name,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();
