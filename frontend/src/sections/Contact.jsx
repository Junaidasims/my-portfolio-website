import { motion } from "framer-motion";
import Section, { SectionTitle } from "../components/ui/Section.jsx";

export default function Contact({ user }) {
  if (!user?.contactEmail && !user?.linkedInUrl) return null;

  return (
    <Section id="contact" className="bg-slate-900/20">
      <SectionTitle
        eyebrow="Contact"
        title="Let's talk"
        subtitle="Reach out to me."
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl backdrop-blur text-center"
      >
        {user.contactEmail && (
          <p className="text-lg text-slate-300 mb-4">
            Email me at:{" "}
            <a
              href={`mailto:${user.contactEmail}`}
              className="font-medium text-cyan-400 hover:text-cyan-300 transition"
            >
              {user.contactEmail}
            </a>
          </p>
        )}
        {user.linkedInUrl && (
          <p className="text-lg text-slate-300">
            Connect with me on{" "}
            <a
              href={user.linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-cyan-400 hover:text-cyan-300 transition"
            >
              LinkedIn
            </a>
          </p>
        )}
      </motion.div>
    </Section>
  );
}
