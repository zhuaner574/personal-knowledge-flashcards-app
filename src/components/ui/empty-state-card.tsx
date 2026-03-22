import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type EmptyStateAction = {
  label: string;
  href: string;
};

type EmptyStateCardProps = {
  title: string;
  description: string;
  primaryAction: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

export function EmptyStateCard({
  title,
  description,
  primaryAction,
  secondaryAction
}: EmptyStateCardProps) {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-[14px] font-semibold text-[var(--sb-text-primary)]">
        {title}
      </h2>
      <p className="mt-2 text-[14px] font-normal text-[var(--sb-text-secondary)]">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </Button>
        {secondaryAction ? (
          <Button asChild variant="secondary">
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
