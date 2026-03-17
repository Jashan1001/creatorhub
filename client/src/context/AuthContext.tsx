import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "@/lib/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = (newToken: string, newUser: User) => {
    localStorage.setItem("cf_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.token && res.data?.user) {
      setSession(res.data.token, res.data.user);
    }
  };

  const signup = async (name: string, username: string, email: string, password: string) => {
    const res = await api.post("/auth/signup", { name, username, email, password });
    if (res.data?.token && res.data?.user) {
      setSession(res.data.token, res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("cf_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("cf_token");
    if (!stored) { setLoading(false); return; }
    setToken(stored);
    api.get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

