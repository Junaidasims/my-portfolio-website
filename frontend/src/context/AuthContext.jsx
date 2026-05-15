import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getToken, setToken } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return null;
    }
    const { data } = await api.get("/api/users/me");
    if (data.success) {
      setUser(data.data);
      return data.data;
    }
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (getToken()) await refreshUser();
        else setUser(null);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/api/auth/login", { email, password });
      if (!data.success) throw new Error(data.message || "Login failed");
      setToken(data.data.token);
      setUser(data.data.user);
      return data.data.user;
    },
    []
  );

  const signup = useCallback(async (name, email, password) => {
    const { data } = await api.post("/api/auth/signup", {
      name,
      email,
      password,
    });
    if (!data.success) throw new Error(data.message || "Signup failed");
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      login,
      signup,
      logout,
      refreshUser,
      setUser,
    }),
    [user, initializing, login, signup, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
