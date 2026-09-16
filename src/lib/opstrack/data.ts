import { useSyncExternalStore } from "react";
import type {
  Activity,
  ActivityStatus,
  ActivityUpdate,
  Category,
  Personnel,
  Priority,
} from "./types";

/* ------------------------------------------------------------------ *
 * Demo data layer.
 * In the Laravel implementation this is replaced by Eloquent models
 * (Activity, ActivityUpdate, Category, User) served to Blade views.
 * ------------------------------------------------------------------ */

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const at = (dayOffset: number, time: string) =>
  new Date(`${day(dayOffset)}T${time}:00`).toISOString();

export const personnel: Personnel[] = [
  {
    id: "u1",
    name: "Abdul Qabid",
    initials: "AQ",
    email: "abdul.qabid@opstrack.internal",
    role: "supervisor",
    department: "Applications Support",
    status: "active",
    lastLogin: at(0, "07:52"),
  },
  {
    id: "u2",
    name: "John Doe",
    initials: "JD",
    email: "john.doe@opstrack.internal",
    role: "support",
    department: "Database Services",
    status: "active",
    lastLogin: at(0, "08:04"),
  },
  {
    id: "u3",
    name: "Sara Mensah",
    initials: "SM",
    email: "sara.mensah@opstrack.internal",
    role: "support",
    department: "Applications Support",
    status: "active",
    lastLogin: at(0, "08:11"),
  },
  {
    id: "u4",
    name: "Yusuf Aryee",
    initials: "YA",
    email: "yusuf.aryee@opstrack.internal",
    role: "support",
    department: "Infrastructure",
    status: "active",
    lastLogin: at(-1, "21:36"),
  },
  {
    id: "u5",
    name: "Naa Adjeley",
    initials: "NA",
    email: "naa.adjeley@opstrack.internal",
    role: "admin",
    department: "IT Operations",
    status: "active",
    lastLogin: at(0, "06:40"),
  },
  {
    id: "u6",
    name: "Kwame Boateng",
    initials: "KB",
    email: "kwame.boateng@opstrack.internal",
    role: "support",
    department: "Network Services",
    status: "inactive",
    lastLogin: at(-12, "17:20"),
  },
];

export const categories: Category[] = [
  { id: "c1", name: "Monitoring", description: "Scheduled system and service checks", activityCount: 0 },
  { id: "c2", name: "Database", description: "Backups, restores, integrity and performance", activityCount: 0 },
  { id: "c3", name: "SMS", description: "Messaging gateway and delivery reconciliation", activityCount: 0 },
  { id: "c4", name: "Application", description: "Core business application support", activityCount: 0 },
  { id: "c5", name: "Server", description: "Host, capacity and patching tasks", activityCount: 0 },
  { id: "c6", name: "Network", description: "Links, firewall and connectivity", activityCount: 0 },
  { id: "c7", name: "Incident", description: "Unplanned disruption handling", activityCount: 0 },
  { id: "c8", name: "Reporting", description: "Scheduled extracts and regulatory reports", activityCount: 0 },
  { id: "c9", name: "Maintenance", description: "Planned maintenance windows", activityCount: 0 },
];

let seq = 100;
const ref = () => `ACT-${++seq}`;

function activity(
  a: Omit<Activity, "id" | "reference" | "createdAt"> & { createdAt?: string },
): Activity {
  const reference = ref();
  return {
    id: reference.toLowerCase(),
    reference,
    createdAt: a.createdAt ?? a.updates[0]?.at ?? at(0, "08:00"),
    ...a,
  };
}

