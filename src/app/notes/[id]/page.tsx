import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createFlashcardAction,
  deleteFlashcardAction,
  generateTemplatesAction,
  updateNoteAction
} from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { PageLayout } from "@/components/ui/page-layout";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/tag";

export default async function NoteDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  const { data: note } = await supabase
    .from("notes")
    .select("id, title, content, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!note) notFound();

  const { data: flashcards } = await supabase
    .from("flashcards")
    .select("id, question, answer, due_date, interval_days, created_at")
    .eq("note_id", note.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold">Note detail</h1>

      <Card className="p-5">
        <form action={updateNoteAction} className="space-y-3">
          <input type="hidden" name="note_id" value={note.id} />
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Title
            </label>
            <Input name="title" required defaultValue={note.title} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Content
            </label>
            <Textarea name="content" rows={10} required defaultValue={note.content} />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">Related flashcards</h2>
          <form action={generateTemplatesAction}>
            <input type="hidden" name="note_id" value={note.id} />
            <Button type="submit" variant="secondary">
              Generate 3 templates
            </Button>
          </form>
        </div>

        {!flashcards?.length ? (
          <p className="text-sm text-[var(--text-muted)]">
            No flashcards yet. Add one below.
          </p>
        ) : (
          <div className="space-y-2">
            {flashcards.map((card) => (
              <Card key={card.id} className="p-3">
                <div className="font-medium">{card.question}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill>Due: {card.due_date}</Pill>
                  <Pill>Interval: {card.interval_days}d</Pill>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="secondary">
                    <Link href={`/flashcards/${card.id}/edit?noteId=${note.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <form action={deleteFlashcardAction}>
                    <input type="hidden" name="card_id" value={card.id} />
                    <input type="hidden" name="note_id" value={note.id} />
                    <Button type="submit" variant="danger">
                      Delete
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 font-medium">Add flashcard</h2>
        <form action={createFlashcardAction} className="space-y-3">
          <input type="hidden" name="note_id" value={note.id} />
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Question
            </label>
            <Input name="question" required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Answer
            </label>
            <Textarea name="answer" rows={4} required />
          </div>
          <Button type="submit">Add flashcard</Button>
        </form>
      </Card>
    </PageLayout>
  );
}
