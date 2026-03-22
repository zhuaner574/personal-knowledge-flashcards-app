export const DEFAULT_THRESHOLD_PERCENT = 0.2;
export const DEFAULT_DAILY_REMINDER_TIME = "21:00";

export const EXPENSE_CATEGORIES = [
  "Food & Drinks",
  "Transport",
  "Daily Essentials",
  "Shopping",
  "Entertainment",
  "Study & Work",
  "Bills & Fees",
  "Subscriptions"
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const INCOME_CATEGORIES = [
  "Allowance",
  "Part-time/Intern",
  "Other"
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export type TransactionType = "income" | "expense";
export type SubscriptionPeriod = "weekly" | "monthly" | "yearly";

