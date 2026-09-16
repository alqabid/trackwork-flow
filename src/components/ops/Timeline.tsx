import { cn } from "@/lib/utils";
import { Initials } from "./badges";
import { fmtDate, fmtTime, personnelById } from "@/lib/opstrack/data";
import type { ActivityUpdate } from "@/lib/opstrack/types";

const toneFor = (status: ActivityUpdate["status"]) =>
  status === "done" ? "good" : status === "pending" ? "warn" : status === "overdue" ? "alert" : "muted";

const verb = (status: ActivityUpdate["status"]) =>
  status === "created" ? "Started activity" : `Status changed to ${status[0].toUpperCase()}${status.slice(1)}`;

export function ActivityTimeline({ updates, showDate = false }: { updates: ActivityUpdate[]; showDate?: boolean }) {
  const ordered = [...updates].sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <ol className="relative space-y-4 pl-1" aria-label="Activity update history">
      <span className="absolute top-2 bottom-2 left-[14px] w-px bg-border" aria-hidden />
      {ordered.map((u, i) => {
        const person = personnelById(u.personnelId);
        const tone = toneFor(u.status);
        return (
          <li key={u.id} className="fade-up relative flex gap-3" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="relative z-1">
              <Initials initials={person?.initials ?? "··"} tone={tone as never} size="md" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="tabular text-[11px] text-muted-foreground">
                  {showDate ? `${fmtDate(u.at)} · ` : ""}
                  {fmtTime(u.at)}
                </span>
                <span className="text-[12px] font-semibold">{person?.name}</span>
              </div>
              <p
                className={cn(
                  "text-[12px]",
                  u.status === "done" && "text-good",
                  u.status === "pending" && "text-warn",
                  u.status === "overdue" && "text-alert",
                  u.status === "created" && "text-muted-foreground",
                )}
              >
                {verb(u.status)}
              </p>
              {u.remark && u.status !== "created" && (
                <p className="mt-1 rounded-md bg-foreground/4 px-2.5 py-1.5 text-[12px] text-pretty text-foreground/75">
                  <span className="eyebrow mr-1.5 align-middle">Remark</span>
                  {u.remark}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
