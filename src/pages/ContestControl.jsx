import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCountdown } from "@/hooks/useCountdown";
import { Play, Pause, Square, RotateCcw, Clock, AlertTriangle, Gamepad2 } from "lucide-react";
import { toast } from "sonner";

export default function ContestControlPage() {
  const { formatted, isRunning, pause, resume, reset } = useCountdown(7200);
  const [contestStatus, setContestStatus] = useState("LIVE");
  const [confirmAction, setConfirmAction] = useState(null);

  const actions = [
    { label: "Start Contest", icon: Play, action: "start", variant: "default", className: "bg-emerald-600 hover:bg-emerald-500 text-white", disabled: contestStatus === "LIVE" },
    { label: "Pause Contest", icon: Pause, action: "pause", variant: "outline", className: "border-amber-500/50 text-amber-400 hover:bg-amber-500/10", disabled: contestStatus !== "LIVE" },
    { label: "End Contest", icon: Square, action: "end", variant: "outline", className: "border-red-500/50 text-red-400 hover:bg-red-500/10", disabled: contestStatus === "ENDED" },
    { label: "Reset Contest", icon: RotateCcw, action: "reset", variant: "outline", className: "border-slate-500/50 text-slate-400 hover:bg-slate-500/10" },
  ];

  const handleConfirm = () => {
    const a = confirmAction;
    if (a === "start") { setContestStatus("LIVE"); resume(); toast.success("Contest started"); }
    if (a === "pause") { setContestStatus("PAUSED"); pause(); toast.info("Contest paused"); }
    if (a === "end") { setContestStatus("ENDED"); pause(); toast.warning("Contest ended"); }
    if (a === "reset") { setContestStatus("LIVE"); reset(7200); toast.success("Contest reset"); }
  };

  const statusColors = { LIVE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", PAUSED: "text-amber-400 bg-amber-400/10 border-amber-400/30", ENDED: "text-red-400 bg-red-400/10 border-red-400/30" };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Contest Control" description="Manage the active contest state" />

      {/* Status + Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card">
          <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Gamepad2 className="size-4 text-primary" /> Contest Status</CardTitle></CardHeader>
          <CardContent>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-lg font-bold ${statusColors[contestStatus]}`}>
              {contestStatus === "LIVE" && <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />}
              {contestStatus}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Clock className="size-4 text-primary" /> Timer</CardTitle></CardHeader>
          <CardContent>
            <div className="font-mono text-4xl font-bold tracking-widest gradient-text">{formatted}</div>
            <p className="text-xs text-muted-foreground mt-1">{isRunning ? "Running" : "Paused"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="border-border/50 bg-card">
        <CardHeader><CardTitle className="text-base font-semibold">Controls</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actions.map((a) => (
              <Button key={a.label} variant={a.variant} className={`gap-2 h-11 ${a.className}`} disabled={a.disabled} onClick={() => setConfirmAction(a.action)}>
                <a.icon className="size-4" /> {a.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contest Config */}
      <Card className="border-border/50 bg-card">
        <CardHeader><CardTitle className="text-base font-semibold">Contest Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Contest Name</Label><Input defaultValue="Coding Championship 2025" className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Duration (minutes)</Label><Input type="number" defaultValue="120" className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Start Time</Label><Input type="datetime-local" className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Max Participants</Label><Input type="number" defaultValue="500" className="bg-muted/50" /></div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-0">Save Configuration</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2 text-red-400"><AlertTriangle className="size-4" /> Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20">
            <div><p className="text-sm font-medium">Force End Contest</p><p className="text-xs text-muted-foreground">Immediately end the contest for all participants</p></div>
            <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => setConfirmAction("end")}>Force End</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20">
            <div><p className="text-sm font-medium">Reset All Submissions</p><p className="text-xs text-muted-foreground">Delete all submissions and reset scores to zero</p></div>
            <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => setConfirmAction("reset")}>Reset All</Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)} title={`${confirmAction?.charAt(0).toUpperCase()}${confirmAction?.slice(1) || ""} Contest`} description={`Are you sure you want to ${confirmAction} the contest? This will affect all participants.`} confirmText={`${confirmAction?.charAt(0).toUpperCase()}${confirmAction?.slice(1) || ""}`} destructive={confirmAction === "end" || confirmAction === "reset"} onConfirm={handleConfirm} />
    </div>
  );
}
