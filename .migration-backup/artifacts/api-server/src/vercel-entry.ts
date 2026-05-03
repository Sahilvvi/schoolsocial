// Vercel serverless function entry point
// This file is bundled by esbuild and used by api/index.ts
export { default as app } from "./app.js";
export { seedSuperAdmin } from "./seed.js";
