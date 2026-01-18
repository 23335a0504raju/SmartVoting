-- Allow Updates to Voters Table (Required for Profile Update)
-- Run this in Supabase SQL Editor

-- 1. Enable Update Policy
drop policy if exists "Enable update for voters" on voters;
create policy "Enable update for voters" on voters for update using (true);

-- 2. Ensure Select is also enabled (already checked, but good measure)
drop policy if exists "Enable select for login" on voters;
create policy "Enable select for login" on voters for select using (true);
