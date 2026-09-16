import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListChecks,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { EmptyState, KpiCard, Panel, PanelHeader } from "@/components/ops/primitives";
import { CategoryChip, Initials, PriorityBadge, StatusBadge } from "@/components/ops/badges";
import { Button } from "@/components/ui/button";
import {
  categories,
  categoryById,
  completionRate,
  fmtTime,
  latestUpdate,
  personnelById,
  statusCounts,
  today,
  useActivities,
} from "@/lib/opstrack/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — OpsTrack" },
      {
        name: "description",
        content:
          "Today's support activities, completion progress, pending handover items and the live update timeline.",
      },
      { property: "og:title", content: "Operations Dashboard — OpsTrack" },
      {
        property: "og:description",
        content: "Live view of today's applications support activities and shift handover.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const all = useActivities();
  const todays = all.filter((a) => a.activityDate === today());
  const counts = statusCounts(todays);
  const rate = completionRate(todays);

  const handover = todays
    .filter((a) => a.status !== "done")
    .sort((a, b) => (a.status === "overdue" ? -1 : b.status === "overdue" ? 1 : 0));

  const timeline = all
    .flatMap((a) => a.updates.map((u) => ({ ...u, activity: a })))
    .filter((u) => u.at.slice(0, 10) === today())
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 6);

  const byCategory = categories
    .map((c) => ({ name: c.name, count: all.filter((a) => a.categoryId === c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxCat = Math.max(...byCategory.map((c) => c.count), 1);

  return (
    <AppShell title="Operations Dashboard" subtitle={`Shift 08:00–17:00 · ${todays.length} activities logged today`}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Today's Activities"
          value={counts.total}
          context="Logged for the current shift"
          icon={<ListChecks className="size-3.5" />}
          delay={0}
        />
        <KpiCard
          label="Completed"
          value={counts.done}
          context={`${rate}% of the day closed`}
          icon={<CheckCircle2 className="size-3.5" />}
          tone="good"
          delay={60}
        />
        <KpiCard
          label="Pending"
          value={counts.pending}
          context="Awaiting a status update"
          icon={<Clock3 className="size-3.5" />}
          tone="warn"
          delay={120}
        />
        <KpiCard
          label="Overdue"
          value={counts.overdue}
          context="Past due — needs handover"
          icon={<AlertTriangle className="size-3.5" />}
          tone="alert"
          delay={180}
        />
      </div>

      <Panel className="mt-3 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="shrink-0">
          <div className="text-[12px] font-medium">Today's activity progress</div>
          <div className="tabular text-[22px] leading-none font-semibold text-primary">{rate}%</div>
        </div>
        <div className="flex-1">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/8">
            <div className="grow-bar h-full rounded-full bg-primary" style={{ width: `${rate}%` }} />
          </div>
          <p className="tabular mt-1.5 text-[11px] text-muted-foreground">
            {counts.done} of {counts.total} completed · {counts.pending} pending · {counts.overdue} overdue
          </p>
        </div>
      </Panel>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Today's Activities"
            action={
              <Button asChild size="sm">
                <Link to="/activities/new">
                  <Plus className="size-3.5" /> New activity
                </Link>
              </Button>
            }
          />
          {todays.length === 0 ? (
            <EmptyState
              icon={<ListChecks className="size-5" />}
              title="No activities recorded today"
              description="Create the first activity of the shift to start the day's log."
              action={
                <Button asChild size="sm">
                  <Link to="/activities/new">Create activity</Link>
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    <th scope="col" className="px-4 py-2 font-medium">Activity</th>
                    <th scope="col" className="px-3 py-2 font-medium">Assigned To</th>
                    <th scope="col" className="px-3 py-2 font-medium">Category</th>
                    <th scope="col" className="px-3 py-2 font-medium">Priority</th>
                    <th scope="col" className="px-3 py-2 font-medium">Status</th>
                    <th scope="col" className="px-3 py-2 font-medium">Updated</th>
                    <th scope="col" className="px-3 py-2 font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {todays.map((a) => {
                    const person = personnelById(a.assigneeId);
                    return (
                      <tr key={a.id} className="border-t border-border transition-colors hover:bg-primary/4">
                        <td className="px-4 py-2.5 font-medium">
                          <Link to="/activities/$activityId" params={{ activityId: a.id }} className="hover:text-primary">
                            {a.title}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{person?.name}</td>
                        <td className="px-3 py-2.5">
                          <CategoryChip name={categoryById(a.categoryId)?.name ?? "—"} />
                        </td>
                        <td className="px-3 py-2.5"><PriorityBadge priority={a.priority} /></td>
                        <td className="px-3 py-2.5"><StatusBadge status={a.status} /></td>
                        <td className="tabular px-3 py-2.5 text-muted-foreground">{fmtTime(latestUpdate(a).at)}</td>
                        <td className="px-3 py-2.5 text-right">
                          <Link
                            to="/activities/$activityId"
                            params={{ activityId: a.id }}
                            className="text-[11px] font-medium text-primary hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="flex flex-col gap-3">
          <Panel className="bg-alert/8 p-4 ring-alert/20">
            <div className="text-[12px] font-semibold text-alert">Pending Handover</div>
            <p className="mb-2 text-[11px] text-muted-foreground">
              {handover.length} item{handover.length === 1 ? "" : "s"} must carry to the next shift
            </p>
            <div className="space-y-2">
              {handover.slice(0, 3).map((a) => {
                const last = latestUpdate(a);
                return (
                  <div key={a.id} className="rounded-lg bg-card/60 p-3 ring-1 ring-border">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={a.priority} />
                      <StatusBadge status={a.status} dot={false} className="scale-90" />
                      <span className="tabular ml-auto text-[11px] text-muted-foreground">{fmtTime(last.at)}</span>
                    </div>
                    <div className="mt-1 text-[12px] font-medium">{a.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{personnelById(a.assigneeId)?.name}</div>
                    <p className="mt-1 text-[11px] text-pretty text-muted-foreground">{last.remark}</p>
                    <Button asChild size="sm" variant="outline" className="mt-2 h-7 w-full text-[11px]">
                      <Link to="/activities/$activityId" params={{ activityId: a.id }}>Update status</Link>
                    </Button>
                  </div>
                );
              })}
              {handover.length === 0 && (
                <p className="rounded-lg bg-card/60 p-3 text-[12px] text-muted-foreground ring-1 ring-border">
                  Nothing outstanding — the shift can be handed over clean.
                </p>
              )}
            </div>
            <Link to="/handover" className="mt-3 block text-[11px] font-medium text-alert hover:underline">
              Open daily handover →
            </Link>
          </Panel>

          <Panel className="flex-1 p-4">
            <div className="mb-3 text-[12px] font-semibold">Recent Activity Timeline</div>
            <div className="space-y-3">
              {timeline.map((u, i) => {
                const person = personnelById(u.personnelId);
                const tone = u.status === "done" ? "good" : u.status === "pending" ? "warn" : "brand";
                return (
                  <div key={u.id} className="fade-up flex gap-2.5" style={{ animationDelay: `${i * 70}ms` }}>
                    <Initials initials={person?.initials ?? "··"} tone={tone as never} size="md" />
                    <div className="leading-tight">
                      <span className="tabular text-[11px] text-muted-foreground">{fmtTime(u.at)}</span>
                      <p className="text-[12px] text-pretty">
                        <span className="font-medium">{person?.name}</span>{" "}
                        {u.status === "created" ? "started" : `marked`}{" "}
                        <span className="font-medium">“{u.activity.title}”</span>
                        {u.status !== "created" && <> as {u.status === "done" ? "Done" : "Pending"}</>}.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel className="p-4">
          <div className="text-[12px] font-semibold">Completed vs Pending</div>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-foreground/8">
            <div className="grow-bar h-full bg-good" style={{ width: `${rate}%` }} />
            <div className="h-full bg-warn/70" style={{ width: `${100 - rate}%` }} />
          </div>
          <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-good" /> Completed <span className="tabular">{counts.done}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-warn/70" /> Open{" "}
              <span className="tabular">{counts.pending + counts.overdue}</span>
            </span>
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="text-[12px] font-semibold">Activities by Category</div>
          <ul className="mt-3 space-y-2">
            {byCategory.map((c) => (
              <li key={c.name} className="flex items-center gap-3 text-[11px]">
                <span className="w-20 shrink-0 text-muted-foreground">{c.name}</span>
                <span className="h-2 flex-1 rounded-full bg-foreground/8">
                  <span
                    className="grow-bar block h-full rounded-full bg-primary/70"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </span>
                <span className="tabular w-5 text-right">{c.count}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