const seed: Activity[] = [
  activity({
    title: "Daily SMS count comparison",
    description:
      "Compare SMS counts between the messaging gateway report and the core application logs for the previous calendar day, and reconcile any variance above 0.5%.",
    categoryId: "c3",
    priority: "medium",
    assigneeId: "u1",
    createdById: "u5",
    activityDate: day(0),
    dueDate: at(0, "12:00"),
    status: "done",
    updates: [
      { id: "up1", personnelId: "u1", status: "created", remark: "Started activity.", at: at(0, "09:05") },
      {
        id: "up2",
        personnelId: "u1",
        status: "done",
        remark: "SMS count matched the application logs. Variance 0.02%, within tolerance.",
        at: at(0, "09:42"),
      },
    ],
  }),
  activity({
    title: "Database backup verification",
    description:
      "Verify last night's full backup completed on all three nodes and run a checksum comparison against the replica set.",
    categoryId: "c2",
    priority: "high",
    assigneeId: "u2",
    createdById: "u1",
    activityDate: day(0),
    dueDate: at(0, "11:00"),
    status: "pending",
    updates: [
      { id: "up3", personnelId: "u2", status: "created", remark: "Started activity.", at: at(0, "08:20") },
      {
        id: "up4",
        personnelId: "u2",
        status: "pending",
        remark: "Checksum mismatch on replica 2 — re-run queued, awaiting DBA confirmation.",
        at: at(0, "10:13"),
      },
    ],
  }),
  activity({
    title: "Payment gateway latency check",
    description:
      "Review payment gateway response times across the morning peak and escalate to the vendor if the 95th percentile exceeds 400ms.",
    categoryId: "c4",
    priority: "critical",
    assigneeId: "u3",
    createdById: "u1",
    activityDate: day(0),
    dueDate: at(0, "09:00"),
    status: "overdue",
    updates: [
      { id: "up5", personnelId: "u3", status: "created", remark: "Started activity.", at: at(0, "07:55") },
      {
        id: "up6",
        personnelId: "u3",
        status: "pending",
        remark: "Latency above 400ms since 07:30. Escalated to vendor, awaiting response before 15:00.",
        at: at(0, "08:05"),
      },
    ],
  }),
  activity({
    title: "Nightly report export job",
    description: "Confirm the nightly regulatory extract completed and the file landed on the SFTP drop.",
    categoryId: "c8",
    priority: "low",
    assigneeId: "u4",
    createdById: "u5",
    activityDate: day(0),
    dueDate: at(0, "13:00"),
    status: "done",
    updates: [
      { id: "up7", personnelId: "u4", status: "created", remark: "Started activity.", at: at(0, "10:40") },
      { id: "up8", personnelId: "u4", status: "done", remark: "Export completed, file delivered at 02:14.", at: at(0, "11:20") },
    ],
  }),
  activity({
    title: "Application server disk capacity review",
    description: "Review disk usage on APP01–APP04 and schedule log rotation where usage exceeds 75%.",
    categoryId: "c5",
    priority: "medium",
    assigneeId: "u3",
    createdById: "u1",
    activityDate: day(0),
    dueDate: at(0, "16:00"),
    status: "pending",
    updates: [
      { id: "up9", personnelId: "u3", status: "created", remark: "Started activity.", at: at(0, "08:45") },
      { id: "up10", personnelId: "u3", status: "pending", remark: "APP03 at 81%. Log rotation scheduled for noon.", at: at(0, "08:50") },
    ],
  }),
  activity({
    title: "Branch link stability monitoring",
    description: "Monitor branch WAN links for flapping and log any interface resets.",
    categoryId: "c6",
    priority: "medium",
    assigneeId: "u4",
    createdById: "u1",
    activityDate: day(0),
    dueDate: at(0, "17:00"),
    status: "done",
    updates: [
      { id: "up11", personnelId: "u4", status: "created", remark: "Started activity.", at: at(0, "08:10") },
      { id: "up12", personnelId: "u4", status: "done", remark: "No resets recorded across all 14 branch links.", at: at(0, "12:05") },
    ],
  }),
  activity({
    title: "Core banking batch reconciliation",
    description: "Reconcile the end-of-day batch posting totals against the general ledger interface.",
    categoryId: "c4",
    priority: "high",
    assigneeId: "u1",
    createdById: "u5",
    activityDate: day(0),
    dueDate: at(0, "15:00"),
    status: "pending",
    updates: [
      { id: "up13", personnelId: "u1", status: "created", remark: "Started activity.", at: at(0, "11:02") },
      { id: "up14", personnelId: "u1", status: "pending", remark: "Two suspense entries under review with Finance.", at: at(0, "13:26") },
    ],
  }),
  activity({
    title: "Antivirus definition rollout",
    description: "Confirm endpoint definition rollout completed across the support estate.",
    categoryId: "c9",
    priority: "low",
    assigneeId: "u2",
    createdById: "u5",
    activityDate: day(0),
    dueDate: at(0, "17:00"),
    status: "done",
    updates: [
      { id: "up15", personnelId: "u2", status: "created", remark: "Started activity.", at: at(0, "09:15") },
      { id: "up16", personnelId: "u2", status: "done", remark: "Rollout complete, 214 of 214 endpoints current.", at: at(0, "10:02") },
    ],
  }),
  activity({
    title: "Incident 4412 — teller session timeouts",
    description: "Investigate intermittent teller session timeouts reported by two branches.",
    categoryId: "c7",
    priority: "critical",
    assigneeId: "u3",
    createdById: "u1",
    activityDate: day(-1),
    dueDate: at(-1, "18:00"),
    status: "overdue",
    updates: [
      { id: "up17", personnelId: "u3", status: "created", remark: "Started activity.", at: at(-1, "14:20") },
      { id: "up18", personnelId: "u3", status: "pending", remark: "Session pool exhaustion suspected. Carried into today's shift.", at: at(-1, "17:48") },
    ],
  }),
  activity({
    title: "Interface queue depth monitoring",
    description: "Track middleware queue depth through the morning peak.",
    categoryId: "c1",
    priority: "medium",
    assigneeId: "u4",
    createdById: "u1",
    activityDate: day(-1),
    dueDate: at(-1, "17:00"),
    status: "done",
    updates: [
      { id: "up19", personnelId: "u4", status: "created", remark: "Started activity.", at: at(-1, "08:30") },
      { id: "up20", personnelId: "u4", status: "done", remark: "Peak depth 148 messages, cleared within SLA.", at: at(-1, "16:10") },
    ],
  }),
  activity({
    title: "Month-end statement run check",
    description: "Verify the statement generation run and spool delivery to print services.",
    categoryId: "c8",
    priority: "high",
    assigneeId: "u2",
    createdById: "u5",
    activityDate: day(-1),
    dueDate: at(-1, "20:00"),
    status: "done",
    updates: [
      { id: "up21", personnelId: "u2", status: "created", remark: "Started activity.", at: at(-1, "18:05") },
      { id: "up22", personnelId: "u2", status: "done", remark: "All 38,412 statements generated and spooled.", at: at(-1, "19:22") },
    ],
  }),
  activity({
    title: "Patch window pre-checks — DB cluster",
    description: "Complete pre-patch health checks ahead of the weekend maintenance window.",
    categoryId: "c9",
    priority: "medium",
    assigneeId: "u1",
    createdById: "u5",
    activityDate: day(1),
    dueDate: at(1, "16:00"),
    status: "pending",
    updates: [{ id: "up23", personnelId: "u1", status: "created", remark: "Scheduled.", at: at(0, "14:00") }],
  }),
];

