-- Final Schema Fix for Elections Table
-- Run this in Supabase SQL Editor

-- 1. Add missing columns (from v1 update) if they don't exist
alter table elections add column if not exists code text;
alter table elections add column if not exists serial_number text;
alter table elections add column if not exists voting_time integer default 60;

-- 2. Add missing columns (from v2 update) if they don't exist
alter table elections add column if not exists election_type text;
alter table elections add column if not exists start_at timestamp with time zone;
alter table elections add column if not exists end_at timestamp with time zone;

-- 3. Ensure candidates is jsonb
alter table elections alter column candidates type jsonb using candidates::jsonb;

-- 4. Check constraints (optional but good)
-- (Already present in user schema)
