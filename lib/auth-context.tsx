'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'COMPLETE_ONBOARDING' };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => boolean;
  logout: () => void;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        hasSeenOnboarding: true
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    hasSeenOnboarding: false
  });

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';
    if (hasSeenOnboarding) {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
    }

    // Check for saved login
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Static login - demo purposes
    if (email === 'admin@example.com' && password === 'admin123') {
      const user = {
        id: '1',
        name: 'Админ',
        email: 'admin@example.com',
        role: 'admin' as const
      };
      dispatch({ type: 'LOGIN', payload: user });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } else if (email === 'user@example.com' && password === 'user123') {
      const user = {
        id: '2',
        name: 'Хэрэглэгч',
        email: 'user@example.com',
        role: 'user' as const
      };
      dispatch({ type: 'LOGIN', payload: user });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}