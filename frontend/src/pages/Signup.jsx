import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created");
      navigate("/complete-profile", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur"
      >
        <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Password (min 6)</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
