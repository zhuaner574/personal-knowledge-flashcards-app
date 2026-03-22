create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  question text not null,
  answer text not null,
  due_date date not null default current_date,
  interval_days int not null default 1,
  last_reviewed_at date null,
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;
alter table public.flashcards enable row level security;

drop policy if exists "notes_select_own" on public.notes;
drop policy if exists "notes_insert_own" on public.notes;
drop policy if exists "notes_update_own" on public.notes;
drop policy if exists "notes_delete_own" on public.notes;

create policy "notes_select_own"
on public.notes for select
to authenticated
using (user_id = auth.uid());

create policy "notes_insert_own"
on public.notes for insert
to authenticated
with check (user_id = auth.uid());

create policy "notes_update_own"
on public.notes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "notes_delete_own"
on public.notes for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "flashcards_select_own" on public.flashcards;
drop policy if exists "flashcards_insert_own" on public.flashcards;
drop policy if exists "flashcards_update_own" on public.flashcards;
drop policy if exists "flashcards_delete_own" on public.flashcards;

create policy "flashcards_select_own"
on public.flashcards for select
to authenticated
using (user_id = auth.uid());

create policy "flashcards_insert_own"
on public.flashcards for insert
to authenticated
with check (user_id = auth.uid());

create policy "flashcards_update_own"
on public.flashcards for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "flashcards_delete_own"
on public.flashcards for delete
to authenticated
using (user_id = auth.uid());
