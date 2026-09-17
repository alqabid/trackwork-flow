import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { EmptyState, Panel, PanelHeader, StatStrip } from "@/components/ops/primitives";
import { CategoryChip, Initials, PriorityBadge, StatusBadge } from "@/components/ops/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categoryById,
  completionRate,
  fmtDateLong,
  fmtTime,
  latestUpdate,
  personnelById,
  shiftDate,
  statusCounts,
  today,
  useActivities,
} from "@/lib/opstrack/data";

export const Route = createFileRoute("/handover")({
  head: () => ({
    meta: [
      { title: "Daily Handover — OpsTrack" },
      {
        name: "description",
        content: "Shift handover view: every pending and overdue activity with its latest remark, owner and timestamp.",
      },
      { property: "og:title", content: "Daily Handover — OpsTrack" },
      { property: "og:description", content: "Everything the next shift needs to pick up, in one page." },
    ],
  }),
  component: HandoverPage,
});

function HandoverPage() {
  const [date, setDate] = useState(today());
  const all = useActivities();
  const dayList = all.filter((a) => a.activityDate === date);
  const counts = statusCounts(dayList);
  const pending = dayList.filter((a) => a.status !== "done");
  const completed = dayList.filter((a) => a.status === "done");

  return (
    <AppShell title="Daily Handover" subtitle={fmtDateLong(`${date}T00:00:00`)}>
      <Panel className="flex flex-wrap items-center gap-2 p-3">
        <Button variant="outline" size="sm" onClick={() => setDate(shiftDate(date, -1))}>
          <ChevronLeft className="size-3.5" /> Previous day
        </Button>
        <Button variant={date === today() ? "default" : "outline"} size="sm" onClick={() => setDate(today())}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={() => setDate(shiftDate(date, 1))}>
          Next day <ChevronRight className="size-3.5" />
        </Button>
        <Input
          type="date"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          aria-label="Handover date"
          className="ml-auto h-9 w-[160px] bg-card/70 text-[12px]"
        />
      </Panel>

      <Panel className="mt-3 overflow-hidden">
        <StatStrip
          items={[
            { label: "Activities", value: counts.total },
            { label: "Completed", value: counts.done, tone: "text-good" },
            { label: "Pending", value: counts.pending, tone: "text-warn" },
            { label: "Overdue", value: counts.overdue, tone: "text-alert" },
          ]}
        />
        <div className="border-t border-border px-4 py-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/8">
            <div className="grow-bar h-full rounded-full bg-primary" style={{ width: `${completionRate(dayList)}%` }} />
          </div>
          <p className="tabular mt-1.5 text-[11px] text-muted-foreground">
            {completionRate(dayList)}% of the day closed · {pending.length} item
            {pending.length === 1 ? "" : "s"} to hand over
          </p>
        </div>
      </Panel>

      <section className="mt-3">
        <Panel className="bg-alert/6 ring-alert/20">
          <PanelHeader
            title={<span className="text-alert">Pending Activities</span>}
            meta="Carry these into the next shift — review the latest remark before taking over"
            action={
              <span className="tabular rounded-md bg-alert/10 px-2 py-0.5 text-[11px] font-medium text-alert">
                {pending.length} open
              </span>
            }
          />
          {pending.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="size-5" />}
              title="Nothing to hand over"
              description="Every activity recorded for this day has been completed. The shift can close clean."
            />
          ) : (
            <ul className="divide-y divide-border">
              {pending.map((a) => {
                const last = latestUpdate(a);
                const person = personnelById(a.assigneeId);
                return (
                  <li key={a.id} className="p-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <Initials
                        initials={person?.initials ?? "··"}
                        tone={a.status === "overdue" ? "alert" : "warn"}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to="/activities/$activityId"
                            params={{ activityId: a.id }}
                            className="text-[13px] font-semibold hover:text-primary"
                          >
                            {a.title}
                          </Link>
                          <StatusBadge status={a.status} />
                          <PriorityBadge priority={a.priority} />
                          <CategoryChip name={categoryById(a.categoryId)?.name ?? "—"} />
                        </div>
                        <p className="tabular mt-1 text-[11px] text-muted-foreground">
                          {person?.name} · last updated {fmtTime(last.at)}
                        </p>
                        <p className="mt-2 rounded-md bg-card/70 px-3 py-2 text-[12px] text-pretty ring-1 ring-border">
                          <span className="eyebrow mr-1.5 align-middle">Latest remark</span>
                          {last.remark}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="shrink-0">
                        <Link to="/activities/$activityId" params={{ activityId: a.id }} hash="update">
                          Next action
                        </Link>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </section>

      <section className="mt-3">
        <Panel className="overflow-hidden">
          <PanelHeader title="Completed Today" meta={`${completed.length} activity records closed`} />
          {completed.length === 0 ? (
            <EmptyState
              icon={<AlertTriangle className="size-5" />}
              title="No completed activities"
              description="Nothing has been marked Done for this date yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    <th scope="col" className="px-4 py-2 font-medium">Activity</th>
                    <th scope="col" className="px-3 py-2 font-medium">Personnel</th>
                    <th scope="col" className="px-3 py-2 font-medium">Category</th>
                    <th scope="col" className="px-3 py-2 font-medium">Closing remark</th>
                    <th scope="col" className="px-3 py-2 font-medium">Closed</th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {completed.map((a) => {
                    const last = latestUpdate(a);
                    return (
                      <tr key={a.id} className="border-t border-border hover:bg-primary/4">
                        <td className="px-4 py-2.5 font-medium">
                          <Link to="/activities/$activityId" params={{ activityId: a.id }} className="hover:text-primary">
                            {a.title}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{personnelById(a.assigneeId)?.name}</td>
                        <td className="px-3 py-2.5"><CategoryChip name={categoryById(a.categoryId)?.name ?? "—"} /></td>
                        <td className="max-w-[280px] truncate px-3 py-2.5 text-muted-foreground">{last.remark}</td>
                        <td className="tabular px-3 py-2.5 text-muted-foreground">{fmtTime(last.at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </section>
    </AppShell>
  );
}
