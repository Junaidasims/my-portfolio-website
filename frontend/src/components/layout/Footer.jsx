import { motion } from "framer-motion";

export default function Footer({ ownerName }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 py-10 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500"
        >
          © {year}
          {ownerName ? ` ${ownerName}.` : ""} Portfolio platform — React, Vite & Express.
        </motion.p>
      </div>
    </footer>
  );
}
