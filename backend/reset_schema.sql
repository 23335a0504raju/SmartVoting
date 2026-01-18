-- IMPORTANT: RUNNING THIS WILL DELETE ALL EXISTING VOTER DATA
-- This is necessary because we improved the AI model (SFace) which uses a different data format (128 dimensions instead of 2622).

-- 1. Drop existing tables (Votes depends on Voters, so drop Votes first)
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS voters;

-- 2. Re-create Voters Table with correct Vector Size (128)
create table voters (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  pin_number text unique not null,
  voter_id text unique not null,
  email text unique not null,
  phone text unique not null,
  password_hash text, 
  
  -- SmartBallot Fields
  face_embedding vector(128),     -- SFace outputs 128 dimensions
  face_image_url text,            -- Store URL of image in bucket
  has_voted boolean default false,
  is_verified boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. Re-create Votes Table
create table votes (
  id uuid primary key default uuid_generate_v4(),
  election_id uuid references elections(id),
  voter_id uuid references voters(id),
  candidate_id text,
  timestamp timestamp with time zone default now()
);


-- 4. Enable Security Policies (RLS)
alter table voters enable row level security;

-- Drop old policies if they exist orphaned (clean slate)
drop policy if exists "Enable insert for registration" on voters;
drop policy if exists "Enable select for login" on voters;

-- Create Policies
create policy "Enable insert for registration" on voters for insert with check (true);
create policy "Enable select for login" on voters for select using (true);

-- 5. Storage Buckets & Policies (Idempotent)
insert into storage.buckets (id, name, public) 
values ('voter-faces', 'voter-faces', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Voter Faces" on storage.objects;
create policy "Public Access to Voter Faces" on storage.objects for select using (bucket_id = 'voter-faces'); 

drop policy if exists "Authenticated Upload to Voter Faces" on storage.objects;
create policy "Authenticated Upload to Voter Faces" on storage.objects for insert with check (bucket_id = 'voter-faces');
