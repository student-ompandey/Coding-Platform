import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountdown } from "@/hooks/useCountdown";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContestTimer() {
  const { formatted, isRunning, pause, resume } = useCountdown(7200);

  return (
    <Card className="border-border/50 bg-card overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5" />
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          Contest Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-center py-4">
          <div className="font-mono text-4xl font-bold tracking-widest gradient-text mb-1">
            {formatted}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Time Remaining</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8"
              onClick={isRunning ? pause : resume}
            >
              {isRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {isRunning ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
