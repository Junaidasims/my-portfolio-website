import { motion } from "framer-motion";
import Section, { SectionTitle } from "../components/ui/Section.jsx";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Skills({ skills }) {
  const list = Array.isArray(skills) ? skills : [];

  return (
    <Section id="skills" className="bg-slate-900/20">
      <SectionTitle
        eyebrow="Skills"
        title="Skills"
        subtitle="Skill levels you manage in your dashboard."
      />
      {list.length === 0 ? (
        <p className="text-center text-slate-500">
          No skills added yet. Add skills from your dashboard.
        </p>
      ) : (
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((s) => (
            <motion.li
              key={s._id}
              variants={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg backdrop-blur transition hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-100">{s.skillName}</span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  {s.level}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </Section>
  );
}
