import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { DAILY_REVIEW_CAP } from "@/lib/constants";
import { todayDateString } from "@/lib/date";
import { PageLayout } from "@/components/ui/page-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewSession } from "@/components/review-session";

export default async function ReviewPage() {
  const { supabase, user } = await requireUser();
  const today = todayDateString();

  const { data: cards } = await supabase
    .from("flashcards")
    .select("id, question, answer, interval_days, due_date, created_at")
    .eq("user_id", user.id)
    .lte("due_date", today)
    .or(`last_reviewed_at.is.null,last_reviewed_at.lt.${today}`)
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(DAILY_REVIEW_CAP);

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold">Review</h1>
      {!cards?.length ? (
        <Card className="p-5">
          <h2 className="font-medium">All caught up</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            No cards are due right now.
          </p>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/notes">Back to notes</Link>
          </Button>
        </Card>
      ) : (
        <ReviewSession cards={cards} />
      )}
    </PageLayout>
  );
}
