import { app, seedSuperAdmin } from "../artifacts/api-server/dist/vercel.mjs";

// Initialize DB seeding on first lambda cold start
let seeded = false;
const handler = async (req: any, res: any) => {
  if (!seeded) {
    try {
      await seedSuperAdmin();
      seeded = true;
    } catch (e) {
      console.warn("Seeding skipped/failed during lambda startup:", e);
    }
  }
  return (app as any)(req, res);
};

export default handler;
