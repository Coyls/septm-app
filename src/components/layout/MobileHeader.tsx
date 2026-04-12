"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  User,
  Users,
  LogOut,
  Trophy,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMe } from "@/lib/query/hooks/useAuth"
import { useSignOut } from "@/lib/query/hooks/useAuth"
import { useReceivedRequests } from "@/lib/query/hooks/useFriends"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/game/new", label: "Nouvelle partie", icon: PlusCircle, accent: true },
  { href: "/statistics", label: "Statistiques", icon: BarChart2 },
  { href: "/statistics/me", label: "Mes statistiques", icon: User },
]

export function MobileHeader({ className }: { className?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: meData } = useMe()
  const { data: received } = useReceivedRequests()
  const signOut = useSignOut()

  const pendingCount = received?.length ?? 0

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 h-14 border-b border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        <span className="font-bold tracking-tight">SEPTM</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="relative" />}
        >
          <Menu className="h-5 w-5" />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="px-4 py-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              SEPTM
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 p-3 flex-1">
            {navItems.map(({ href, label, icon: Icon, accent }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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

            <Link
              href="/friends"
              onClick={() => setOpen(false)}
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

          <div className="p-3 border-t border-border mt-auto">
            {meData?.user?.userId && (
              <p className="text-xs text-muted-foreground truncate px-2 mb-2">
                ID: {meData.user.userId}
              </p>
            )}
            <Separator className="mb-2" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={() => {
                setOpen(false)
                signOut.mutate()
              }}
              disabled={signOut.isPending}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
