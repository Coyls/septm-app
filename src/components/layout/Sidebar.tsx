"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  Users,
  LogOut,
  Trophy,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useMe } from "@/lib/query/hooks/useAuth"
import { useSignOut } from "@/lib/query/hooks/useAuth"
import { useReceivedRequests } from "@/lib/query/hooks/useFriends"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/game/new", label: "Nouvelle partie", icon: PlusCircle, accent: true },
  { href: "/statistics/me", label: "Statistiques", icon: BarChart2 },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { data: meData } = useMe()
  const { data: received } = useReceivedRequests()
  const signOut = useSignOut()

  const pendingCount = received?.length ?? 0

  return (
    <aside
      className={cn(
        "flex flex-col w-60 h-screen sticky top-0 border-r border-border bg-card px-3 py-4",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg tracking-tight">SEPTM</span>
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

      {/* User info + logout */}
      <div className="space-y-2 px-1">
        {meData?.user?.userId && (
          <p className="text-xs text-muted-foreground truncate px-2">
            ID: {meData.user.userId}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
