import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

export default function GuestRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    if (!user.profileCompleted) {
      return <Navigate to="/complete-profile" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
