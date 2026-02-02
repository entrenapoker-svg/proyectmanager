-- ==========================================
-- PART 0: LEGACY FIXES (User Requested)
-- Fixes 'category' column missing in projects
-- ==========================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';

-- Auto-categorize existing projects based on title
UPDATE projects 
SET category = 'IA' 
WHERE title ILIKE '%Poker%' OR title ILIKE '%GPT%' OR title ILIKE '%IA%';


-- ==========================================
-- PART 1: ADMIN SYSTEM INSTALLATION
-- ==========================================

-- 1. Create Profiles Table (Synced with auth.users)
-- This table stores extra user data like 'role'
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user', -- 'admin' or 'user'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Create Policy (Admins see all, Users see self)
-- First, drop existing policies to avoid errors if re-running
drop policy if exists "Profiles visible by self and admin" on profiles;

create policy "Profiles visible by self and admin" on profiles for select using (
  auth.uid() = id OR 
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 4. Trigger for new users (Syncs auth.users -> public.profiles)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Backfill existing users (Run this once to sync current users)
-- This inserts users that act exist in auth.users but not in public.profiles
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- 6. GRANT ADMIN ROLE (IMPORTANT: UPDATE THIS!)
-- Uncomment and run this line with your email to become admin immediately
-- update public.profiles set role = 'admin' where email = 'tu_email@ejemplo.com';
