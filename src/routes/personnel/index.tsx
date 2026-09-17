import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/ops/AppShell";
import { Panel, PanelHeader } from "@/components/ops/primitives";
import { Initials } from "@/components/ops/badges";
import { fmtDateTime, latestUpdate, personnel, useActivities } from "@/lib/opstrack/data";

export const Route = createFileRoute("/personnel/")({
  head: () => ({
    meta: [
      { title: "Personnel — OpsTrack" },
      { name: "description", content: "Support personnel, their workload, completion counts and most recent activity." },
      { property: "og:title", content: "Personnel — OpsTrack" },
      { property: "og:description", content: "Support personnel workload and activity statistics." },
    ],
  }),
  component: PersonnelPage,
});

function PersonnelPage() {
  const all = useActivities();

  return (
    <AppShell title="Personnel" subtitle={`${personnel.length} support personnel on the roster`}>
      <Panel className="overflow-hidden">
        <PanelHeader title="Support Personnel" meta="Workload across all recorded activities" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                <th scope="col" className="px-4 py-2 font-medium">Name</th>
                <th scope="col" className="px-3 py-2 font-medium">Role</th>
                <th scope="col" className="px-3 py-2 font-medium">Department</th>
                <th scope="col" className="px-3 py-2 font-medium">Activities</th>
                <th scope="col" className="px-3 py-2 font-medium">Completed</th>
                <th scope="col" className="px-3 py-2 font-medium">Pending</th>
                <th scope="col" className="px-3 py-2 font-medium">Last Activity</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {personnel.map((p) => {
                const mine = all.filter((a) => a.assigneeId === p.id);
                const last = mine
                  .map((a) => latestUpdate(a).at)
                  .sort()
                  .pop();
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-primary/4">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Initials initials={p.initials} size="md" />
                        <div className="leading-tight">
                          <Link
                            to="/personnel/$personnelId"
                            params={{ personnelId: p.id }}
                            className="font-medium hover:text-primary"
                          >
                            {p.name}
                          </Link>
                          <div className="text-[10px] text-muted-foreground">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground capitalize">{p.role}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.department}</td>
                    <td className="tabular px-3 py-2.5">{mine.length}</td>
                    <td className="tabular px-3 py-2.5 text-good">{mine.filter((a) => a.status === "done").length}</td>
                    <td className="tabular px-3 py-2.5 text-warn">{mine.filter((a) => a.status !== "done").length}</td>
                    <td className="tabular px-3 py-2.5 text-muted-foreground">{last ? fmtDateTime(last) : "—"}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        to="/personnel/$personnelId"
                        params={{ personnelId: p.id }}
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        View profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
