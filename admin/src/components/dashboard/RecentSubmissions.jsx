import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Clock } from "lucide-react";
import { submissionService } from "@/services/submissionService";

export function RecentSubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    submissionService.getAll()
      .then(res => setSubmissions(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

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
        {submissions.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No submissions yet</p>}
        {submissions.map((sub) => (
          <div key={sub._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{sub.userId?.name || "Unknown"}</p>
              <p className="text-xs text-muted-foreground truncate">{sub.questionId?.title || "Unknown"}</p>
            </div>
            <StatusBadge status={sub.status} />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(sub.createdAt)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
