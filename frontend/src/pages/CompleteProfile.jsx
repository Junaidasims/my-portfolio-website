import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CompleteProfile() {
  const { refreshUser, user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    shortDescription: "",
    bio: "",
    education: "",
    careerGoals: "",
    techInterests: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      role: user.role || "",
      shortDescription: user.shortDescription || "",
      bio: user.bio || "",
      education: user.education || "",
      careerGoals: user.careerGoals || "",
      techInterests: user.techInterests || "",
    });
  }, [user]);

  if (user?.profileCompleted) {
    return <Navigate to="/" replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/me/complete-profile", form);
      if (data.success) {
        toast.success("Portfolio profile saved");
        await refreshUser();
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Could not save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur md:p-10"
      >
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              logout();
              toast.success("Signed out");
            }}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Sign out
          </button>
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Step 1
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Complete your portfolio
        </h1>
        <p className="mt-3 text-slate-400">
          Add the headline details visitors see first. You can refine everything later
          in your dashboard.
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">Full name *</span>
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">Role / title *</span>
              <input
                name="role"
                required
                value={form.role}
                onChange={onChange}
                placeholder="e.g. Full Stack Developer"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">
                Short description *{" "}
              </span>
              <textarea
                name="shortDescription"
                required
                rows={3}
                value={form.shortDescription}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">Bio</span>
              <textarea
                name="bio"
                rows={4}
                value={form.bio}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">Education</span>
              <textarea
                name="education"
                rows={3}
                value={form.education}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">Career goals</span>
              <textarea
                name="careerGoals"
                rows={3}
                value={form.careerGoals}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-slate-400">Tech interests</span>
              <textarea
                name="techInterests"
                rows={3}
                value={form.techInterests}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save and continue"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
