import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  ClipboardList,
  FolderTree,
  Gauge,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Initials } from "./badges";
import { currentUser, fmtDateLong, statusCounts, useActivities, today } from "@/lib/opstrack/data";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/activities", label: "Activities", icon: ClipboardList },
  { to: "/handover", label: "Daily Handover", icon: CalendarClock, badge: true },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/personnel", label: "Personnel", icon: Users },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const adminNav = [{ to: "/users", label: "User Management", icon: ShieldCheck }] as const;

function NavList({ onNavigate, pendingCount }: { onNavigate?: () => void; pendingCount: number }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Primary">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            isActive(item.to)
              ? "bg-card/70 font-medium text-primary ring-1 ring-border"
              : "text-foreground/60 hover:bg-card/50 hover:text-foreground",
          )}
          aria-current={isActive(item.to) ? "page" : undefined}
        >
          <item.icon className="size-4 shrink-0" aria-hidden />
          {item.label}
          {"badge" in item && item.badge && pendingCount > 0 && (
            <span className="tabular ml-auto text-[10px] font-medium text-alert">{pendingCount}</span>
          )}
        </Link>
      ))}

      <div className="mt-4 mb-1 px-3">
        <span className="eyebrow">Administration</span>
      </div>
      {adminNav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
            isActive(item.to)
              ? "bg-card/70 font-medium text-primary ring-1 ring-border"
              : "text-foreground/60 hover:bg-card/50 hover:text-foreground",
          )}
        >
          <item.icon className="size-4 shrink-0" aria-hidden />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="mb-3 flex items-center gap-2.5 px-2 py-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
        OT
      </span>
      <div className="leading-tight">
        <div className="text-[14px] font-semibold">OpsTrack</div>
        <div className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">App Support Ops</div>
      </div>
    </div>
  );
}

function UserCard() {
  return (
    <div className="mt-auto flex items-center gap-2.5 rounded-lg bg-card/50 p-2 ring-1 ring-border">
      <Initials initials={currentUser.initials} size="md" />
      <div className="leading-tight">
        <div className="text-[12px] font-medium">{currentUser.name}</div>
        <div className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activities = useActivities();
  const counts = statusCounts(activities.filter((a) => a.activityDate === today()));
  const carry = counts.pending + counts.overdue;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-1 p-4 lg:flex">
        <Brand />
        <NavList pendingCount={carry} />
        <UserCard />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-border bg-card/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-card/70 ring-1 ring-border lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] bg-background p-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand />
                <NavList onNavigate={() => setMobileOpen(false)} pendingCount={carry} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-semibold text-balance sm:text-[19px]">{title}</h1>
              <p className="truncate text-[12px] text-muted-foreground">{subtitle ?? fmtDateLong(new Date())}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {actions}
              <label className="hidden w-52 items-center gap-2 rounded-lg bg-card/70 px-3 py-1.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-ring md:flex">
                <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="sr-only">Search activities</span>
                <input
                  type="search"
                  placeholder="Search activities…"
                  className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
                />
              </label>

              <Popover>
                <PopoverTrigger
                  className="relative grid size-9 place-items-center rounded-lg bg-card/70 ring-1 ring-border hover:bg-card"
                  aria-label="Notifications"
                >
                  <Bell className="size-4 text-muted-foreground" />
                  {carry > 0 && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-alert" />}
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-0">
                  <div className="border-b border-border px-3 py-2 text-[12px] font-semibold">Notifications</div>
                  <ul className="divide-y divide-border">
                    <li className="px-3 py-2.5 text-[12px]">
                      <span className="font-medium">{counts.overdue} overdue</span> activities need escalation before
                      handover.
                    </li>
                    <li className="px-3 py-2.5 text-[12px]">
                      <span className="font-medium">{counts.pending} pending</span> activities will carry to the next
                      shift.
                    </li>
                  </ul>
                  <div className="border-t border-border p-2">
                    <Link to="/handover" className="block rounded-md px-2 py-1.5 text-[12px] text-primary hover:bg-accent">
                      Open daily handover →
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg bg-card/70 py-1.5 pr-3 pl-2 ring-1 ring-border hover:bg-card">
                  <Initials initials={currentUser.initials} size="sm" />
                  <span className="hidden text-[12px] font-medium sm:inline">{currentUser.name.split(" ")[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="text-[12px]">
                    {currentUser.name}
                    <div className="text-[11px] font-normal text-muted-foreground">{currentUser.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/personnel/$personnelId" params={{ personnelId: currentUser.id }}>
                      My profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">
                      <LogOut className="size-3.5" /> Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
