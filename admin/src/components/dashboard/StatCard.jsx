import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { Users, UserCheck, Send, Trophy, CheckCircle, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

const iconMap = { Users, UserCheck, Send, Trophy, CheckCircle, Activity };
const trendIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus };

const gradients = [
  "from-cyan-500/20 to-cyan-500/5",
  "from-violet-500/20 to-violet-500/5",
  "from-emerald-500/20 to-emerald-500/5",
  "from-amber-500/20 to-amber-500/5",
  "from-blue-500/20 to-blue-500/5",
  "from-rose-500/20 to-rose-500/5",
];

const iconColors = [
  "text-cyan-400",
  "text-violet-400",
  "text-emerald-400",
  "text-amber-400",
  "text-blue-400",
  "text-rose-400",
];

export function StatCard({ stat, index = 0 }) {
  const Icon = iconMap[stat.icon] || Activity;
  const TrendIcon = trendIcons[stat.trend] || Minus;
  const gradient = gradients[index % gradients.length];
  const iconColor = iconColors[index % iconColors.length];

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradient)} />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <div className="flex items-center gap-1.5">
              <TrendIcon className={cn("size-3.5", stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-red-400" : "text-muted-foreground")} />
              <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-red-400" : "text-muted-foreground")}>
                {stat.change}
              </span>
            </div>
          </div>
          <div className={cn("p-2.5 rounded-xl bg-muted/50 group-hover:scale-110 transition-transform duration-300", iconColor)}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
