import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Trophy, Medal } from "lucide-react";
import { leaderboard } from "@/data/dummyData";
import { toast } from "sonner";

const rankStyles = [
  "bg-amber-400/10 text-amber-400 border-amber-400/30",
  "bg-slate-300/10 text-slate-300 border-slate-300/30",
  "bg-amber-600/10 text-amber-600 border-amber-600/30",
];

export default function LeaderboardPage() {
  const [frozen, setFrozen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Leaderboard" description="Live contest rankings">
        <div className="flex items-center gap-2">
          {!frozen && <><span className="size-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs text-muted-foreground mr-2">Live</span></>}
          <Button
            variant={frozen ? "default" : "outline"}
            size="sm"
            className="gap-1.5 h-8"
            onClick={() => { setFrozen(!frozen); toast.info(frozen ? "Leaderboard unfrozen" : "Leaderboard frozen"); }}
          >
            {frozen ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
            {frozen ? "Unfreeze" : "Freeze"} Leaderboard
          </Button>
        </div>
      </PageHeader>

      {frozen && (
        <Card className="border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <Lock className="size-4" />
            <span className="font-medium">Leaderboard is frozen — rankings are not updating</span>
          </div>
        </Card>
      )}

      <Card className="border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-16">Rank</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">User</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Score</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Solved</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Penalty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((user, i) => (
                <TableRow key={user.id} className={`border-border/30 transition-colors ${i < 3 ? "hover:bg-muted/40" : "hover:bg-muted/30"}`}>
                  <TableCell>
                    {i < 3 ? (
                      <Badge variant="outline" className={`${rankStyles[i]} font-bold text-sm px-2.5 py-0.5`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {user.rank}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground font-medium pl-2">{user.rank}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className={`text-xs font-bold ${i < 3 ? "bg-gradient-to-br from-cyan-500 to-violet-500 text-white" : "bg-muted"}`}>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.college}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm font-bold ${i < 3 ? "text-primary" : ""}`}>{user.score}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{user.solved}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{user.penalty} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
