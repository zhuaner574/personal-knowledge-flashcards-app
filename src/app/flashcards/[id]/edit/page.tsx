import { notFound } from "next/navigation";
import { updateFlashcardAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { PageLayout } from "@/components/ui/page-layout";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function EditFlashcardPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ noteId?: string }>;
}) {
  const { id } = await params;
  const { noteId } = await searchParams;
  const { supabase, user } = await requireUser();

  const { data: card } = await supabase
    .from("flashcards")
    .select("id, note_id, question, answer")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!card) notFound();

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold">Edit flashcard</h1>
      <Card className="p-5">
        <form action={updateFlashcardAction} className="space-y-3">
          <input type="hidden" name="card_id" value={card.id} />
          <input type="hidden" name="note_id" value={noteId ?? card.note_id} />
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Question
            </label>
            <Input name="question" required defaultValue={card.question} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Answer
            </label>
            <Textarea name="answer" rows={6} required defaultValue={card.answer} />
          </div>
          <Button type="submit">Save flashcard</Button>
        </form>
      </Card>
    </PageLayout>
  );
}
