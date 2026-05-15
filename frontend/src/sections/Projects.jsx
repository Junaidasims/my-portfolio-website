import { motion } from "framer-motion";
import Section, { SectionTitle } from "../components/ui/Section.jsx";

export default function Projects({ projects, onRetry }) {
  const list = Array.isArray(projects) ? projects : [];

  return (
    <Section id="projects">
      <SectionTitle
        eyebrow="Projects"
        title="Projects"
        subtitle="Projects you manage from your dashboard."
      />

      {list.length === 0 ? (
        <p className="text-center text-slate-500">
          No projects yet. Add projects from your dashboard.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {list.map((p, i) => (
            <motion.article
              key={p._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur transition hover:border-cyan-500/30 hover:shadow-cyan-500/10"
            >
              <div className="aspect-video overflow-hidden bg-slate-800">
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    No image URL
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-400">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(p.techStack || []).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-700 bg-slate-950/80 px-2 py-0.5 text-xs text-cyan-200/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.githubLink && (
                    <a
                      href={p.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {p.liveLink && (
                    <a
                      href={p.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                      Live demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </Section>
  );
}
