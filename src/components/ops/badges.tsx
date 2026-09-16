import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ActivityStatus, Priority } from "@/lib/opstrack/types";

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        done: "bg-good/10 text-good",
        pending: "bg-warn/12 text-warn",
        overdue: "bg-alert/10 text-alert",
      },
    },
    defaultVariants: { tone: "pending" },
  },
);

const labels: Record<ActivityStatus, string> = {
  done: "Done",
  pending: "Pending",
  overdue: "Overdue",
};

export function StatusBadge({
  status,
  dot = true,
  className,
}: { status: ActivityStatus; dot?: boolean; className?: string } & VariantProps<typeof statusVariants>) {
  return (
    <span className={cn(statusVariants({ tone: status }), className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {labels[status]}
    </span>
  );
}

const priorityTone: Record<Priority, string> = {
  low: "text-muted-foreground",
  medium: "text-info",
  high: "text-warn",
  critical: "text-alert",
};

const priorityLabel: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span className={cn("text-[11px] font-medium whitespace-nowrap", priorityTone[priority], className)}>
      {priority === "critical" || priority === "high" ? "▲ " : ""}
      {priorityLabel[priority]}
    </span>
  );
}

export function CategoryChip({ name }: { name: string }) {
  return (
    <span className="inline-flex rounded-md bg-foreground/5 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
      {name}
    </span>
  );
}

export function Initials({
  initials,
  tone = "brand",
  size = "md",
}: {
  initials: string;
  tone?: "brand" | "good" | "warn" | "alert" | "muted";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-md font-semibold",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-7 text-[10px]",
        size === "lg" && "size-11 text-[13px]",
        tone === "brand" && "bg-primary/90 text-primary-foreground",
        tone === "good" && "bg-good/85 text-good-foreground",
        tone === "warn" && "bg-warn/85 text-warn-foreground",
        tone === "alert" && "bg-alert/85 text-alert-foreground",
        tone === "muted" && "bg-foreground/10 text-foreground",
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