/* ------------------------------ store ----------------------------- */

let activities: Activity[] = seed;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useActivities() {
  return useSyncExternalStore(
    subscribe,
    () => activities,
    () => activities,
  );
}

export function createActivity(input: {
  title: string;
  description: string;
  categoryId: string;
  priority: Priority;
  assigneeId: string;
  activityDate: string;
  dueDate: string;
  createdById: string;
}) {
  const reference = ref();
  const now = new Date().toISOString();
  const next: Activity = {
    id: reference.toLowerCase(),
    reference,
    createdAt: now,
    status: "pending",
    updates: [
      { id: `${reference}-u0`, personnelId: input.createdById, status: "created", remark: "Activity created.", at: now },
    ],
    ...input,
    dueDate: new Date(input.dueDate).toISOString(),
  };
  activities = [next, ...activities];
  emit();
  return next;
}

export function addUpdate(activityId: string, status: ActivityStatus, remark: string, personnelId: string) {
  const now = new Date().toISOString();
  activities = activities.map((a) =>
    a.id === activityId
      ? {
          ...a,
          status,
          updates: [
            ...a.updates,
            { id: `${a.reference}-u${a.updates.length}`, personnelId, status, remark, at: now } satisfies ActivityUpdate,
          ],
        }
      : a,
  );
  emit();
}

/* ----------------------------- helpers ---------------------------- */

export const currentUser = personnel[0];

export const personnelById = (id: string) => personnel.find((p) => p.id === id);
export const categoryById = (id: string) => categories.find((c) => c.id === id);

export const today = () => day(0);

export const latestUpdate = (a: Activity) => a.updates[a.updates.length - 1];

export function statusCounts(list: Activity[]) {
  return {
    total: list.length,
    done: list.filter((a) => a.status === "done").length,
    pending: list.filter((a) => a.status === "pending").length,
    overdue: list.filter((a) => a.status === "overdue").length,
  };
}

export function completionRate(list: Activity[]) {
  if (!list.length) return 0;
  return Math.round((list.filter((a) => a.status === "done").length / list.length) * 100);
}

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", yyyy: undefined, year: "numeric" } as Intl.DateTimeFormatOptions);

export const fmtDateLong = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const fmtDateTime = (iso: string) => `${fmtDate(iso)} · ${fmtTime(iso)}`;

export function shiftDate(dateStr: string, delta: number) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}
