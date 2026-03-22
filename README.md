## Live Demo
- URL: https://personal-knowledge-flashcards-app-l.vercel.app/
- Demo login: 2791165968@qq.com / 13579qetuo
- Try path: Notes → New note → Generate 3 templates → Review (daily cap 5)

## Core logic
Active Recall (type answer first) + simple spaced repetition (Correct doubles interval, Incorrect resets to 1 day).

# Personal Knowledge Flashcards

Notion-style MVP web app: **Notes -> Flashcards -> Daily Review** with active recall.

Built with:
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + RLS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and fill values from Supabase project settings:

```bash
cp .env.local.example .env.local
```

Required keys:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run SQL migration in Supabase SQL Editor:
- File: `supabase/migrations/202603220001_personal_knowledge_flashcards.sql`

4. Run dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

Tables:
- `notes`
  - `id uuid pk default gen_random_uuid()`
  - `user_id uuid not null references auth.users(id)`
  - `title text not null`
  - `content text not null`
  - `created_at timestamptz default now()`
- `flashcards`
  - `id uuid pk default gen_random_uuid()`
  - `user_id uuid not null references auth.users(id)`
  - `note_id uuid not null references public.notes(id) on delete cascade`
  - `question text not null`
  - `answer text not null`
  - `due_date date not null default current_date`
  - `interval_days int not null default 1`
  - `last_reviewed_at date null`
  - `created_at timestamptz default now()`

RLS:
- Enabled on both tables.
- Authenticated users can only select/insert/update/delete rows where `user_id = auth.uid()`.

## Routes

- `/` (Today)
- `/today` (alias -> `/`)
- `/notes`
- `/notes/new`
- `/notes/[id]`
- `/flashcards/[id]/edit`
- `/review`
- `/login`
- `/signup`

## Manual End-to-End Test

1. Go to `/signup`, create account with email/password.
2. Create a note at `/notes/new`.
3. On note detail page:
   - Add a flashcard manually.
   - Click **Generate 3 templates**.
4. Open `/today`:
   - Verify due count.
   - Click **Start review**.
5. In `/review`:
   - Confirm answer, then rate **Correct** or **Incorrect**.
   - Verify progression is one card at a time.
   - Confirm session is capped at 5 cards per day.
6. Verify scheduling:
   - Incorrect -> `interval_days = 1`, `due_date = tomorrow`, `last_reviewed_at = today`
   - Correct -> `interval_days = max(2, interval_days * 2)`, `due_date = today + interval_days`, `last_reviewed_at = today`
7. Confirm reviewed cards do not reappear again on same day.

## Notes

- No LLM usage in this MVP.
- UI is intentionally minimal and demo-friendly.
