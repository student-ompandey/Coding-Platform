import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !college || !password) { toast.error("All fields are required"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register({ name, email, college, password });
      toast.success("Registration successful!");
      navigate("/contest");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Join CodeArena</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-400">College</label>
            <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="University Name" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="user@college.edu" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors">
            {loading ? "Creating account..." : "Register"}
          </button>
          <p className="text-center text-sm text-zinc-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
