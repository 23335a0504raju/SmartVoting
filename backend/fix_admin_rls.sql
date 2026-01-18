-- Enable RLS on admins just in case
alter table admins enable row level security;

-- Allow anyone to insert (for Seeding Admin)
drop policy if exists "Enable insert for admins" on admins;
create policy "Enable insert for admins" on admins for insert with check (true);

-- Allow anyone to select (for Admin Login)
drop policy if exists "Enable select for admins" on admins;
create policy "Enable select for admins" on admins for select using (true);
