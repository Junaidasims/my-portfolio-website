import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api, getToken, assetUrl } from "../lib/api.js";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Home from "../sections/Home.jsx";
import About from "../sections/About.jsx";
import Skills from "../sections/Skills.jsx";
import Projects from "../sections/Projects.jsx";
import Contact from "../sections/Contact.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PortfolioPage({ mode }) {
  const { userId: routeUserId } = useParams();
  const publicUserId = mode === "public" ? routeUserId : undefined;
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === "owner") {
        const { data } = await api.get("/api/users/me/portfolio");
        if (data.success) setBundle(data.data);
        else setError(data.message || "Failed to load portfolio");
      } else {
        const { data } = await api.get(`/api/public/portfolio/${publicUserId}`);
        if (data.success) setBundle(data.data);
        else setError(data.message || "Portfolio not found");
      }
    } catch (e) {
      setError(
        e.response?.data?.message || e.message || "Could not load portfolio"
      );
    } finally {
      setLoading(false);
    }
  }, [mode, publicUserId]);

  useEffect(() => {
    load();
  }, [load]);

  const user = bundle?.user;
  const skills = bundle?.skills ?? [];
  const projects = bundle?.projects ?? [];
  const recipientId = mode === "public" ? publicUserId : null;

  const downloadPublicResume = async () => {
    const res = await fetch(
      `${baseURL}/api/public/resume/${publicUserId}`,
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Could not download resume");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadOwnerResume = async () => {
    const res = await fetch(`${baseURL}/api/users/me/resume`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Could not download resume");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar portfolioActive showContactNav={mode === "public"} mode={mode} />
      <main>
        {loading && (
          <div className="py-24">
            <LoadingSpinner label="Loading portfolio…" />
          </div>
        )}
        {!loading && error && (
          <div className="mx-auto max-w-lg px-4 py-24 text-center">
            <p className="text-red-300">{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-4 text-cyan-400 underline"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && user && (
          <>
            <Home
              user={user}
              mode={mode}
              onDownloadResume={
                mode === "owner" ? downloadOwnerResume : downloadPublicResume
              }
              profileImageSrc={
                user.profileImage ? assetUrl(user.profileImage) : ""
              }
            />
            <About user={user} />
            <Skills skills={skills} />
            <Projects projects={projects} />
            {(user.contactEmail || user.linkedInUrl) && (
              <Contact user={user} />
            )}
          </>
        )}
      </main>
      <Footer ownerName={user?.name} />
    </>
  );
}
