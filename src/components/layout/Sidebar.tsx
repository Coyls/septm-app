"use client";

import { AccountDialog } from "@/components/account/AccountDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useMe, useSignOut } from "@/lib/query/hooks/useAuth";
import { useReceivedRequests } from "@/lib/query/hooks/useFriends";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    href: "/game/new",
    label: "Nouvelle partie",
    icon: PlusCircle,
    accent: true,
  },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/statistics/me", label: "Statistiques", icon: BarChart2 },
];

function getInitial(name?: string | null): string {
  if (name) return name[0].toUpperCase();
  return "?";
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: meData } = useMe();
  const { data: received } = useReceivedRequests();
  const signOut = useSignOut();
  const [accountOpen, setAccountOpen] = useState(false);

  const pendingCount = received?.length ?? 0;
  const user = meData?.user;
  const displayName = user?.name ?? user?.email ?? "Compte";
  const displayEmail = user?.email;
  const initial = getInitial(user?.name);

  return (
    <>
      <aside
        className={cn(
          "flex flex-col w-60 h-screen sticky top-0 border-r border-border bg-card px-3 py-4",
          className,
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-lg tracking-widest uppercase">
            SEPTM
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-primary text-primary-foreground"
                  : accent
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          {/* Friends with badge */}
          <Link
            href="/friends"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/friends"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span className="flex-1">Amis</span>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {pendingCount}
              </Badge>
            )}
          </Link>
        </nav>

        <Separator className="my-3" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
              "hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Avatar>
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 items-start overflow-hidden text-left leading-tight">
              <span className="truncate font-medium text-xs">
                {displayName}
              </span>
              {displayEmail && (
                <span className="truncate text-[11px] text-muted-foreground">
                  {displayEmail}
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-56">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar>
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="truncate text-xs font-medium">
                  {displayName}
                </span>
                {displayEmail && (
                  <span className="truncate text-[11px] text-muted-foreground">
                    {displayEmail}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setAccountOpen(true)}
            >
              <Settings className="h-4 w-4" />
              {displayName}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              onClick={() => signOut.mutate()}
              disabled={signOut.isPending}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      <AccountDialog
        open={accountOpen}
        onOpenChange={setAccountOpen}
        currentName={user?.name}
      />
    </>
  );
}
