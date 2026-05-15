import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ portfolioActive, showContactNav = true, mode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const showSections = Boolean(portfolioActive);
  const links = showContactNav
    ? navLinks
    : navLinks.filter((l) => l.href !== "#contact");

  const handleNavClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-white"
        >
          Portfolio<span className="text-cyan-400">.</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {showSections &&
            links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          {user ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              {mode === "owner" && (
                <li>
                  <Link
                    to={user?._id ? `/u/${user._id}` : "#"}
                    className="text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    Public link
                  </Link>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-red-500/40 hover:text-red-300"
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800 bg-slate-950 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {showSections &&
                links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={handleNavClick}
                      className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-900"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={handleNavClick}
                      className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-900"
                    >
                      Dashboard
                    </Link>
                  </li>
                  {mode === "owner" && user?._id && (
                    <li>
                      <Link
                        to={`/u/${user._id}`}
                        onClick={handleNavClick}
                        className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-900"
                      >
                        Public link
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        handleNavClick();
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-red-300 hover:bg-slate-900"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={handleNavClick}
                      className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-900"
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      onClick={handleNavClick}
                      className="block rounded-lg px-3 py-2 text-cyan-400 hover:bg-slate-900"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
