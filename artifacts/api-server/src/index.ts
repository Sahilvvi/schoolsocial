import app from "./app";
import { seedSuperAdmin } from "./seed";

// Default to 3001 for local development if PORT is not set
const rawPort = process.env["PORT"] ?? "3001";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const startServer = async () => {
  try {
    await seedSuperAdmin();
  } catch (err) {
    console.log("[api-server] DB connection skipped or failed:", err instanceof Error ? err.message : String(err));
  }
  app.listen(port, () => {
    console.log(`[api-server] Running at http://localhost:${port}`);
  });
};

startServer();
