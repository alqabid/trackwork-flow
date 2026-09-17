import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Filter, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { EmptyState, Panel, PanelHeader } from "@/components/ops/primitives";
import { CategoryChip, PriorityBadge, StatusBadge } from "@/components/ops/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  categories,
  categoryById,
  fmtDate,
  fmtTime,
  latestUpdate,
  personnel,
  personnelById,
  useActivities,
} from "@/lib/opstrack/data";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "Activities — OpsTrack" },
      {
        name: "description",
        content: "Search, filter and manage every recorded applications support activity and its status history.",
      },
      { property: "og:title", content: "Activities — OpsTrack" },
      { property: "og:description", content: "Search and filter all recorded support activities." },
    ],
  }),
  component: ActivitiesPage,
});

const ALL = "all";

function ActivitiesPage() {
  const all = useActivities();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [assignee, setAssignee] = useState(ALL);
  const [date, setDate] = useState("");

  const rows = useMemo(
    () =>
      all.filter(
        (a) =>
          (!q || a.title.toLowerCase().includes(q.toLowerCase()) || a.reference.toLowerCase().includes(q.toLowerCase())) &&
          (status === ALL || a.status === status) &&
          (priority === ALL || a.priority === priority) &&
          (category === ALL || a.categoryId === category) &&
          (assignee === ALL || a.assigneeId === assignee) &&
          (!date || a.activityDate === date),
      ),
    [all, q, status, priority, category, assignee, date],
  );

  const reset = () => {
    setQ("");
    setStatus(ALL);
    setPriority(ALL);
    setCategory(ALL);
    setAssignee(ALL);
    setDate("");
  };

  const filtersActive = q || status !== ALL || priority !== ALL || category !== ALL || assignee !== ALL || date;

  return (
    <AppShell title="Activities" subtitle={`${rows.length} of ${all.length} activities shown`}>
      <Panel className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[180px] flex-1">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <span className="sr-only">Search activities</span>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title or reference…"
              className="h-9 bg-card/70 pl-8 text-[12px]"
            />
          </label>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[128px] bg-card/70 text-[12px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-9 w-[128px] bg-card/70 text-[12px]" aria-label="Filter by priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-[140px] bg-card/70 text-[12px]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger className="h-9 w-[150px] bg-card/70 text-[12px]" aria-label="Filter by personnel">
              <SelectValue placeholder="Personnel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All personnel</SelectItem>
              {personnel.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Filter by activity date"
            className="h-9 w-[150px] bg-card/70 text-[12px]"
          />

          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-9 text-[12px]">
              Clear
            </Button>
          )}

          <Button asChild size="sm" className="ml-auto h-9">
            <Link to="/activities/new">
              <Plus className="size-3.5" /> Create activity
            </Link>
          </Button>
        </div>
      </Panel>

      <Panel className="mt-3 overflow-hidden">
        <PanelHeader title="All Activities" meta={`${rows.length} record${rows.length === 1 ? "" : "s"}`} />
        {rows.length === 0 ? (
          <EmptyState
            icon={<Filter className="size-5" />}
            title="No activities match these filters"
            description="Try widening the date range or clearing a filter to see more of the activity log."
            action={
              <Button size="sm" variant="outline" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-2 font-medium">Activity</th>
                  <th scope="col" className="px-3 py-2 font-medium">Category</th>
                  <th scope="col" className="px-3 py-2 font-medium">Priority</th>
                  <th scope="col" className="px-3 py-2 font-medium">Assigned To</th>
                  <th scope="col" className="px-3 py-2 font-medium">Activity Date</th>
                  <th scope="col" className="px-3 py-2 font-medium">Status</th>
                  <th scope="col" className="px-3 py-2 font-medium">Last Updated</th>
                  <th scope="col" className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {rows.map((a) => (
                  <tr key={a.id} className="border-t border-border transition-colors hover:bg-primary/4">
                    <td className="px-4 py-2.5">
                      <Link
                        to="/activities/$activityId"
                        params={{ activityId: a.id }}
                        className="font-medium hover:text-primary"
                      >
                        {a.title}
                      </Link>
                      <div className="tabular text-[10px] text-muted-foreground">{a.reference}</div>
                    </td>
                    <td className="px-3 py-2.5"><CategoryChip name={categoryById(a.categoryId)?.name ?? "—"} /></td>
                    <td className="px-3 py-2.5"><PriorityBadge priority={a.priority} /></td>
                    <td className="px-3 py-2.5 text-muted-foreground">{personnelById(a.assigneeId)?.name}</td>
                    <td className="tabular px-3 py-2.5 text-muted-foreground">{fmtDate(a.activityDate)}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={a.status} /></td>
                    <td className="tabular px-3 py-2.5 text-muted-foreground">{fmtTime(latestUpdate(a).at)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-accent">
                          Actions
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/activities/$activityId" params={{ activityId: a.id }}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/activities/$activityId" params={{ activityId: a.id }} hash="update">
                              Update status
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {rows.length > 0 && (
        <p className="tabular mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <ClipboardList className="size-3.5" aria-hidden /> Showing {rows.length} of {all.length} activities
        </p>
      )}
    </AppShell>
  );
}
