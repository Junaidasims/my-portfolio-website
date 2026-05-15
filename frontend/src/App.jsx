import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import LoadingSpinner from "./components/ui/LoadingSpinner.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

function HomeGate() {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Loading…" />
      </div>
    );
  }
  if (!user) return <Landing />;
  if (!user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }
  return <PortfolioPage mode="owner" />;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/u/:userId" element={<PortfolioPage mode="public" />} />
      <Route path="/" element={<HomeGate />} />
    </Routes>
  );
}
