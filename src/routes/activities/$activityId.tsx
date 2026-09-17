import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, CalendarClock, UserRound } from "lucide-react";
import { AppShell } from "@/components/ops/AppShell";
import { Panel, PanelHeader } from "@/components/ops/primitives";
import { CategoryChip, Initials, PriorityBadge, StatusBadge } from "@/components/ops/badges";
import { ActivityTimeline } from "@/components/ops/Timeline";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  addUpdate,
  categoryById,
  currentUser,
  fmtDateTime,
  personnelById,
  useActivities,
} from "@/lib/opstrack/data";
import type { ActivityStatus } from "@/lib/opstrack/types";

export const Route = createFileRoute("/activities/$activityId")({
  head: () => ({
    meta: [
      { title: "Activity Detail — OpsTrack" },
      { name: "description", content: "Full activity record with update history, remarks and personnel timestamps." },
      { property: "og:title", content: "Activity Detail — OpsTrack" },
      { property: "og:description", content: "Activity record with full update history and remarks." },
    ],
  }),
  component: ActivityDetail,
});

function ActivityDetail() {
  const { activityId } = Route.useParams();
  const activity = useActivities().find((a) => a.id === activityId);
  const [status, setStatus] = useState<ActivityStatus>("done");
  const [remark, setRemark] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [remarkError, setRemarkError] = useState("");

  if (!activity) throw notFound();

  const assignee = personnelById(activity.assigneeId);
  const creator = personnelById(activity.createdById);

  const onSave = () => {
    if (remark.trim().length < 5) {
      setRemarkError("Add a remark of at least 5 characters so the next shift has context.");
      return;
    }
    setRemarkError("");
    setConfirmOpen(true);
  };

  const commit = () => {
    addUpdate(activity.id, status, remark.trim(), currentUser.id);
    setRemark("");
    setConfirmOpen(false);
    toast.success(`Activity marked ${status === "done" ? "Done" : "Pending"}`, {
      description: "Update recorded with your name and timestamp.",
    });
  };

  return (
    <AppShell title={activity.title} subtitle={`${activity.reference} · ${categoryById(activity.categoryId)?.name}`}>
      <Link to="/activities" className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to activities
      </Link>

      <Panel className="p-4">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-semibold text-balance">{activity.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={activity.status} />
              <PriorityBadge priority={activity.priority} />
              <CategoryChip name={categoryById(activity.categoryId)?.name ?? "—"} />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-card/60 px-3 py-2 ring-1 ring-border">
            <Initials initials={assignee?.initials ?? "··"} size="md" />
            <div className="leading-tight">
              <div className="text-[12px] font-medium">{assignee?.name}</div>
              <div className="text-[10px] text-muted-foreground">Assigned personnel</div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-3">
          <Panel>
            <PanelHeader title="Information" />
            <div className="p-4">
              <p className="text-[13px] leading-relaxed text-pretty text-foreground/80">{activity.description}</p>
              <dl className="mt-4 grid gap-3 text-[12px] sm:grid-cols-2">
                <div>
                  <dt className="eyebrow">Category</dt>
                  <dd className="mt-1">{categoryById(activity.categoryId)?.name}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Created by</dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-muted-foreground" aria-hidden /> {creator?.name}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Created</dt>
                  <dd className="tabular mt-1">{fmtDateTime(activity.createdAt)}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Due</dt>
                  <dd className="tabular mt-1 inline-flex items-center gap-1.5">
                    <CalendarClock className="size-3.5 text-muted-foreground" aria-hidden />
                    {fmtDateTime(activity.dueDate)}
                  </dd>
                </div>
              </dl>
            </div>
          </Panel>

          <Panel id="update" className="ring-primary/25">
            <PanelHeader
              title="Activity Update"
              meta="Your name and the exact time are recorded automatically"
            />
            <div className="space-y-4 p-4">
              <fieldset>
                <legend className="mb-2 text-[12px] font-medium">Status</legend>
                <RadioGroup
                  value={status}
                  onValueChange={(v) => setStatus(v as ActivityStatus)}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  <Label
                    htmlFor="st-done"
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-card/60 p-3 ring-1 ring-border has-[:checked]:bg-good/8 has-[:checked]:ring-good/40"
                  >
                    <RadioGroupItem id="st-done" value="done" />
                    <span>
                      <span className="block text-[12px] font-medium text-good">Done</span>
                      <span className="block text-[11px] text-muted-foreground">Completed within this shift</span>
                    </span>
                  </Label>
                  <Label
                    htmlFor="st-pending"
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-card/60 p-3 ring-1 ring-border has-[:checked]:bg-warn/8 has-[:checked]:ring-warn/40"
                  >
                    <RadioGroupItem id="st-pending" value="pending" />
                    <span>
                      <span className="block text-[12px] font-medium text-warn">Pending</span>
                      <span className="block text-[11px] text-muted-foreground">Carries to the next shift</span>
                    </span>
                  </Label>
                </RadioGroup>
              </fieldset>

              <div>
                <Label htmlFor="remark" className="text-[12px]">
                  Remark <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  placeholder="What was checked, what was found, and what is outstanding?"
                  aria-invalid={!!remarkError}
                  aria-describedby={remarkError ? "remark-error" : undefined}
                  className="mt-1.5 bg-card/70"
                />
                {remarkError && (
                  <p id="remark-error" role="alert" className="mt-1 text-[11px] text-destructive">
                    {remarkError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-muted-foreground">
                  Recording as <span className="font-medium text-foreground">{currentUser.name}</span>
                </p>
                <Button size="sm" onClick={onSave} disabled={!remark.trim()}>
                  Save Update
                </Button>
              </div>
            </div>
          </Panel>
        </div>

        <Panel className="h-fit p-4">
          <div className="text-[12px] font-semibold">Activity Timeline</div>
          <p className="mt-0.5 mb-4 text-[11px] text-muted-foreground">
            {activity.updates.length} recorded update{activity.updates.length === 1 ? "" : "s"} — history is preserved,
            never replaced.
          </p>
          <ActivityTimeline updates={activity.updates} showDate />
        </Panel>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record this update?</AlertDialogTitle>
            <AlertDialogDescription>
              “{activity.title}” will be marked {status === "done" ? "Done" : "Pending"} against your name. The update
              is added to the timeline and cannot be edited afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={commit}>Save update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
