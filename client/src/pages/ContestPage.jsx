import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { contestService } from "@/services/contestService";
import { toast } from "sonner";

export default function ContestPage() {
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetchContest();
  }, []);

  useEffect(() => {
    if (!contest?.endTime) return;
    const interval = setInterval(() => {
      const end = new Date(contest.endTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const fetchContest = async () => {
    try {
      const res = await contestService.getActive();
      setContest(res.data);
    } catch {
      setContest(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await contestService.join(contest._id);
      toast.success("Joined contest!");
      fetchContest();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading contest...</div>;

  if (!contest) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">No Active Contest</h2>
        <p className="text-zinc-400">Check back later for upcoming contests.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{contest.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Problems</h2>
              <div className="space-y-2">
                {contest.questions?.map((q, i) => (
                  <div key={q._id} className="flex items-center justify-between p-4 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div>
                      <span className="font-medium">{i + 1}. {q.title}</span>
                      <span className={`ml-3 text-xs px-2 py-0.5 rounded ${q.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : q.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{q.difficulty}</span>
                      <span className="ml-2 text-xs text-zinc-500">{q.points} pts</span>
                    </div>
                    <button onClick={() => navigate(`/problem/${q._id}`)} className="text-sm bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded hover:bg-indigo-600 hover:text-white transition-colors">
                      Solve
                    </button>
                  </div>
                ))}
                {(!contest.questions || contest.questions.length === 0) && (
                  <p className="text-zinc-500 text-sm">No problems added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contest Status</h2>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${contest.status === "live" ? "bg-green-500/20 text-green-400" : contest.status === "ended" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {contest.status === "live" && <span className="size-2 rounded-full bg-green-400 animate-pulse" />}
                {contest.status.toUpperCase()}
              </div>
              {contest.status === "live" && timeLeft && (
                <>
                  <div className="text-3xl font-bold text-indigo-400 mb-2">{timeLeft}</div>
                  <p className="text-zinc-400 text-sm">Time Remaining</p>
                </>
              )}
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-400 mb-3">Participants: {contest.participants?.length || 0}</p>
              <button onClick={handleJoin} disabled={joining} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors">
                {joining ? "Joining..." : "Join Contest"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
