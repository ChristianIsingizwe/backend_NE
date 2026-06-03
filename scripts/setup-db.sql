-- Create the per-service databases for the Fire Extinguisher Management System.
-- Database-per-service: each microservice owns its own database.
--
-- Run:
--   psql postgresql://postgres:postgres@localhost:5432/postgres -f scripts/setup-db.sql
-- or:
--   pnpm db:setup
--
-- CREATE DATABASE cannot run inside a transaction/DO block, so we use psql's
-- \gexec to conditionally execute the statement only when the DB is missing.

SELECT 'CREATE DATABASE auth'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auth')\gexec

SELECT 'CREATE DATABASE management'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'management')\gexec

SELECT 'CREATE DATABASE notification'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'notification')\gexec

\echo 'Databases ready: auth, management, notification'
