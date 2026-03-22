import { createClient } from "@/lib/supabase/server";
import type {
  BudgetRow,
  ItemPlanRow,
  SubscriptionRow,
  TransactionRow
} from "./types";
import { formatYYYYMM } from "@/lib/domain/dates";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not authenticated");
  return { supabase, user: data.user };
}

export async function getBudgetForMonth(month: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("month", month)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as BudgetRow | null;
}

export async function upsertBudgetForMonth(input: {
  month: string;
  monthly_budget_amount: number;
}) {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("budgets")
    .upsert(
      {
        user_id: user.id,
        month: input.month,
        monthly_budget_amount: input.monthly_budget_amount
      },
      { onConflict: "user_id,month" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data as BudgetRow;
}

export async function listTransactionsInRange(input: {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", input.startDate)
    .lte("date", input.endDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as TransactionRow[];
}

export async function createTransaction(input: {
  type: "income" | "expense";
  amount: number;
  category?: string | null;
  date: string; // YYYY-MM-DD
  note?: string | null;
}) {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      type: input.type,
      amount: input.amount,
      category: input.category ?? null,
      date: input.date,
      note: input.note ?? null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as TransactionRow;
}

export async function listSubscriptions() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("next_charge_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SubscriptionRow[];
}

export async function getSubscriptionById(id: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as SubscriptionRow;
}

export async function upsertSubscription(input: {
  id?: string;
  name: string;
  amount: number;
  period: "weekly" | "monthly" | "yearly";
  next_charge_date: string; // YYYY-MM-DD
  auto_renew: boolean;
}) {
  const { supabase, user } = await requireUser();
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    user_id: user.id,
    name: input.name,
    amount: input.amount,
    period: input.period,
    next_charge_date: input.next_charge_date,
    auto_renew: input.auto_renew
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as SubscriptionRow;
}

export async function deleteSubscription(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw error;
}

export async function listItemPlans() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("item_plans")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ItemPlanRow[];
}

export async function getItemPlanById(id: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("item_plans")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ItemPlanRow;
}

export async function upsertItemPlan(input: {
  id?: string;
  name: string;
  cost: number;
  lifespan_days: number;
  start_date: string;
  category: string;
  is_active: boolean;
}) {
  const { supabase, user } = await requireUser();
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    user_id: user.id,
    name: input.name,
    cost: input.cost,
    lifespan_days: input.lifespan_days,
    start_date: input.start_date,
    category: input.category,
    is_active: input.is_active
  };

  const { data, error } = await supabase
    .from("item_plans")
    .upsert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as ItemPlanRow;
}

export async function deleteItemPlan(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("item_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function wasNotificationLoggedForLocalDate(input: {
  kind: "daily_reminder" | "budget_low" | "subscription_due";
  localDate: string; // YYYY-MM-DD
}) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("notifications_log")
    .select("id")
    .eq("kind", input.kind)
    .eq("meta->>local_date", input.localDate)
    .limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function logNotificationForLocalDate(input: {
  kind: "daily_reminder" | "budget_low" | "subscription_due";
  localDate: string; // YYYY-MM-DD
  scheduledAtIso?: string;
  meta?: Record<string, unknown>;
}) {
  const { supabase, user } = await requireUser();
  const scheduled_at = input.scheduledAtIso ?? new Date().toISOString();
  const meta = { ...(input.meta ?? {}), local_date: input.localDate };

  const { error } = await supabase.from("notifications_log").insert({
    user_id: user.id,
    kind: input.kind,
    scheduled_at,
    meta
  });
  if (error) throw error;
}

export function currentMonthKey(now = new Date()) {
  return formatYYYYMM(now);
}

