import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { isDemoEmail, getDemoUser, DEMO_USERS } from "@/data/dummyData";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Build a fake Supabase-like User object for demo accounts
function makeDemoUser(demo: typeof DEMO_USERS[keyof typeof DEMO_USERS]): User {
  return {
    id: demo.id,
    email: demo.email,
    app_metadata: {},
    user_metadata: { full_name: demo.name, role: demo.role },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;
}

function makeDemoSession(demo: typeof DEMO_USERS[keyof typeof DEMO_USERS]): Session {
  return {
    access_token: `demo-token-${demo.id}`,
    refresh_token: `demo-refresh-${demo.id}`,
    expires_in: 3600,
    token_type: "bearer",
    user: makeDemoUser(demo),
  } as unknown as Session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore demo session from localStorage
    const demoEmail = localStorage.getItem("demo_user_email");
    if (demoEmail) {
      const demo = getDemoUser(demoEmail);
      if (demo) {
        setUser(makeDemoUser(demo));
        setSession(makeDemoSession(demo));
        setLoading(false);
        return;
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    // Demo accounts cannot sign up - they already exist
    if (isDemoEmail(email)) {
      return { error: new Error("This is a demo account. Please use Sign In instead.") };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    // Handle demo credentials
    if (isDemoEmail(email)) {
      const demo = getDemoUser(email);
      if (demo && password === demo.password) {
        localStorage.setItem("demo_user_email", email);
        setUser(makeDemoUser(demo));
        setSession(makeDemoSession(demo));
        return { error: null };
      }
      return { error: new Error("Invalid demo credentials") };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // Sync with ERP backend if login is successful
    if (!error && data?.session) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email, password })
        });
        if (response.ok) {
          const erpData = await response.json();
          localStorage.setItem('myschool_token', erpData.token);
        }
      } catch (err) {
        console.warn("ERP synchronization failed:", err);
      }
    }
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    const demoEmail = localStorage.getItem("demo_user_email");
    if (demoEmail) {
      localStorage.removeItem("demo_user_email");
      setUser(null);
      setSession(null);
      window.location.href = "/";
      return;
    }
    await supabase.auth.signOut();
    localStorage.removeItem('myschool_token');
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
