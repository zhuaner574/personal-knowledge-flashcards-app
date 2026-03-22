import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function NotesPage() {
  const { supabase, user } = await requireUser();
  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <PageLayout>
      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <Button asChild>
          <Link href="/notes/new">New note</Link>
        </Button>
      </section>

      {!notes?.length ? (
        <Card className="p-5">
          <h2 className="font-medium">No notes yet</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Add your first note and turn it into flashcards.
          </p>
          <Button asChild className="mt-4">
            <Link href="/notes/new">Create note</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="p-4 hover:bg-[#fafafa]">
                <div className="font-medium">{note.title}</div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {note.content.slice(0, 120)}
                </div>
                <div className="mt-2 text-xs text-[var(--text-muted)]">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
