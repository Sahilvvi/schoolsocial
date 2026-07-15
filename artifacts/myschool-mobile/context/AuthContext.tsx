import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEMO_USERS } from "../lib/shared-data";

interface User {
  id: string;
  email: string;
  name: string;
  role: "parent" | "school" | "teacher" | "admin" | "tuition" | "tuition_center";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type MobileRole = User["role"];

function sharedRoleToMobileRole(role: string): MobileRole {
  if (role === "tuition_center") return "tuition";
  return role as MobileRole;
}

const DEMO_LOOKUP: Record<string, { password: string; user: User }> =
  Object.fromEntries(
    Object.values(DEMO_USERS).map((u) => [
      u.email,
      {
        password: u.password,
        user: {
          id: u.id,
          email: u.email,
          name: u.name,
          role: sharedRoleToMobileRole(u.role),
        },
      },
    ])
  );

const AUTH_KEY = "@myschool_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((stored) => {
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const match = DEMO_LOOKUP[email.toLowerCase()];
      if (!match) return { error: "No account found with this email." };
      if (match.password !== password)
        return { error: "Incorrect password. Try Demo@1234" };
      setUser(match.user);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(match.user));
      return {};
    },
    []
  );

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
