import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCode2,
  Send,
  Trophy,
  Megaphone,
  Settings,
  LogOut,
  Gamepad2,
  X,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Questions", icon: FileCode2, path: "/questions" },
  { label: "Submissions", icon: Send, path: "/submissions" },
  { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { label: "Announcements", icon: Megaphone, path: "/announcements" },
  { label: "Contest Control", icon: Gamepad2, path: "/contest-control" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function SidebarContent({ onClose }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Code2 className="size-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight">CodeArena</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-muted transition-colors">
            <X className="size-5" />
          </button>
        )}
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-cyan-400 to-violet-400" />
                )}
                <item.icon className={cn("size-[18px] transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="opacity-50" />

      {/* Logout */}
      <div className="px-3 py-4">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 w-full">
          <LogOut className="size-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
