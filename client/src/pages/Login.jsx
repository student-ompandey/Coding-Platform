import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("All fields are required"); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : "/contest");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to CodeArena</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="user@college.edu" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors">
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm text-zinc-400">
            Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
