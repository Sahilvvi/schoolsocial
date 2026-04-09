import { Router } from "express";
import { db } from "@workspace/db";
import { libraryBooksTable, libraryIssuesTable, studentsTable } from "@workspace/db";
import { eq, and, sql } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  try {
    const books = await db.select().from(libraryBooksTable).where(eq(libraryBooksTable.schoolId, schoolId!));
    return res.json({ books });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [book] = await db.insert(libraryBooksTable).values({ ...req.body, schoolId, availableCopies: req.body.totalCopies || 1 }).returning();
    return res.json({ book });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [book] = await db.update(libraryBooksTable).set(req.body).where(eq(libraryBooksTable.id, Number(req.params.id))).returning();
    return res.json({ book });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(libraryBooksTable).where(eq(libraryBooksTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/issues", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  try {
    const issues = await db.select({
      id: libraryIssuesTable.id, bookId: libraryIssuesTable.bookId, studentId: libraryIssuesTable.studentId,
      issuedAt: libraryIssuesTable.issuedAt, dueDate: libraryIssuesTable.dueDate, returnedAt: libraryIssuesTable.returnedAt,
      status: libraryIssuesTable.status, fine: libraryIssuesTable.fine,
      bookTitle: libraryBooksTable.title, studentName: studentsTable.name,
    }).from(libraryIssuesTable)
      .leftJoin(libraryBooksTable, eq(libraryIssuesTable.bookId, libraryBooksTable.id))
      .leftJoin(studentsTable, eq(libraryIssuesTable.studentId, studentsTable.id))
      .where(eq(libraryIssuesTable.schoolId, schoolId!));
    return res.json({ issues });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/issues", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [issue] = await db.insert(libraryIssuesTable).values({ ...req.body, schoolId }).returning();
    await db.update(libraryBooksTable).set({ availableCopies: sql`available_copies - 1` }).where(eq(libraryBooksTable.id, req.body.bookId));
    return res.json({ issue });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/issues/:id/return", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [issue] = await db.update(libraryIssuesTable).set({ returnedAt: new Date(), status: "returned" }).where(eq(libraryIssuesTable.id, Number(req.params.id))).returning();
    await db.update(libraryBooksTable).set({ availableCopies: sql`available_copies + 1` }).where(eq(libraryBooksTable.id, issue.bookId));
    return res.json({ issue });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
