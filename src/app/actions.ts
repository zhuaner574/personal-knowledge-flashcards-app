"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

function getRequiredField(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function createNoteAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const title = getRequiredField(formData, "title");
  const content = getRequiredField(formData, "content");

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create note");
  }

  revalidatePath("/notes");
  redirect(`/notes/${data.id}`);
}

export async function updateNoteAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const noteId = getRequiredField(formData, "note_id");
  const title = getRequiredField(formData, "title");
  const content = getRequiredField(formData, "content");

  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", noteId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/notes");
}

export async function createFlashcardAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const noteId = getRequiredField(formData, "note_id");
  const question = getRequiredField(formData, "question");
  const answer = getRequiredField(formData, "answer");

  const { error } = await supabase.from("flashcards").insert({
    user_id: user.id,
    note_id: noteId,
    question,
    answer
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/today");
  revalidatePath("/review");
}

export async function generateTemplatesAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const noteId = getRequiredField(formData, "note_id");

  const templates = [
    "What is the core idea?",
    "What is the key mechanism / why does it work?",
    "Give one concrete example."
  ];

  const payload = templates.map((question) => ({
    user_id: user.id,
    note_id: noteId,
    question,
    answer: "(fill in)"
  }));

  const { error } = await supabase.from("flashcards").insert(payload);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/today");
}

export async function deleteFlashcardAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const cardId = getRequiredField(formData, "card_id");
  const noteId = getRequiredField(formData, "note_id");

  const { error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/review");
}

export async function updateFlashcardAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const cardId = getRequiredField(formData, "card_id");
  const noteId = getRequiredField(formData, "note_id");
  const question = getRequiredField(formData, "question");
  const answer = getRequiredField(formData, "answer");

  const { error } = await supabase
    .from("flashcards")
    .update({ question, answer })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/notes/${noteId}`);
  redirect(`/notes/${noteId}`);
}
