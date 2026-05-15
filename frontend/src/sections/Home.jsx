import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Home({
  user,
  mode,
  onDownloadResume,
  profileImageSrc,
}) {
  const hasResume = Boolean(user?.hasResume);
  const name = user?.name?.trim() || "";
  const role = user?.role?.trim() || "";
  const shortDescription = user?.shortDescription?.trim() || "";

  const handleDownload = async () => {
    try {
      await onDownloadResume();
      toast.success("Download started");
    } catch {
      toast.error("Could not download resume");
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] scroll-mt-24 flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-violet-600/40 via-fuchsia-500/20 to-transparent blur-3xl"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full bg-gradient-to-tl from-cyan-500/35 via-blue-600/20 to-transparent blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Hello, I&apos;m
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {name || "—"}
          </h1>
          {role && (
            <p className="mt-2 text-xl font-medium text-violet-300 sm:text-2xl">{role}</p>
          )}
          {shortDescription && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              {shortDescription}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-95"
            >
              View Projects
            </a>
            {hasResume ? (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-slate-500 hover:bg-slate-800"
              >
                Download Resume
              </button>
            ) : mode === "owner" ? (
              <Link
                to="/dashboard#resume"
                className="inline-flex items-center justify-center rounded-xl border border-amber-500/40 bg-amber-950/30 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-950/50"
              >
                Upload Resume
              </Link>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/50 to-violet-600/50 opacity-60 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur">
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt=""
                  className="h-72 w-72 rounded-2xl object-cover sm:h-80 sm:w-80"
                  width={320}
                  height={320}
                />
              ) : (
                <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-slate-800 text-6xl font-bold text-slate-600 sm:h-80 sm:w-80">
                  {name ? name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
