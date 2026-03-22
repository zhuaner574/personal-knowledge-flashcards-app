import type {
  SubscriptionPeriod,
  TransactionType
} from "@/lib/domain/constants";

export type BudgetRow = {
  id: string;
  user_id: string;
  month: string;
  monthly_budget_amount: number;
  threshold_percent: number;
  created_at: string;
};

export type TransactionRow = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string | null;
  date: string; // YYYY-MM-DD
  note: string | null;
  created_at: string;
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  period: SubscriptionPeriod;
  next_charge_date: string; // YYYY-MM-DD
  auto_renew: boolean;
  created_at: string;
};

export type ItemPlanRow = {
  id: string;
  user_id: string;
  name: string;
  cost: number;
  lifespan_days: number;
  start_date: string; // YYYY-MM-DD
  category: string;
  is_active: boolean;
  created_at: string;
};

