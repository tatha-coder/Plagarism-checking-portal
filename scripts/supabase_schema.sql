-- ==============================================================================
-- PLAGIARISM CHECKING PORTAL - COMPLETE SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PUBLIC PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  role text default 'student' check (role in ('student', 'admin')),
  roll_number text,
  section text,
  program text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. DOCUMENTS TABLE
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  filename text not null,
  file_path text,
  file_type text check (file_type in ('pdf', 'docx', 'txt', 'raw')) not null default 'txt',
  file_size bigint default 0,
  extracted_text text not null,
  word_count integer default 0,
  char_count integer default 0,
  sentence_count integer default 0,
  is_corpus_item boolean default false,
  author_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PLAGIARISM REPORTS TABLE
create table if not exists public.plagiarism_reports (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  overall_score numeric(5,2) not null default 0.0,
  risk_level text check (risk_level in ('low', 'moderate', 'high', 'very_high')) not null default 'low',
  matched_sources_count integer default 0,
  matched_passages_count integer default 0,
  analysis_duration_ms integer default 0,
  algorithm_breakdown jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SIMILARITY MATCHES TABLE
create table if not exists public.similarity_matches (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.plagiarism_reports(id) on delete cascade not null,
  source_document_id text not null,
  source_title text not null,
  source_author text,
  source_type text check (source_type in ('academic_corpus', 'student_submission', 'external_reference')) not null default 'academic_corpus',
  similarity_percentage numeric(5,2) not null default 0.0,
  matched_text text not null,
  source_text text not null,
  start_offset integer not null default 0,
  end_offset integer not null default 0,
  sentence_index integer,
  confidence_score numeric(5,2) default 1.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SYSTEM SETTINGS TABLE
create table if not exists public.system_settings (
  id text primary key default 'global-settings',
  ngram_size integer default 3,
  similarity_threshold_low numeric(5,2) default 15.0,
  similarity_threshold_moderate numeric(5,2) default 30.0,
  similarity_threshold_high numeric(5,2) default 50.0,
  min_passage_length integer default 20,
  exact_match_weight numeric(4,2) default 0.40,
  ngram_weight numeric(4,2) default 0.35,
  cosine_weight numeric(4,2) default 0.25,
  allow_student_delete boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default system settings if not existing
insert into public.system_settings (id)
values ('global-settings')
on conflict (id) do nothing;

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.plagiarism_reports enable row level security;
alter table public.similarity_matches enable row level security;
alter table public.system_settings enable row level security;

-- 8. POLICIES: PROFILES
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using ( true );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id );

-- 9. POLICIES: DOCUMENTS
drop policy if exists "Users can view their own documents or corpus" on public.documents;
create policy "Users can view their own documents or corpus"
  on public.documents for select
  to authenticated
  using ( user_id = (select auth.uid()) or is_corpus_item = true );

drop policy if exists "Users can insert their own documents" on public.documents;
create policy "Users can insert their own documents"
  on public.documents for insert
  to authenticated
  with check ( user_id = (select auth.uid()) );

drop policy if exists "Users can delete their own documents" on public.documents;
create policy "Users can delete their own documents"
  on public.documents for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- 10. POLICIES: PLAGIARISM REPORTS & MATCHES
drop policy if exists "Users can view reports of accessible documents" on public.plagiarism_reports;
create policy "Users can view reports of accessible documents"
  on public.plagiarism_reports for select
  to authenticated
  using (
    exists (
      select 1 from public.documents d
      where d.id = plagiarism_reports.document_id
      and (d.user_id = (select auth.uid()) or d.is_corpus_item = true)
    )
  );

drop policy if exists "Users can view similarity matches of accessible reports" on public.similarity_matches;
create policy "Users can view similarity matches of accessible reports"
  on public.similarity_matches for select
  to authenticated
  using (
    exists (
      select 1 from public.plagiarism_reports r
      join public.documents d on d.id = r.document_id
      where r.id = similarity_matches.report_id
      and (d.user_id = (select auth.uid()) or d.is_corpus_item = true)
    )
  );

-- 11. POLICIES: SYSTEM SETTINGS
drop policy if exists "System settings are viewable by all authenticated users" on public.system_settings;
create policy "System settings are viewable by all authenticated users"
  on public.system_settings for select
  to authenticated
  using ( true );

-- 12. AUTOMATIC USER PROFILE TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update set
    name = coalesce(excluded.name, profiles.name),
    email = coalesce(excluded.email, profiles.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
