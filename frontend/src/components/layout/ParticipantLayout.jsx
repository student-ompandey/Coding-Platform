import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { Code2, LayoutDashboard, Trophy, User, LogOut, Menu, X, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Toaster } from "sonner";

const navItems = [
  { label: "Contests", icon: LayoutDashboard, path: "/contests" },
  { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { label: "Profile", icon: User, path: "/profile" },
];

export function ParticipantLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Code2 className="size-4 text-white" />
                </div>
                <span className="text-lg font-bold hidden sm:inline">Code<span className="gradient-text">Arena</span></span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink key={item.path} to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}>
                      <item.icon className="size-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search problems..." className="pl-9 w-56 h-9 bg-muted/50 border-border/50" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-[18px]" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-cyan-400 rounded-full" />
              </Button>
              <Link to="/profile">
                <Avatar className="size-8 cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-500 text-white text-xs font-bold">OP</AvatarFallback>
                </Avatar>
              </Link>
              <button className="md:hidden p-2 rounded-lg hover:bg-muted/50" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <div className="md:hidden border-t border-border/50 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    )}>
                    <item.icon className="size-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <Outlet />
      </main>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "oklch(0.17 0.005 260)", border: "1px solid oklch(0.25 0.01 260)" } }} />
    </div>
  );
}
