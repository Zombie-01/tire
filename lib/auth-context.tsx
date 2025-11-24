"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// Auth no longer talks to Supabase directly from the client.
// Use server endpoints under `/api/auth/*` instead.

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: any; // Supabase session user
  profile: UserProfile | null; // Full profile from "users" table
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null); // Supabase user object
  const [profile, setProfile] = useState<UserProfile | null>(null); // Profile from DB
  const [loading, setLoading] = useState(true);

  const fetchSessionAndProfile = async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) return { session: null, profile: null };
      return await res.json();
    } catch (err) {
      console.error(err);
      return { session: null, profile: null };
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { session, profile } = await fetchSessionAndProfile();
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        setProfile(profile ?? null);
      }
      setLoading(false);
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const { session } = await res.json();
      if (session?.user) {
        setUser(session.user);
        // refresh profile
        const sp = await fetchSessionAndProfile();
        setProfile(sp.profile ?? null);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { success: false, error: body?.error };
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Unexpected error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
