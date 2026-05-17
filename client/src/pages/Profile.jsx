import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { submissionService } from "@/services/submissionService";

export default function Profile() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionService.getUserSubmissions()
      .then(res => setSubmissions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const accepted = submissions.filter(s => s.status === "Accepted").length;
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 flex items-center gap-6">
          <div className="h-24 w-24 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 text-3xl font-bold">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-zinc-400">{user?.college}</p>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-indigo-400">{user?.solvedProblems?.length || 0}</div>
            <div className="text-sm text-zinc-400 mt-2">Problems Solved</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400">{user?.score || 0}</div>
            <div className="text-sm text-zinc-400 mt-2">Total Score</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-amber-400">{submissions.length}</div>
            <div className="text-sm text-zinc-400 mt-2">Total Submissions</div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
          {loading ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : submissions.length === 0 ? (
            <p className="text-zinc-500 text-sm">No submissions yet.</p>
          ) : (
            <div className="space-y-2">
              {submissions.slice(0, 10).map(s => (
                <div key={s._id} className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
                  <div>
                    <span className="font-medium text-sm">{s.questionId?.title || "Unknown"}</span>
                    <span className="ml-3 text-xs text-zinc-500">{s.language}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${s.status === "Accepted" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {s.status}
                    </span>
                    <span className="text-xs text-zinc-500">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
