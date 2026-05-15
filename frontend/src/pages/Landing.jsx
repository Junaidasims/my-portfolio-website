import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800/80 px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-display text-lg font-semibold text-white">
            Portfolio<span className="text-cyan-400">.</span>
          </span>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Portfolio platform
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Build and share your portfolio
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Sign up to create your profile, projects, skills, and resume — all
            stored securely under your account.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex rounded-xl border border-slate-600 px-8 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              I have an account
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
