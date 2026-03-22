import type { ExpenseCategory } from "./constants";

export type SummaryOutput = {
  one_line_summary: string;
  tips: [string, string, string];
};

export function buildSummary(input: {
  // chosen period inputs (week or month)
  spend_total: number;
  top_category: ExpenseCategory | null;
  top_share_pct: number; // 0..100
  second_category: ExpenseCategory | null;
  second_share_pct: number; // 0..100

  // monthly context inputs
  remaining_ratio: number | null; // 0..1, null if no budget
  spent_pct_of_budget: number | null; // 0..100
  daily_cap: number | null;

  monthly_budget_amount: number | null;
  subs_monthly_est: number;
  daily_burn: number;
}) : SummaryOutput {
  const topCat = input.top_category ?? "Food & Drinks";
  const secondCat = input.second_category ?? "Transport";

  const remainingRatio = input.remaining_ratio;
  const spentPct = input.spent_pct_of_budget;

  const monthlyBudgetAmount = input.monthly_budget_amount;
  const subsPct =
    monthlyBudgetAmount && monthlyBudgetAmount > 0
      ? input.subs_monthly_est / monthlyBudgetAmount
      : null;

  // One-line summary (priority order)
  let one = "";
  if (remainingRatio !== null && remainingRatio < 0.2 && spentPct !== null) {
    one = `You’ve used ${Math.round(
      spentPct
    )}% of your monthly budget. Spending is concentrated in ${topCat} (${Math.round(
      input.top_share_pct
    )}%) — slow down to avoid running out.`;
  } else if (input.top_share_pct >= 40) {
    one = `This period, ${topCat} dominates your spending (${Math.round(
      input.top_share_pct
    )}%). Small cuts here will have the biggest impact.`;
  } else {
    one = `Your spending is fairly balanced. Biggest categories are ${topCat} (${Math.round(
      input.top_share_pct
    )}%) and ${secondCat} (${Math.round(input.second_share_pct)}%).`;
  }

  // Append at most 1 add-on
  if (subsPct !== null && subsPct >= 0.1) {
    one += ` Subscriptions take about ${Math.round(subsPct * 100)}% of your monthly budget.`;
  } else if (input.daily_burn >= 1.0) {
    one += ` Hidden daily essentials burn rate is ~£${input.daily_burn.toFixed(
      2
    )}/day.`;
  }

  // Tips selection (top 3 by triggered priority)
  const tips: string[] = [];

  if (remainingRatio !== null && remainingRatio < 0.2 && input.daily_cap !== null) {
    tips.push(`Set a daily cap of £${input.daily_cap.toFixed(2)} for the rest of the month.`);
  }

  if (subsPct !== null && subsPct >= 0.1) {
    const saveExample = Math.round(input.subs_monthly_est * 0.2);
    tips.push(
      `Review subscriptions this week — cancelling just one can free up £${saveExample}/month.`
    );
  }

  if (topCat === "Food & Drinks" && input.top_share_pct >= 35) {
    const foodSave = Math.round(input.spend_total * 0.08);
    tips.push(`Food is your biggest lever. Cut 2 takeouts this week to save ~£${foodSave}.`);
  }

  if (topCat === "Transport" && input.top_share_pct >= 25) {
    tips.push(
      "Transport is high. Consider weekly pass / avoid peak rides to reduce costs."
    );
  }

  if (input.daily_burn >= 1.0) {
    tips.push(
      `Your essentials burn rate is ~£${input.daily_burn.toFixed(
        2
      )}/day — bulk-buy or extend replacement cycles where possible.`
    );
  }

  // Fallback tip always available
  tips.push("Try logging right after purchases — consistency beats perfection.");

  return {
    one_line_summary: one,
    tips: [tips[0]!, tips[1]!, tips[2]!]
  };
}

