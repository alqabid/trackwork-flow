import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Panel({
  children,
  className,
  solid = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  solid?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className={cn(solid ? "panel-solid" : "panel", className)}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  meta,
  action,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3", className)}>
      <div className="min-w-0">
        <h2 className="text-[13px] font-semibold">{title}</h2>
        {meta && <p className="mt-0.5 text-[11px] text-muted-foreground">{meta}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  context,
  icon,
  tone = "neutral",
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  context: string;
  icon: ReactNode;
  tone?: "neutral" | "good" | "warn" | "alert";
  delay?: number;
}) {
  return (
    <div
      className={cn(
        "fade-up p-4",
        tone === "alert" ? "panel bg-alert/8 ring-alert/20" : "panel",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("eyebrow", tone === "alert" && "text-alert")}>{label}</span>
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-md",
            tone === "neutral" && "bg-foreground/5 text-muted-foreground",
            tone === "good" && "bg-good/10 text-good",
            tone === "warn" && "bg-warn/12 text-warn",
            tone === "alert" && "bg-alert/12 text-alert",
          )}
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <div
        className={cn(
          "tabular mt-2 text-[28px] leading-none font-semibold",
          tone === "good" && "text-good",
          tone === "warn" && "text-warn",
          tone === "alert" && "text-alert",
        )}
      >
        {value}
      </div>
      <p className={cn("mt-2 text-[11px]", tone === "alert" ? "text-alert/80" : "text-muted-foreground")}>{context}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-foreground/5 text-muted-foreground" aria-hidden>
        {icon}
      </span>
      <p className="mt-3 text-[13px] font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-[12px] text-pretty text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className={cn("h-3.5", c === 0 ? "flex-1" : "w-16")} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatStrip({ items }: { items: { label: string; value: ReactNode; tone?: string }[] }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="px-4 py-3">
          <div className="eyebrow">{i.label}</div>
          <div className={cn("tabular mt-1 text-[20px] leading-none font-semibold", i.tone)}>{i.value}</div>
        </div>
      ))}
    </div>
  );
}
