import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { Panel, PanelHeader } from "@/components/ops/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, createActivity, currentUser, personnel, today } from "@/lib/opstrack/data";

export const Route = createFileRoute("/activities/new")({
  head: () => ({
    meta: [
      { title: "Create Activity — OpsTrack" },
      { name: "description", content: "Record a new applications support activity with category, priority and owner." },
      { property: "og:title", content: "Create Activity — OpsTrack" },
      { property: "og:description", content: "Record a new applications support activity." },
    ],
  }),
  component: CreateActivityPage,
});

type Errors = Partial<Record<"title" | "categoryId" | "assigneeId" | "activityDate" | "dueDate", string>>;

function CreateActivityPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    assigneeId: "",
    activityDate: today(),
    dueDate: `${today()}T17:00`,
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Errors = {};
    if (form.title.trim().length < 5) e.title = "Enter an activity title of at least 5 characters.";
    if (!form.categoryId) e.categoryId = "Select a category.";
    if (!form.assigneeId) e.assigneeId = "Assign this activity to a member of personnel.";
    if (!form.activityDate) e.activityDate = "Select the activity date.";
    if (!form.dueDate) e.dueDate = "Select a due date and time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setSaving(true);
    const created = createActivity({
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      priority: form.priority as never,
      assigneeId: form.assigneeId,
      activityDate: form.activityDate,
      dueDate: form.dueDate,
      createdById: currentUser.id,
    });
    toast.success("Activity created", { description: `${created.reference} · ${created.title}` });
    navigate({ to: "/activities/$activityId", params: { activityId: created.id } });
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} role="alert" className="mt-1 text-[11px] text-destructive">
        {errors[k]}
      </p>
    ) : null;

  return (
    <AppShell title="Create Activity" subtitle="Record a new support activity for the shift log">
      <Link to="/activities" className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to activities
      </Link>

      <form onSubmit={submit} noValidate className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel className="overflow-hidden">
          <PanelHeader title="Activity details" meta="All fields marked required must be completed" />
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="title" className="text-[12px]">
                Activity title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Daily SMS count comparison"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
                className="mt-1.5 bg-card/70"
              />
              {err("title")}
            </div>

            <div>
              <Label htmlFor="description" className="text-[12px]">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="What must be checked, and what does a successful outcome look like?"
                className="mt-1.5 bg-card/70"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Give enough context for the next shift to pick this up cold.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-[12px]">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                  <SelectTrigger className="mt-1.5 w-full bg-card/70" aria-invalid={!!errors.categoryId}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err("categoryId")}
              </div>

              <div>
                <Label className="text-[12px]">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                  <SelectTrigger className="mt-1.5 w-full bg-card/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[12px]">
                  Assigned personnel <span className="text-destructive">*</span>
                </Label>
                <Select value={form.assigneeId} onValueChange={(v) => set("assigneeId", v)}>
                  <SelectTrigger className="mt-1.5 w-full bg-card/70" aria-invalid={!!errors.assigneeId}>
                    <SelectValue placeholder="Select personnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {personnel
                      .filter((p) => p.status === "active")
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} · {p.department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {err("assigneeId")}
              </div>

              <div>
                <Label htmlFor="activityDate" className="text-[12px]">
                  Activity date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="activityDate"
                  type="date"
                  value={form.activityDate}
                  onChange={(e) => set("activityDate", e.target.value)}
                  aria-invalid={!!errors.activityDate}
                  className="mt-1.5 bg-card/70"
                />
                {err("activityDate")}
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-[12px]">
                  Due date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)}
                  aria-invalid={!!errors.dueDate}
                  className="mt-1.5 bg-card/70"
                />
                {err("dueDate")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            <Button asChild variant="ghost" size="sm" type="button">
              <Link to="/activities">Cancel</Link>
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Creating…" : "Create Activity"}
            </Button>
          </div>
        </Panel>

        <Panel className="h-fit p-4">
          <div className="text-[12px] font-semibold">How this is logged</div>
          <ul className="mt-2 space-y-2 text-[11px] text-muted-foreground">
            <li>The activity opens as <span className="font-medium text-warn">Pending</span> until someone records an update.</li>
            <li>Every update captures the personnel, status, remark and exact timestamp.</li>
            <li>Nothing is overwritten — previous updates stay on the activity timeline.</li>
            <li>Anything still open at end of day appears on the Daily Handover.</li>
          </ul>
        </Panel>
      </form>
    </AppShell>
  );
}
