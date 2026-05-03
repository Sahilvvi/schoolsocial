import { Router } from "express";
import { db } from "@workspace/db";
import { platformSettingsTable } from "@workspace/db";
import { eq } from "@workspace/db";
import { requireAuth, requireRole, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

const DEFAULT_SETTINGS: Record<string, string> = {
  platformName: "MySchool",
  tagline: "India's School Discovery & ERP Platform",
  supportEmail: "support@myschool.in",
  supportPhone: "+91 0000000000",
  website: "https://myschool.in",
  maxSchoolsPerPlan: "10",
  trialDays: "30",
  emailOnSchoolApproval: "true",
  emailOnNewReview: "true",
  emailOnNewApplication: "true",
  emailOnFeePayment: "false",
  requireMFA: "false",
  sessionTimeout: "8",
  auditLogging: "true",
  ipWhitelist: "",
};

router.get("/", requireAuth, requireRole("super_admin"), async (_req, res) => {
  try {
    const rows = await db.select().from(platformSettingsTable);
    const settings = { ...DEFAULT_SETTINGS };
    rows.forEach(r => { settings[r.key] = r.value; });
    return res.json({ settings });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to get settings" }); }
});

router.put("/", requireAuth, requireRole("super_admin"), async (req: AuthRequest, res) => {
  try {
    const entries = Object.entries(req.body as Record<string, string>);
    for (const [key, value] of entries) {
      const [existing] = await db.select().from(platformSettingsTable).where(eq(platformSettingsTable.key, key));
      if (existing) {
        await db.update(platformSettingsTable).set({ value: String(value), updatedAt: new Date() }).where(eq(platformSettingsTable.key, key));
      } else {
        await db.insert(platformSettingsTable).values({ key, value: String(value) });
      }
    }
    return res.json({ success: true, message: "Settings saved" });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to save settings" }); }
});

export default router;
