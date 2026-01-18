-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable pgvector extension
create extension if not exists "vector";

-- 1. Admins Table
create table if not exists admins (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default now()
);

-- 2. Voters Table (Updated for SmartBallot)
create table if not exists voters (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  pin_number text unique not null,
  voter_id text unique not null,
  email text unique not null,
  phone text unique not null,
  -- Removed password_hash for voters (Face only), or keep for fallback? 
  -- Keeping it nullable just in case, but primary auth is Face.
  password_hash text, 
  
  -- SmartBallot Fields
  face_embedding vector(128),
  face_image_url text, -- Store URL of image in bucket
  has_voted boolean default false,
  is_verified boolean default false,
  created_at timestamp with time zone default now()
);

-- Ensure storage extension is available (usually default in Supabase)
-- Create Bucket 'voter-faces' if not exists (This often requires specific permissions or is done in UI, but attempting via SQL)
insert into storage.buckets (id, name, public) 
values ('voter-faces', 'voter-faces', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Voter Faces" on storage.objects;
create policy "Public Access to Voter Faces" on storage.objects for select using (bucket_id = 'voter-faces'); 

drop policy if exists "Authenticated Upload to Voter Faces" on storage.objects;
create policy "Authenticated Upload to Voter Faces" on storage.objects for insert with check (bucket_id = 'voter-faces');

-- 3. Elections Table
create table if not exists elections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text check (status in ('active', 'closed', 'upcoming')) default 'upcoming',
  candidates jsonb default '[]'::jsonb,
  created_by text references admins(username),
  created_at timestamp with time zone default now()
);

-- 4. Votes Table
create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  election_id uuid references elections(id),
  voter_id uuid references voters(id),
  candidate_id text,
  timestamp timestamp with time zone default now()
);

-- RLS Policies
alter table admins enable row level security;
alter table voters enable row level security;
alter table elections enable row level security;

-- Admin Policies
drop policy if exists "Enable insert for admins" on admins;
create policy "Enable insert for admins" on admins for insert with check (true);

drop policy if exists "Enable select for admins" on admins;
create policy "Enable select for admins" on admins for select using (true);

drop policy if exists "Public elections are viewable by everyone" on elections;
create policy "Public elections are viewable by everyone" on elections for select using (true);

drop policy if exists "Admins can manage elections" on elections;
create policy "Admins can manage elections" on elections for all using (true);

drop policy if exists "Enable insert for registration" on voters;
create policy "Enable insert for registration" on voters for insert with check (true);

drop policy if exists "Enable select for login" on voters;
create policy "Enable select for login" on voters for select using (true);
