import { motion } from "framer-motion";

export default function Section({ id, children, className = "" }) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-16 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-12 text-center md:mb-16"
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">{subtitle}</p>
      )}
    </motion.div>
  );
}
