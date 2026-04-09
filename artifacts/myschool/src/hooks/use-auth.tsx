import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { UserProfile, useGetMe, useLogin, LoginRequestRole } from "@workspace/api-client-react";

interface AuthContextType {
  user: UserProfile | null | undefined;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("myschool_token"));
  const [, setLocation] = useLocation();

  const { data: user, isLoading: isUserLoading, refetch } = useGetMe({
    query: { enabled: !!token, retry: false }
  });

  const loginMutation = useLogin();

  const login = async (data: any) => {
    try {
      const response = await loginMutation.mutateAsync({ data });
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem("myschool_token", newToken);
      await refetch();
      
      // Route based on role
      const role = response.user.role;
      if (role === LoginRequestRole.super_admin) setLocation("/super-admin");
      else if (role === LoginRequestRole.school_admin) setLocation("/school-admin");
      else if (role === LoginRequestRole.teacher) setLocation("/teacher");
      else if (role === LoginRequestRole.parent) setLocation("/parent");
      else if (role === LoginRequestRole.student) setLocation("/student");
      else if (role === LoginRequestRole.job_seeker) setLocation("/career");
      else setLocation("/");
      
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("myschool_token");
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading: isUserLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
