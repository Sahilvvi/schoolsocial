import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "parent" | "school" | "teacher" | "admin" | "tuition";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "parent@myschool.demo": {
    password: "Demo@1234",
    user: {
      id: "parent-1",
      email: "parent@myschool.demo",
      name: "Rahul Sharma",
      role: "parent",
    },
  },
  "school@myschool.demo": {
    password: "Demo@1234",
    user: {
      id: "school-1",
      email: "school@myschool.demo",
      name: "School Admin",
      role: "school",
    },
  },
  "teacher@myschool.demo": {
    password: "Demo@1234",
    user: {
      id: "teacher-1",
      email: "teacher@myschool.demo",
      name: "Priya Gupta",
      role: "teacher",
    },
  },
  "admin@myschool.demo": {
    password: "Demo@1234",
    user: {
      id: "admin-1",
      email: "admin@myschool.demo",
      name: "Admin User",
      role: "admin",
    },
  },
  "tuition@myschool.demo": {
    password: "Demo@1234",
    user: {
      id: "tuition-1",
      email: "tuition@myschool.demo",
      name: "Bright Future Academy",
      role: "tuition",
    },
  },
};

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
      const match = DEMO_USERS[email.toLowerCase()];
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
