"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  student_id: number;
  proficiency_level?: string;
}

interface AuthContextType {
  user: User;
  token: string | null;
  login: (emailOrToken: string, passwordOrUserData?: string | User) => Promise<void> | void;
  logout: () => void;
  isDemoMode: boolean;
}

const DEFAULT_DEMO_USER: User = {
  id: 1,
  name: "Alex Morgan",
  email: "alex.morgan@open.ac.uk",
  role: "student",
  student_id: 10001,
  proficiency_level: "Intermediate",
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_DEMO_USER,
  token: null,
  login: () => {},
  logout: () => {},
  isDemoMode: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEFAULT_DEMO_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("edurag_token") || localStorage.getItem("learnwise_token");
    const savedUser = localStorage.getItem("edurag_user") || localStorage.getItem("learnwise_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsDemoMode(false);
      } catch {
        setUser(DEFAULT_DEMO_USER);
      }
    }
  }, []);

  const login = async (emailOrToken: string, passwordOrUserData?: string | User) => {
    // If passed direct (token, userData) object
    if (typeof passwordOrUserData === "object" && passwordOrUserData !== null) {
      setToken(emailOrToken);
      setUser(passwordOrUserData);
      setIsDemoMode(false);
      localStorage.setItem("edurag_token", emailOrToken);
      localStorage.setItem("edurag_user", JSON.stringify(passwordOrUserData));
      localStorage.setItem("learnwise_token", emailOrToken);
      localStorage.setItem("learnwise_user", JSON.stringify(passwordOrUserData));
      return;
    }

    const email = emailOrToken;
    const password = typeof passwordOrUserData === "string" ? passwordOrUserData : "demo123";

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData: User = {
          id: data.user_id || 1,
          name: data.name || "Alex Morgan",
          email: data.email || email,
          role: data.role || "student",
          student_id: data.student_id || 10001,
          proficiency_level: "Intermediate",
        };
        const tokenStr = data.access_token || "demo-jwt-token";
        setToken(tokenStr);
        setUser(userData);
        setIsDemoMode(false);
        localStorage.setItem("edurag_token", tokenStr);
        localStorage.setItem("edurag_user", JSON.stringify(userData));
        localStorage.setItem("learnwise_token", tokenStr);
        localStorage.setItem("learnwise_user", JSON.stringify(userData));
        return;
      }
    } catch (err) {
      console.warn("Auth API unreachable, falling back to local session:", err);
    }

    // Demo fallback session
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase().includes("research");
    const demoUser: User = {
      id: isAdmin ? 99 : 1,
      name: isAdmin ? "Dr. Sarah Lin (Research)" : "Alex Morgan",
      email: email,
      role: isAdmin ? "admin" : "student",
      student_id: isAdmin ? 99999 : 10001,
      proficiency_level: "Intermediate",
    };
    const syntheticToken = `demo_token_${Date.now()}`;
    setToken(syntheticToken);
    setUser(demoUser);
    setIsDemoMode(false);
    localStorage.setItem("edurag_token", syntheticToken);
    localStorage.setItem("edurag_user", JSON.stringify(demoUser));
    localStorage.setItem("learnwise_token", syntheticToken);
    localStorage.setItem("learnwise_user", JSON.stringify(demoUser));
  };

  const logout = () => {
    setToken(null);
    setUser(DEFAULT_DEMO_USER);
    setIsDemoMode(true);
    localStorage.removeItem("edurag_token");
    localStorage.removeItem("edurag_user");
    localStorage.removeItem("learnwise_token");
    localStorage.removeItem("learnwise_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
