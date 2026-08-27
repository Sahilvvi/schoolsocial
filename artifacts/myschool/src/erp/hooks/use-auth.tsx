import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth as useMainAuth } from "@/hooks/useAuth";
import { getDemoUser } from "@/data/dummyData";
import type { UserProfile } from "@/erp/api-client";
import { toSchoolIdNumber } from "@/lib/erpData";

interface AuthContextType {
  user: UserProfile | null | undefined;
  token: string | null;
  isLoading: boolean;
  login: (data: { identifier: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapMainUserToErp(mainUser: NonNullable<ReturnType<typeof useMainAuth>["user"]>): UserProfile {
  const role = String(mainUser.user_metadata?.role || "parent");
  const name = String(mainUser.user_metadata?.full_name || mainUser.email || "User");
  const roleMap: Record<string, UserProfile["role"]> = {
    admin: "super_admin",
    school: "school_admin",
    parent: "parent",
    teacher: "teacher",
    tuition_center: "school_admin",
  };

  // Stable numeric id derived from the main user id.
  const numericId = Number(String(mainUser.id).replace(/\D/g, "").slice(0, 9)) || 99;

  let schoolId: number | undefined;
  if (role === "school" || role === "tuition_center") schoolId = 1;
  else if (role === "parent" || role === "teacher") schoolId = 1;
  if (mainUser.user_metadata?.school_id) {
    schoolId = toSchoolIdNumber(mainUser.user_metadata.school_id) ?? schoolId;
  }

  return {
    id: numericId,
    name,
    email: mainUser.email || undefined,
    role: roleMap[role] || (role as UserProfile["role"]),
    schoolId,
    avatarUrl: undefined,
    createdAt: mainUser.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: mainUser, session, loading, signIn, signOut } = useMainAuth();
  const [, setLocation] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const token = session?.access_token || localStorage.getItem("myschool_token");

  const user = useMemo(() => (mainUser ? mapMainUserToErp(mainUser) : null), [mainUser]);

  const login = async (data: { identifier: string; password: string; role?: string }) => {
    const { error } = await signIn(data.identifier, data.password);
    if (error) {
      throw new Error(error.message || "Invalid credentials");
    }
    const demo = getDemoUser(data.identifier);
    if (demo) {
      localStorage.setItem("myschool_token", `demo-token-${demo.id}`);
    } else if (session?.access_token) {
      localStorage.setItem("myschool_token", session.access_token);
    }
  };

  const logout = () => {
    signOut();
    localStorage.removeItem("myschool_token");
    window.location.href = "/";
  };

  // Redirect to the ERP dashboard once the user is loaded and we have a profile.
  useEffect(() => {
    if (!mounted || loading) return;
    if (user) {
      const loc = window.location.pathname;
      if (loc === "/erp" || loc === "/erp/" || loc === "/erp/login") {
        if (user.role === "super_admin") setLocation("/super-admin");
        else if (user.role === "school_admin") setLocation("/school-admin");
        else if (user.role === "teacher") setLocation("/teacher");
        else if (user.role === "parent") setLocation("/parent");
        else if (user.role === "student") setLocation("/student");
        else setLocation("/school-admin");
      }
    }
  }, [mounted, loading, user, setLocation]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading: loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
