import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { submissions } from "@/data/dummyData";
import { Clock } from "lucide-react";

export function RecentSubmissions() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            Recent Submissions
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {submissions.slice(0, 6).map((sub) => (
          <div
            key={sub.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{sub.user}</p>
              <p className="text-xs text-muted-foreground truncate">{sub.problem}</p>
            </div>
            <StatusBadge status={sub.status} />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{sub.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
