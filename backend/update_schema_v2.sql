-- Update Elections Table
alter table elections add column if not exists election_type text; -- College, Class, Campus, Branch
alter table elections add column if not exists start_at timestamp with time zone;
alter table elections add column if not exists end_at timestamp with time zone;
-- Note: candidates is already jsonb, we will just change the structure of data stored in it.
-- { name: string, age: number, branch: string }

-- Update Voters Table
alter table voters add column if not exists gender text;
alter table voters add column if not exists class text;
alter table voters add column if not exists dob date;
alter table voters add column if not exists branch text;
