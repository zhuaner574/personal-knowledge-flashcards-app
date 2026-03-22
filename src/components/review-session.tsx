"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { addDays, todayDateString } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";

type ReviewCard = {
  id: string;
  question: string;
  answer: string;
  interval_days: number;
};

export function ReviewSession({ cards }: { cards: ReviewCard[] }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const card = cards[index];
  const total = cards.length;
  const done = index >= total;

  useEffect(() => {
    textRef.current?.focus();
  }, [index]);

  async function rateCard(isCorrect: boolean) {
    if (!card) return;
    setSaving(true);
    const supabase = createClient();
    const today = todayDateString();

    const nextInterval = isCorrect ? Math.max(2, card.interval_days * 2) : 1;
    const nextDueDate = isCorrect ? addDays(today, nextInterval) : addDays(today, 1);

    await supabase
      .from("flashcards")
      .update({
        interval_days: nextInterval,
        due_date: nextDueDate,
        last_reviewed_at: today
      })
      .eq("id", card.id);

    setSaving(false);
    setIndex((v) => v + 1);
    setInput("");
    setConfirmed(false);
  }

  if (done) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Done for today 🎉</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Your daily review session is complete.
        </p>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href="/">Back to today</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/notes">Back to notes</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <p className="mb-2 text-sm text-[var(--text-secondary)]">
        Review {index + 1} / {total} (max 5)
      </p>
      <h2 className="mb-4 text-lg font-semibold">{card.question}</h2>

      <label className="mb-1 block text-sm text-[var(--text-secondary)]">
        Your answer
      </label>
      <Textarea
        ref={textRef}
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={confirmed || saving}
      />

      {!confirmed ? (
        <Button className="mt-4" onClick={() => setConfirmed(true)}>
          Confirm
        </Button>
      ) : (
        <>
          <div className="mt-4 rounded-md border border-[var(--border-subtle)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">Your Answer</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{input || "(empty)"}</p>
          </div>
          <div className="mt-3 rounded-md border border-[var(--border-subtle)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">Correct Answer</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{card.answer}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button disabled={saving} onClick={() => rateCard(true)}>
              Correct
            </Button>
            <Button variant="secondary" disabled={saving} onClick={() => rateCard(false)}>
              Incorrect
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
