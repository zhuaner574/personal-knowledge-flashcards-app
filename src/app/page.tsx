import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { DAILY_REVIEW_CAP } from "@/lib/constants";
import { SignOutButton } from "@/components/sign-out-button";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { todayDateString } from "@/lib/date";

export default async function TodayPage() {
  const { supabase, user } = await requireUser();
  const today = todayDateString();

  const [{ count: dueCount }, { data: recentNotes }, { count: noteCount }] =
    await Promise.all([
      supabase
        .from("flashcards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .lte("due_date", today)
        .or(`last_reviewed_at.is.null,last_reviewed_at.lt.${today}`),
      supabase
        .from("notes")
        .select("id, title, created_at, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
    ]);

  return (
    <PageLayout>
      <section className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Today</h1>
          <p className="text-[var(--text-secondary)]">
            Due today: {dueCount ?? 0} | Daily cap: {DAILY_REVIEW_CAP}
          </p>
        </div>
        <SignOutButton />
      </section>

      <section className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/review">Start review</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/notes">Open notes</Link>
        </Button>
      </section>

      {(noteCount ?? 0) === 0 ? (
        <Card className="p-5">
          <h2 className="font-medium">Create your first note</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Capture ideas, then turn them into flashcards.
          </p>
          <Button asChild className="mt-4">
            <Link href="/notes/new">New note</Link>
          </Button>
        </Card>
      ) : null}

      {(noteCount ?? 0) > 0 && (dueCount ?? 0) === 0 ? (
        <Card className="p-5">
          <h2 className="font-medium">All caught up</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            No due flashcards for now.
          </p>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/notes">Back to notes</Link>
          </Button>
        </Card>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-medium text-[var(--text-secondary)]">
          Recently added notes
        </h2>
        <div className="space-y-2">
          {recentNotes?.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="p-4 hover:bg-[#fafafa]">
                <div className="font-medium">{note.title}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {note.content.slice(0, 110)}
                </div>
                <div className="mt-1 text-xs text-[var(--text-muted)]">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </Card>
            </Link>
          ))}
          {!recentNotes?.length ? (
            <p className="text-sm text-[var(--text-muted)]">
              No notes yet. Start from a new note.
            </p>
          ) : null}
        </div>
      </section>
    </PageLayout>
  );
}

