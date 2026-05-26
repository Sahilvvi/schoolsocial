import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://crqcdqrimmvetmbmhapv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn("[Supabase] Missing environment variables. App will run in demo mode.");
}

const DEMO_ERROR = { message: "Supabase not configured (demo mode)", code: "DEMO_MODE" };

function makeDemoResponse() {
  return { data: null, error: DEMO_ERROR, count: null, status: 200, statusText: "OK" };
}

function makeDemoQueryBuilder(): any {
  const builder: any = {};
  const chainMethods = [
    "select", "insert", "update", "upsert", "delete",
    "eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike",
    "is", "in", "contains", "containedBy", "range",
    "order", "limit", "single", "maybeSingle",
    "textSearch", "match", "not", "or", "filter",
  ];
  for (const m of chainMethods) {
    builder[m] = (..._args: any[]) => builder;
  }
  builder.then = (resolve: any) => resolve(makeDemoResponse());
  return builder;
}

const demoAuth = {
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  signUp: () => Promise.resolve({ data: { user: null, session: null }, error: DEMO_ERROR }),
  signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: DEMO_ERROR }),
  signOut: () => Promise.resolve({ error: null }),
  resetPasswordForEmail: () => Promise.resolve({ data: {}, error: DEMO_ERROR }),
  onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
};

const demoStorage = {
  from: () => ({
    upload: () => Promise.resolve({ data: null, error: DEMO_ERROR }),
    getPublicUrl: () => ({ data: { publicUrl: "" } }),
    remove: () => Promise.resolve({ data: null, error: null }),
    list: () => Promise.resolve({ data: [], error: null }),
  }),
};

const demoFunctions = {
  invoke: () => Promise.resolve({ data: null, error: DEMO_ERROR }),
};

const demoClient = {
  from: (_table: string) => makeDemoQueryBuilder(),
  auth: demoAuth,
  storage: demoStorage,
  functions: demoFunctions,
  rpc: () => Promise.resolve(makeDemoResponse()),
  channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
  removeChannel: () => {},
} as unknown as ReturnType<typeof createClient<Database>>;

export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : demoClient;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
