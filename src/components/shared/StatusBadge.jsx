import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  Accepted: { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  "Wrong Answer": { className: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  "Time Limit": { className: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  "Runtime Error": { className: "bg-orange-500/15 text-orange-400 border-orange-500/30", dot: "bg-orange-400" },
  "Compilation Error": { className: "bg-rose-500/15 text-rose-400 border-rose-500/30", dot: "bg-rose-400" },
  Pending: { className: "bg-blue-500/15 text-blue-400 border-blue-500/30", dot: "bg-blue-400" },
  active: { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  banned: { className: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  disqualified: { className: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  Easy: { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  Medium: { className: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  Hard: { className: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  published: { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  draft: { className: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-400" },
  info: { className: "bg-blue-500/15 text-blue-400 border-blue-500/30", dot: "bg-blue-400" },
  warning: { className: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  urgent: { className: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  LIVE: { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse", dot: "bg-emerald-400" },
  ENDED: { className: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-400" },
  PAUSED: { className: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
};

export function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { className: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-400" };

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full border",
        config.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {status}
    </Badge>
  );
}
