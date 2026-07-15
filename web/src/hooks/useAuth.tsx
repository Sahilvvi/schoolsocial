import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { isDemoEmail, getDemoUser, DEMO_USERS } from "@/data/dummyData";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; user: User | null }>;
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
      // Check for custom local demo accounts
      const customDemo = localStorage.getItem(`demo_custom_${demoEmail}`);
      if (customDemo) {
        try {
          const parsed = JSON.parse(customDemo);
          const localUser = {
            id: parsed.id, email: parsed.email,
            app_metadata: {},
            user_metadata: { full_name: parsed.name, role: parsed.role },
            aud: "authenticated", created_at: new Date().toISOString(),
          } as unknown as User;
          const localSession = {
            access_token: `local-token-${parsed.id}`, refresh_token: `local-refresh-${parsed.id}`,
            expires_in: 3600, token_type: "bearer", user: localUser,
          } as unknown as Session;
          setUser(localUser);
          setSession(localSession);
          setLoading(false);
          return;
        } catch { /* fall through */ }
      }
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
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

  const signUp = async (email: string, password: string, name: string, role?: string) => {
    // Demo accounts cannot sign up - they already exist
    if (isDemoEmail(email)) {
      return { error: new Error("This is a demo account. Please use Sign In instead.") };
    }
    if (!isSupabaseConfigured) {
      // Demo mode: create a local demo account
      const demoId = `local-${Date.now()}`;
      const localUser = {
        id: demoId,
        email,
        app_metadata: {},
        user_metadata: { full_name: name, role: role || "parent" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      // Store as a custom demo user so they can log in
      localStorage.setItem(`demo_custom_${email}`, JSON.stringify({ id: demoId, email, name, password, role: role || "parent" }));
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: role || "parent" }, emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    // Handle demo credentials
    if (isDemoEmail(email)) {
      const demo = getDemoUser(email);
      if (demo && password === demo.password) {
        localStorage.setItem("demo_user_email", email);
        const demoUser = makeDemoUser(demo);
        setUser(demoUser);
        setSession(makeDemoSession(demo));
        return { error: null, user: demoUser };
      }
      return { error: new Error("Invalid demo credentials"), user: null };
    }

    // Check custom local demo accounts (created via signup in demo mode)
    const customDemo = localStorage.getItem(`demo_custom_${email}`);
    if (customDemo) {
      try {
        const parsed = JSON.parse(customDemo);
        if (parsed.password === password) {
          localStorage.setItem("demo_user_email", email);
          localStorage.setItem("demo_custom_active", customDemo);
          const localUser = {
            id: parsed.id, email: parsed.email,
            app_metadata: {},
            user_metadata: { full_name: parsed.name, role: parsed.role },
            aud: "authenticated", created_at: new Date().toISOString(),
          } as unknown as User;
          const localSession = {
            access_token: `local-token-${parsed.id}`, refresh_token: `local-refresh-${parsed.id}`,
            expires_in: 3600, token_type: "bearer", user: localUser,
          } as unknown as Session;
          setUser(localUser);
          setSession(localSession);
          return { error: null, user: localUser };
        }
        return { error: new Error("Invalid password"), user: null };
      } catch {
        // Fall through
      }
    }

    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase is not configured. Please use demo credentials to sign in."), user: null };
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
    
    return { error: error as Error | null, user: data?.user ?? null };
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
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('myschool_token');
    localStorage.removeItem('demo_custom_active');
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
