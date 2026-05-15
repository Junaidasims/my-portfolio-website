import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api, assetUrl } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Dashboard() {
  const { user, refreshUser, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    shortDescription: "",
    bio: "",
    education: "",
    careerGoals: "",
    techInterests: "",
    contactEmail: "",
    linkedInUrl: "",
  });
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillForm, setSkillForm] = useState({ skillName: "", level: "Intermediate" });
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    image: "",
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [meRes, skillsRes, projRes] = await Promise.all([
        api.get("/api/users/me"),
        api.get("/api/skills"),
        api.get("/api/projects"),
      ]);
      const u = meRes.data.data;
      setProfile({
        name: u.name || "",
        role: u.role || "",
        shortDescription: u.shortDescription || "",
        bio: u.bio || "",
        education: u.education || "",
        careerGoals: u.careerGoals || "",
        techInterests: u.techInterests || "",
        contactEmail: u.contactEmail || "",
        linkedInUrl: u.linkedInUrl || "",
      });
      setSkills(skillsRes.data.data || []);
      setProjects(projRes.data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (window.location.hash === "#resume") {
      document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (user && !user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/api/users/me", profile);
      toast.success("Profile updated");
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const onResume = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("PDF only");
      return;
    }
    const fd = new FormData();
    fd.append("resume", file);
    try {
      await api.post("/api/users/me/resume", fd);
      toast.success("Resume uploaded");
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      await api.post("/api/users/me/profile-image", fd);
      toast.success("Profile image updated");
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const saveSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingSkillId) {
        await api.put(`/api/skills/${editingSkillId}`, skillForm);
        toast.success("Skill updated");
      } else {
        await api.post("/api/skills", skillForm);
        toast.success("Skill added");
      }
      setSkillForm({ skillName: "", level: "Intermediate" });
      setEditingSkillId(null);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save skill");
    }
  };

  const editSkill = (s) => {
    setEditingSkillId(s._id);
    setSkillForm({ skillName: s.skillName, level: s.level });
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/api/skills/${id}`);
      toast.success("Deleted");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    const payload = { ...projectForm };
    try {
      if (editingProjectId) {
        await api.put(`/api/projects/${editingProjectId}`, payload);
        toast.success("Project updated");
      } else {
        await api.post("/api/projects", payload);
        toast.success("Project created");
      }
      setProjectForm({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveLink: "",
        image: "",
      });
      setEditingProjectId(null);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save project");
    }
  };

  const editProject = (p) => {
    setEditingProjectId(p._id);
    setProjectForm({
      title: p.title || "",
      description: p.description || "",
      techStack: (p.techStack || []).join(", "),
      githubLink: p.githubLink || "",
      liveLink: p.liveLink || "",
      image: p.image || "",
    });
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      toast.success("Deleted");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">Dashboard</p>
            <h1 className="font-display text-xl font-bold text-white">Edit your portfolio</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              View portfolio
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                toast.success("Signed out");
              }}
              className="rounded-lg border border-red-900/50 px-3 py-2 text-sm text-red-300 hover:bg-red-950/30"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        {user?._id && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
          >
            <p className="text-sm text-slate-400">Share your public portfolio</p>
            <p className="mt-2 break-all font-mono text-sm text-cyan-300">
              {typeof window !== "undefined" &&
                `${window.location.origin}/u/${user._id}`}
            </p>
          </motion.div>
        )}

        <section id="resume" className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Resume (PDF)</h2>
          <p className="mt-2 text-sm text-slate-400">
            Upload a single PDF. It will be available as Download on your portfolio when
            present.
          </p>
          <label className="mt-6 inline-flex cursor-pointer rounded-xl border border-dashed border-slate-600 bg-slate-950/50 px-6 py-4 text-sm text-slate-300 hover:border-cyan-500/50">
            <input type="file" accept="application/pdf" className="hidden" onChange={onResume} />
            Choose PDF file
          </label>
          {user?.resume && (
            <p className="mt-3 text-xs text-emerald-400">Resume on file — visible on your portfolio.</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Profile image</h2>
          <label className="mt-4 inline-flex cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">
            <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            Upload image
          </label>
          {user?.profileImage && (
            <img
              src={assetUrl(user.profileImage)}
              alt=""
              className="mt-4 h-32 w-32 rounded-2xl border border-slate-700 object-cover"
            />
          )}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Profile & about</h2>
          <form onSubmit={saveProfile} className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["name", "Name"],
              ["role", "Role / title"],
              ["shortDescription", "Short description", true],
            ].map(([key, label, full]) => (
              <label key={key} className={full ? "md:col-span-2 block" : "block"}>
                <span className="text-xs text-slate-400">{label}</span>
                {full ? (
                  <textarea
                    name={key}
                    rows={3}
                    value={profile[key]}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className={inputClass}
                  />
                ) : (
                  <input
                    name={key}
                    value={profile[key]}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className={inputClass}
                  />
                )}
              </label>
            ))}
            {[
              ["bio", "Bio"],
              ["education", "Education"],
              ["careerGoals", "Career goals"],
              ["techInterests", "Tech interests"],
            ].map(([key, label]) => (
              <label key={key} className="md:col-span-2 block">
                <span className="text-xs text-slate-400">{label}</span>
                <textarea
                  name={key}
                  rows={3}
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
            ))}
            {[
              ["contactEmail", "Contact Email"],
              ["linkedInUrl", "LinkedIn URL"],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs text-slate-400">{label}</span>
                <input
                  name={key}
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
            ))}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Save profile
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Skills</h2>
          <form onSubmit={saveSkill} className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="sm:col-span-2 block">
              <span className="text-xs text-slate-400">Skill name</span>
              <input
                value={skillForm.skillName}
                onChange={(e) =>
                  setSkillForm((f) => ({ ...f, skillName: e.target.value }))
                }
                required
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Level</span>
              <select
                value={skillForm.level}
                onChange={(e) =>
                  setSkillForm((f) => ({ ...f, level: e.target.value }))
                }
                className={inputClass}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-3">
              <button
                type="submit"
                className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                {editingSkillId ? "Update skill" : "Add skill"}
              </button>
              {editingSkillId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkillId(null);
                    setSkillForm({ skillName: "", level: "Intermediate" });
                  }}
                  className="rounded-xl border border-slate-600 px-5 py-2 text-sm text-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <ul className="mt-8 space-y-2">
            {skills.map((s) => (
              <li
                key={s._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3"
              >
                <span className="text-slate-100">
                  {s.skillName}{" "}
                  <span className="text-cyan-400/90">→ {s.level}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editSkill(s)}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSkill(s._id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Projects</h2>
          <form onSubmit={saveProject} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2 block">
              <span className="text-xs text-slate-400">Title</span>
              <input
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, title: e.target.value }))
                }
                required
                className={inputClass}
              />
            </label>
            <label className="md:col-span-2 block">
              <span className="text-xs text-slate-400">Description</span>
              <textarea
                required
                rows={3}
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, description: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="md:col-span-2 block">
              <span className="text-xs text-slate-400">Tech stack (comma-separated)</span>
              <input
                value={projectForm.techStack}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, techStack: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">GitHub URL</span>
              <input
                value={projectForm.githubLink}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, githubLink: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Live URL</span>
              <input
                value={projectForm.liveLink}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, liveLink: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="md:col-span-2 block">
              <span className="text-xs text-slate-400">Image URL</span>
              <input
                value={projectForm.image}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, image: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white"
              >
                {editingProjectId ? "Update project" : "Add project"}
              </button>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm({
                      title: "",
                      description: "",
                      techStack: "",
                      githubLink: "",
                      liveLink: "",
                      image: "",
                    });
                  }}
                  className="rounded-xl border border-slate-600 px-5 py-2 text-sm text-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <ul className="mt-8 space-y-2">
            {projects.map((p) => (
              <li
                key={p._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3"
              >
                <span className="font-medium text-slate-100">{p.title}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editProject(p)}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(p._id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
