export type ActivityStatus = "done" | "pending" | "overdue";
export type Priority = "low" | "medium" | "high" | "critical";
export type Role = "admin" | "supervisor" | "support";

export interface Personnel {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  activityCount: number;
}

export interface ActivityUpdate {
  id: string;
  personnelId: string;
  status: ActivityStatus | "created";
  remark: string;
  at: string; // ISO
}

export interface Activity {
  id: string;
  reference: string;
  title: string;
  description: string;
  categoryId: string;
  priority: Priority;
  assigneeId: string;
  createdById: string;
  activityDate: string; // yyyy-mm-dd
  dueDate: string; // ISO
  createdAt: string; // ISO
  status: ActivityStatus;
  updates: ActivityUpdate[];
}
