import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCountdown } from "@/hooks/useCountdown";
import { Play, Pause, Square, RotateCcw, Clock, AlertTriangle, Gamepad2, Loader2 } from "lucide-react";
import { contestService } from "@/services/contestService";
import { questionService } from "@/services/questionService";
import { toast } from "sonner";

export default function ContestControlPage() {
  const { formatted, isRunning, pause, resume, reset } = useCountdown(7200);
  const [contest, setContest] = useState(null);
  const [contestStatus, setContestStatus] = useState("upcoming");
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contestTitle, setContestTitle] = useState("Coding Championship 2025");
  const [duration, setDuration] = useState(120);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchContest(); }, []);

  const fetchContest = async () => {
    try {
      const res = await contestService.getAll();
      if (res.data.length > 0) {
        const c = res.data[0];
        setContest(c);
        setContestStatus(c.status);
        setContestTitle(c.title);
        setDuration(c.duration || 120);
      }
    } catch { /* no contest yet */ }
    finally { setLoading(false); }
  };

  const actions = [
    { label: "Start Contest", icon: Play, action: "start", variant: "default", className: "bg-emerald-600 hover:bg-emerald-500 text-white", disabled: contestStatus === "live" },
    { label: "Pause Contest", icon: Pause, action: "pause", variant: "outline", className: "border-amber-500/50 text-amber-400 hover:bg-amber-500/10", disabled: contestStatus !== "live" },
    { label: "End Contest", icon: Square, action: "end", variant: "outline", className: "border-red-500/50 text-red-400 hover:bg-red-500/10", disabled: contestStatus === "ended" },
    { label: "Reset Contest", icon: RotateCcw, action: "reset", variant: "outline", className: "border-slate-500/50 text-slate-400 hover:bg-slate-500/10" },
  ];

  const handleConfirm = async () => {
    if (!contest) { toast.error("No contest exists. Create one first."); return; }
    try {
      if (confirmAction === "start") {
        await contestService.start(contest._id);
        setContestStatus("live"); resume();
        toast.success("Contest started");
      } else if (confirmAction === "pause") {
        await contestService.pause(contest._id);
        setContestStatus("paused"); pause();
        toast.info("Contest paused");
      } else if (confirmAction === "end") {
        await contestService.end(contest._id);
        setContestStatus("ended"); pause();
        toast.warning("Contest ended");
      } else if (confirmAction === "reset") {
        setContestStatus("upcoming"); reset(7200);
        toast.success("Contest reset (local only)");
      }
      fetchContest();
    } catch (err) { toast.error(err.response?.data?.message || "Action failed"); }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      if (contest) {
        await contestService.update(contest._id, { title: contestTitle, duration });
        toast.success("Configuration saved");
      } else {
        // Create new contest with all questions
        const qRes = await questionService.getAll();
        const questionIds = qRes.data.map(q => q._id);
        const res = await contestService.create({
          title: contestTitle,
          duration,
          questions: questionIds,
          status: "upcoming",
        });
        setContest(res.data);
        toast.success("Contest created!");
      }
      fetchContest();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const statusColors = { live: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", paused: "text-amber-400 bg-amber-400/10 border-amber-400/30", ended: "text-red-400 bg-red-400/10 border-red-400/30", upcoming: "text-blue-400 bg-blue-400/10 border-blue-400/30" };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Contest Control" description="Manage the active contest state" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card">
          <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Gamepad2 className="size-4 text-primary" /> Contest Status</CardTitle></CardHeader>
          <CardContent>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-lg font-bold ${statusColors[contestStatus] || statusColors.upcoming}`}>
              {contestStatus === "live" && <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />}
              {contestStatus.toUpperCase()}
            </div>
            {contest && <p className="text-sm text-muted-foreground mt-2">{contest.title} • {contest.participants?.length || 0} participants</p>}
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

      <Card className="border-border/50 bg-card">
        <CardHeader><CardTitle className="text-base font-semibold">Contest Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Contest Name</Label><Input value={contestTitle} onChange={(e) => setContestTitle(e.target.value)} className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Duration (minutes)</Label><Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="bg-muted/50" /></div>
          </div>
          <Button onClick={handleSaveConfig} disabled={saving} className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-0">
            {saving ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Saving...</> : contest ? "Save Configuration" : "Create Contest"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2 text-red-400"><AlertTriangle className="size-4" /> Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20">
            <div><p className="text-sm font-medium">Force End Contest</p><p className="text-xs text-muted-foreground">Immediately end the contest for all participants</p></div>
            <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => setConfirmAction("end")}>Force End</Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)} title={`${confirmAction?.charAt(0).toUpperCase()}${confirmAction?.slice(1) || ""} Contest`} description={`Are you sure you want to ${confirmAction} the contest? This will affect all participants.`} confirmText={`${confirmAction?.charAt(0).toUpperCase()}${confirmAction?.slice(1) || ""}`} destructive={confirmAction === "end" || confirmAction === "reset"} onConfirm={handleConfirm} />
    </div>
  );
}
