import { createNoteAction } from "@/app/actions";
import { PageLayout } from "@/components/ui/page-layout";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewNotePage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold">New note</h1>
      <Card className="p-5">
        <form action={createNoteAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Title
            </label>
            <Input name="title" required placeholder="What are you learning?" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
              Content
            </label>
            <Textarea
              name="content"
              required
              rows={10}
              placeholder="Write your note..."
            />
          </div>
          <Button type="submit">Save note</Button>
        </form>
      </Card>
    </PageLayout>
  );
}
