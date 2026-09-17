import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, FileBarChart, Printer, Search } from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { EmptyState, Panel, PanelHeader } from "@/components/ops/primitives";
import { CategoryChip, StatusBadge } from "@/components/ops/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  categories,
  categoryById,
  completionRate,
  fmtDate,
  fmtTime,
  latestUpdate,
  personnel,
  personnelById,
  shiftDate,
  statusCounts,
  today,
  useActivities,
} from "@/lib/opstrack/data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — OpsTrack" },
      {
        name: "description",
        content: "Generate activity history reports over any custom date range, by personnel, status, category or priority.",
      },
      { property: "og:title", content: "Reports — OpsTrack" },
      { property: "og:description", content: "Custom date-range reporting on support activity history." },
    ],
  }),
  component: ReportsPage,
});

const ALL = "all";
const PAGE_SIZE = 8;

function ReportsPage() {
  const all = useActivities();
  const [from, setFrom] = useState(shiftDate(today(), -7));
  const [to, setTo] = useState(today());
  const [who, setWho] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [generated, setGenerated] = useState(true);

  const rows = useMemo(() => {
    if (!generated) return [];
    return all
      .filter(
        (a) =>
          a.activityDate >= from &&
          a.activityDate <= to &&
          (who === ALL || a.assigneeId === who) &&
          (status === ALL || a.status === status) &&
          (category === ALL || a.categoryId === category) &&
          (priority === ALL || a.priority === priority) &&
          (!q || a.title.toLowerCase().includes(q.toLowerCase())),
      )
      .sort((a, b) => (a.activityDate < b.activityDate ? 1 : -1));
  }, [all, generated, from, to, who, status, category, priority, q]);

  const counts = statusCounts(rows);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const header = ["Date", "Reference", "Activity", "Personnel", "Category", "Status", "Remark", "Updated At"];
    const lines = rows.map((a) => {
      const last = latestUpdate(a);
      return [
        a.activityDate,
        a.reference,
        a.title,
        personnelById(a.assigneeId)?.name ?? "",
        categoryById(a.categoryId)?.name ?? "",
        a.status,
        last.remark,
        last.at,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `opstrack-report-${from}-to-${to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported", { description: `${rows.length} rows written to CSV.` });
  };

  return (
    <AppShell title="Reports" subtitle="Query activity history across any custom date range">
      <Panel className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setGenerated(true);
            toast.success("Report generated", { description: `${from} → ${to}` });
          }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <div>
            <Label htmlFor="from" className="text-[11px]">From date</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-9 bg-card/70 text-[12px]" />
          </div>
          <div>
            <Label htmlFor="to" className="text-[11px]">To date</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-9 bg-card/70 text-[12px]" />
          </div>
          <div>
            <Label className="text-[11px]">Personnel</Label>
            <Select value={who} onValueChange={setWho}>
              <SelectTrigger className="mt-1 h-9 w-full bg-card/70 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All personnel</SelectItem>
                {personnel.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px]">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1 h-9 w-full bg-card/70 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px]">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1 h-9 w-full bg-card/70 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px]">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-1 h-9 w-full bg-card/70 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-6">
            <Button type="submit" size="sm">Generate Report</Button>
          </div>
        </form>
      </Panel>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "Total Activities", value: counts.total, tone: "" },
          { label: "Completed", value: counts.done, tone: "text-good" },
          { label: "Pending", value: counts.pending, tone: "text-warn" },
          { label: "Overdue", value: counts.overdue, tone: "text-alert" },
          { label: "Completion Rate", value: `${completionRate(rows)}%`, tone: "text-primary" },
        ].map((k, i) => (
          <Panel key={k.label} className="fade-up p-4" >
            <div className="eyebrow">{k.label}</div>
            <div className={`tabular mt-1.5 text-[24px] leading-none font-semibold ${k.tone}`} style={{ animationDelay: `${i * 50}ms` }}>
              {k.value}
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="mt-3 overflow-hidden">
        <PanelHeader
          title="Activity History"
          meta={`${from} → ${to}`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <span className="sr-only">Search results</span>
                <Input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search results…"
                  className="h-8 w-[170px] bg-card/70 pl-8 text-[12px]"
                />
              </label>
              <Button variant="outline" size="sm" onClick={exportCsv} disabled={!rows.length}>
                <Download className="size-3.5" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} disabled={!rows.length}>
                <Printer className="size-3.5" /> Print
              </Button>
            </div>
          }
        />

        {rows.length === 0 ? (
          <EmptyState
            icon={<FileBarChart className="size-5" />}
            title="No activity in this range"
            description="Adjust the date range or filters, then generate the report again."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    <th scope="col" className="px-4 py-2 font-medium">Date</th>
                    <th scope="col" className="px-3 py-2 font-medium">Activity</th>
                    <th scope="col" className="px-3 py-2 font-medium">Personnel</th>
                    <th scope="col" className="px-3 py-2 font-medium">Category</th>
                    <th scope="col" className="px-3 py-2 font-medium">Status</th>
                    <th scope="col" className="px-3 py-2 font-medium">Remark</th>
                    <th scope="col" className="px-3 py-2 font-medium">Updated At</th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {pageRows.map((a) => {
                    const last = latestUpdate(a);
                    return (
                      <tr key={a.id} className="border-t border-border hover:bg-primary/4">
                        <td className="tabular px-4 py-2.5 text-muted-foreground">{fmtDate(a.activityDate)}</td>
                        <td className="px-3 py-2.5 font-medium">
                          <Link to="/activities/$activityId" params={{ activityId: a.id }} className="hover:text-primary">
                            {a.title}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{personnelById(a.assigneeId)?.name}</td>
                        <td className="px-3 py-2.5"><CategoryChip name={categoryById(a.categoryId)?.name ?? "—"} /></td>
                        <td className="px-3 py-2.5"><StatusBadge status={a.status} /></td>
                        <td className="max-w-[260px] truncate px-3 py-2.5 text-muted-foreground">{last.remark}</td>
                        <td className="tabular px-3 py-2.5 text-muted-foreground">
                          {fmtDate(last.at)} {fmtTime(last.at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
              <p className="tabular text-[11px] text-muted-foreground">
                Page {page} of {pages} · {rows.length} records
              </p>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                    />
                  </PaginationItem>
                  {Array.from({ length: pages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pages, p + 1)); }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </Panel>
    </AppShell>
  );
}
