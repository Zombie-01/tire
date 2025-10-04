"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
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
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        hasSeenOnboarding: true,
      };
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

  // Initialize session and listen for auth state changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
          } else if (userData) {
            dispatch({
              type: "LOGIN",
              payload: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
              },
            });
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      }
    };

    initializeAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user data on sign-in:", error);
          } else if (userData) {
            dispatch({
              type: "LOGIN",
              payload: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
              },
            });
          }
        } else if (event === "SIGNED_OUT") {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    return () => {
    };
  }, []);

  // Supabase login
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
      return true;
    } catch (err) {
      console.error("Unexpected error during login:", err);
      return false;
    }
  };

  // Supabase register
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            name,
            email,
            role: "user",
          },
        ]);
        if (insertError) {
          console.error("Error inserting user profile:", insertError);
        }
      }
      return { success: true };
    } catch (err) {
      console.error("Unexpected error during registration:", err);
      return { success: false, error: "Unexpected error occurred" };
    }
  };

  // Supabase logout
  const logout = () => {
    try {
      supabase.auth.signOut();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
