-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create PROFILES Table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null,
    username text unique,
    is_published boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow public read access to active profiles" 
    on public.profiles for select 
    using (is_published = true);

create policy "Allow users to read their own profile" 
    on public.profiles for select 
    using (auth.uid() = id);

create policy "Allow users to update their own profile" 
    on public.profiles for update 
    using (auth.uid() = id);

create policy "Allow users to insert their own profile" 
    on public.profiles for insert 
    with check (auth.uid() = id);


-- 2. Create PORTFOLIOS Table (Stores dynamic JSON content)
create table public.portfolios (
    id uuid references public.profiles(id) on delete cascade primary key,
    theme_id text default 'minimal' not null,
    content jsonb not null default '{}'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for portfolios
alter table public.portfolios enable row level security;

-- Portfolios Policies
create policy "Allow public read access to active portfolios" 
    on public.portfolios for select 
    using (
        exists (
            select 1 from public.profiles 
            where profiles.id = portfolios.id and profiles.is_published = true
        )
    );

create policy "Allow users to read their own portfolio" 
    on public.portfolios for select 
    using (auth.uid() = id);

create policy "Allow users to update their own portfolio" 
    on public.portfolios for update 
    using (auth.uid() = id);

create policy "Allow users to insert their own portfolio" 
    on public.portfolios for insert 
    with check (auth.uid() = id);


-- 3. Create MESSAGES Table (For visitor queries)
create table public.messages (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid references public.profiles(id) on delete cascade not null,
    visitor_name text not null,
    visitor_email text not null,
    message_content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for messages
alter table public.messages enable row level security;

-- Messages Policies
create policy "Allow public to insert messages" 
    on public.messages for insert 
    with check (true); -- Anyone can send a message to a portfolio owner

create policy "Allow users to view their own messages" 
    on public.messages for select 
    using (auth.uid() = portfolio_id);

create policy "Allow users to delete their own messages" 
    on public.messages for delete 
    using (auth.uid() = portfolio_id);


-- 4. Indices for Performance
create index idx_profiles_username on public.profiles(username);
create index idx_messages_portfolio_id on public.messages(portfolio_id);

-- 5. Trigger to automatically create profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, username, is_published)
    values (new.id, new.email, null, false);
    
    insert into public.portfolios (id, theme_id, content)
    values (new.id, 'minimal', '{}'::jsonb);
    
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
