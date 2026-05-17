import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { users } from "@/data/dummyData";

const rankColors = ["text-amber-400", "text-slate-300", "text-amber-600"];
const rankBg = ["bg-amber-400/10", "bg-slate-300/10", "bg-amber-600/10"];

export function TopPerformers() {
  const topUsers = users.slice(0, 5);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Trophy className="size-4 text-amber-400" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUsers.map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? rankBg[i] : "bg-muted"}`}>
              <span className={i < 3 ? rankColors[i] : "text-muted-foreground"}>
                {i + 1}
              </span>
            </div>
            <Avatar className="size-8">
              <AvatarFallback className="bg-muted text-xs font-semibold">{user.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.solved} solved</p>
            </div>
            <span className="text-sm font-bold text-primary">{user.score}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
