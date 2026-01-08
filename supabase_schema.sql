-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROJECTS TABLE
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  color text default 'cyan',
  icon text default 'Cpu', 
  importance int default 5,
  ai_context text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TASKS TABLE
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  text text not null,
  done boolean default false,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Security)
alter table projects enable row level security;
alter table tasks enable row level security;

create policy "Users can view their own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

create policy "Users can view tasks of their projects" on tasks
  for select using (
    exists ( select 1 from projects where id = tasks.project_id and user_id = auth.uid() )
  );

create policy "Users can insert tasks to their projects" on tasks
  for insert with check (
    exists ( select 1 from projects where id = tasks.project_id and user_id = auth.uid() )
  );

create policy "Users can update their tasks" on tasks
  for update using (
    exists ( select 1 from projects where id = tasks.project_id and user_id = auth.uid() )
  );

create policy "Users can delete their tasks" on tasks
  for delete using (
    exists ( select 1 from projects where id = tasks.project_id and user_id = auth.uid() )
  );
