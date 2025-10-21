"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { supabase } from "./supabase";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "COMPLETE_ONBOARDING" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    case "COMPLETE_ONBOARDING":
      return { ...state, hasSeenOnboarding: true };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    hasSeenOnboarding: false,
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Centralized fetch function
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    return data as User;
  };

  // 🔹 Initialize auth and handle rehydration
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const userData = await fetchUserProfile(session.user.id);
          if (userData) {
            dispatch({ type: "LOGIN", payload: userData });
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 🔹 Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth change:", event);
      if (event === "SIGNED_IN" && session?.user) {
        const userData = await fetchUserProfile(session.user.id);
        if (userData) {
          dispatch({ type: "LOGIN", payload: userData });
        }
      } else if (event === "SIGNED_OUT") {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🔹 Supabase login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Login error:", error);
        return false;
      }
      return true; // Auth listener will handle updating state
    } catch (err) {
      console.error("Unexpected error during login:", err);
      return false;
    }
  };

  // 🔹 Supabase register
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return { success: false, error: error.message };

      if (data.user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            name,
            email,
            role: "user",
          },
        ]);
        if (insertError)
          console.error("Error inserting user profile:", insertError);
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected registration error:", err);
      return { success: false, error: "Unexpected error occurred" };
    }
  };

  // 🔹 Supabase logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, dispatch, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
