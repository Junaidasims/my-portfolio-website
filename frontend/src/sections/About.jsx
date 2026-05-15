import { motion } from "framer-motion";
import Section, { SectionTitle } from "../components/ui/Section.jsx";

function Block({ title, children }) {
  if (!children) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-xl backdrop-blur"
    >
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      <div className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-300">
        {children}
      </div>
    </motion.div>
  );
}

export default function About({ user }) {
  const bio = user?.bio?.trim();
  const education = user?.education?.trim();
  const careerGoals = user?.careerGoals?.trim();
  const techInterests = user?.techInterests?.trim();
  const blocks = [
    ["Bio", bio],
    ["Education", education],
    ["Career goals", careerGoals],
    ["Tech interests", techInterests],
  ].filter(([, content]) => Boolean(content));

  return (
    <Section id="about">
      <SectionTitle
        eyebrow="About"
        title="About"
        subtitle="Information from your profile."
      />
      {blocks.length === 0 ? (
        <p className="text-center text-slate-500">
          No about content yet. Add details from your dashboard.
        </p>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          {blocks.map(([title, content]) => (
            <Block key={title} title={title}>
              {content}
            </Block>
          ))}
        </div>
      )}
    </Section>
  );
}
