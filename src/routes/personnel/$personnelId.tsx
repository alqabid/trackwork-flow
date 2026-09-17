import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { EmptyState, Panel, PanelHeader, StatStrip } from "@/components/ops/primitives";
import { CategoryChip, Initials, PriorityBadge, StatusBadge } from "@/components/ops/badges";
import { ActivityTimeline } from "@/components/ops/Timeline";
import {
  categoryById,
  completionRate,
  fmtDate,
  fmtDateTime,
  latestUpdate,
  personnel,
  statusCounts,
  useActivities,
} from "@/lib/opstrack/data";

export const Route = createFileRoute("/personnel/$personnelId")({
  head: () => ({
    meta: [
      { title: "Personnel Profile — OpsTrack" },
      { name: "description", content: "Profile, activity statistics and full update history for a member of support personnel." },
      { property: "og:title", content: "Personnel Profile — OpsTrack" },
      { property: "og:description", content: "Activity statistics and history for a support team member." },
    ],
  }),
  component: PersonnelProfile,
});

function PersonnelProfile() {
  const { personnelId } = Route.useParams();
  const person = personnel.find((p) => p.id === personnelId);
  const all = useActivities();

  if (!person) throw notFound();

  const mine = all.filter((a) => a.assigneeId === person.id);
  const counts = statusCounts(mine);
  const history = mine
    .flatMap((a) => a.updates.filter((u) => u.personnelId === person.id))
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  return (
    <AppShell title={person.name} subtitle={`${person.department} · ${person.role}`}>
      <Link to="/personnel" className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to personnel
      </Link>

      <div className="grid gap-3 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <Panel className="p-4">
            <div className="flex items-center gap-3">
              <Initials initials={person.initials} size="lg" />
              <div className="min-w-0">
                <div className="text-[14px] font-semibold">{person.name}</div>
                <div className="truncate text-[11px] text-muted-foreground">{person.email}</div>
              </div>
            </div>
            <dl className="mt-4 space-y-2.5 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">{person.role}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Department</dt>
                <dd className="font-medium">{person.department}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Account status</dt>
                <dd className="font-medium capitalize">{person.status}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Last login</dt>
                <dd className="tabular font-medium">{fmtDateTime(person.lastLogin)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Activity statistics" />
            <StatStrip
              items={[
                { label: "Assigned", value: counts.total },
                { label: "Done", value: counts.done, tone: "text-good" },
                { label: "Pending", value: counts.pending, tone: "text-warn" },
                { label: "Overdue", value: counts.overdue, tone: "text-alert" },
              ]}
            />
            <div className="border-t border-border px-4 py-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/8">
                <div className="grow-bar h-full rounded-full bg-good" style={{ width: `${completionRate(mine)}%` }} />
              </div>
              <p className="tabular mt-1.5 text-[11px] text-muted-foreground">
                {completionRate(mine)}% completion rate
              </p>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-3">
          <Panel className="overflow-hidden">
            <PanelHeader title="Recent activities" meta={`${mine.length} assigned in total`} />
            {mine.length === 0 ? (
              <EmptyState
                icon={<Initials initials={person.initials} size="md" />}
                title="No activities assigned"
                description="This member of personnel has no activities on the log yet."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left">
                  <thead>
                    <tr className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                      <th scope="col" className="px-4 py-2 font-medium">Activity</th>
                      <th scope="col" className="px-3 py-2 font-medium">Category</th>
                      <th scope="col" className="px-3 py-2 font-medium">Priority</th>
                      <th scope="col" className="px-3 py-2 font-medium">Date</th>
                      <th scope="col" className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px]">
                    {mine.slice(0, 8).map((a) => (
                      <tr key={a.id} className="border-t border-border hover:bg-primary/4">
                        <td className="px-4 py-2.5 font-medium">
                          <Link to="/activities/$activityId" params={{ activityId: a.id }} className="hover:text-primary">
                            {a.title}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5"><CategoryChip name={categoryById(a.categoryId)?.name ?? "—"} /></td>
                        <td className="px-3 py-2.5"><PriorityBadge priority={a.priority} /></td>
                        <td className="tabular px-3 py-2.5 text-muted-foreground">{fmtDate(a.activityDate)}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel className="p-4">
            <div className="text-[12px] font-semibold">Activity history</div>
            <p className="mt-0.5 mb-4 text-[11px] text-muted-foreground">
              Every update recorded by {person.name.split(" ")[0]}, newest first.
            </p>
            {history.length === 0 ? (
              <p className="text-[12px] text-muted-foreground">No updates recorded yet.</p>
            ) : (
              <ActivityTimeline updates={history} showDate />
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
