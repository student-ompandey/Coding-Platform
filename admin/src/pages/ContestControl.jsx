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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    fetchContest(); 
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await questionService.getAll();
      setAllQuestions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  const fetchContest = async () => {
    try {
      const res = await contestService.getAll();
      if (res.data.length > 0) {
        const c = res.data[0];
        setContest(c);
        setContestStatus(c.status);
        setContestTitle(c.title);
        setDuration(c.duration || 120);
        setStartTime(c.startTime ? new Date(c.startTime).toISOString().slice(0, 16) : "");
        setEndTime(c.endTime ? new Date(c.endTime).toISOString().slice(0, 16) : "");
        setSelectedQuestions(c.questions?.map(q => typeof q === 'object' ? (q._id || q.id) : q) || []);
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
        await contestService.update(contest._id, { 
          title: contestTitle, 
          duration,
          startTime,
          endTime,
          questions: selectedQuestions
        });
        toast.success("Configuration saved");
      } else {
        // Create new contest
        const res = await contestService.create({
          title: contestTitle,
          duration,
          startTime,
          endTime,
          questions: selectedQuestions,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2"><Label className="text-muted-foreground font-semibold tracking-wider text-[10px] uppercase">Contest Name</Label><Input value={contestTitle} onChange={(e) => setContestTitle(e.target.value)} className="bg-background border-border/50 h-10 font-medium" /></div>
            <div className="space-y-2"><Label className="text-muted-foreground font-semibold tracking-wider text-[10px] uppercase">Duration (minutes)</Label><Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="bg-background border-border/50 h-10 font-medium" /></div>
            <div className="space-y-2"><Label className="text-muted-foreground font-semibold tracking-wider text-[10px] uppercase">Start Time</Label><Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-background border-border/50 h-10 font-medium" /></div>
            <div className="space-y-2"><Label className="text-muted-foreground font-semibold tracking-wider text-[10px] uppercase">End Time</Label><Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-background border-border/50 h-10 font-medium" /></div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label className="text-muted-foreground font-semibold tracking-wider text-[10px] uppercase">Select Questions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-3 border border-border/50 rounded-xl bg-background/50 backdrop-blur-sm shadow-inner">
              {allQuestions.map(q => (
                <div key={q._id} className="flex items-start space-x-3 bg-card p-3 rounded-lg border border-border/60 hover:border-cyan-500/30 transition-colors shadow-sm group">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      id={`q-${q._id}`}
                      className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500/50 bg-background size-4.5 cursor-pointer accent-cyan-500"
                      checked={selectedQuestions.includes(q._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedQuestions([...selectedQuestions, q._id]);
                        } else {
                          setSelectedQuestions(selectedQuestions.filter(id => id !== q._id));
                        }
                      }}
                    />
                  </div>
                  <Label htmlFor={`q-${q._id}`} className="text-sm font-semibold leading-tight cursor-pointer flex-1 group-hover:text-cyan-400 transition-colors">
                    {q.title} 
                    <span className={`block mt-1 text-[10px] font-bold tracking-wider uppercase ${q.difficulty === 'Easy' ? 'text-emerald-400' : q.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                      {q.difficulty} • {q.points || 10} pts
                    </span>
                  </Label>
                </div>
              ))}
              {allQuestions.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8 bg-card rounded-lg border border-dashed border-border/50">No questions available in the database.</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSaveConfig} disabled={saving} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold tracking-wide px-8 h-11 transition-all hover:scale-[1.02]">
              {saving ? <><Loader2 className="size-4 mr-2 animate-spin" /> Saving Changes...</> : contest ? "Update Configuration" : "Initialize Contest"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-3xl -mr-10 -mt-10 rounded-full" />
        <CardHeader><CardTitle className="text-lg font-bold flex items-center gap-2 text-red-400 relative z-10"><AlertTriangle className="size-5" /> Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/30 bg-red-950/40 backdrop-blur-sm">
            <div>
              <p className="text-sm font-bold text-red-200">Force End Contest</p>
              <p className="text-xs text-red-300/70 mt-1">Immediately end the live contest and close all submissions. This action cannot be undone.</p>
            </div>
            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide shadow-[0_0_10px_rgba(239,68,68,0.4)]" onClick={() => setConfirmAction("end")}>Force End</Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)} title={`${confirmAction?.charAt(0).toUpperCase()}${confirmAction?.slice(1) || ""} Contest`} description={`Are you sure you want to ${confirmAction} the contest? This will affect all participants.`} confirmText={`${confirmAction?.charAt(0).toUpperCase()}${confirmAction?.slice(1) || ""}`} destructive={confirmAction === "end" || confirmAction === "reset"} onConfirm={handleConfirm} />
    </div>
  );
}
