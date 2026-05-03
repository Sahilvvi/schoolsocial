import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./artifacts/api-server/src/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Hostinger specific: Serve the built React frontend from the static directory
app.use(express.static(path.join(__dirname, "artifacts/myschool/dist/public")));

// Handle React routing, return all other requests to React app
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "artifacts/myschool/dist/public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[platform] Running at http://localhost:${PORT}`);
});
