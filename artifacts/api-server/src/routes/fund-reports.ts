import { Router } from "express";
import { db } from "@workspace/db";
import { fundReportsTable } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { authenticate } from "../lib/auth";

const router = Router();

router.get("/api/fund-reports", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const orgId = user.organizationId;
    const isAdmin = ["super_admin", "admin", "auditor", "verifikator"].includes(user.role);

    const reports = isAdmin
      ? await db.select({
          id: fundReportsTable.id,
          projectId: fundReportsTable.projectId,
          organizationId: fundReportsTable.organizationId,
          programName: fundReportsTable.programName,
          reportPeriodStart: fundReportsTable.reportPeriodStart,
          reportPeriodEnd: fundReportsTable.reportPeriodEnd,
          totalFundReceived: fundReportsTable.totalFundReceived,
          totalFundUsed: fundReportsTable.totalFundUsed,
          filename: fundReportsTable.filename,
          fileSize: fundReportsTable.fileSize,
          status: fundReportsTable.status,
          notes: fundReportsTable.notes,
          reviewNotes: fundReportsTable.reviewNotes,
          submittedAt: fundReportsTable.submittedAt,
          reviewedAt: fundReportsTable.reviewedAt,
        }).from(fundReportsTable).orderBy(desc(fundReportsTable.submittedAt))
      : await db.select({
          id: fundReportsTable.id,
          projectId: fundReportsTable.projectId,
          organizationId: fundReportsTable.organizationId,
          programName: fundReportsTable.programName,
          reportPeriodStart: fundReportsTable.reportPeriodStart,
          reportPeriodEnd: fundReportsTable.reportPeriodEnd,
          totalFundReceived: fundReportsTable.totalFundReceived,
          totalFundUsed: fundReportsTable.totalFundUsed,
          filename: fundReportsTable.filename,
          fileSize: fundReportsTable.fileSize,
          status: fundReportsTable.status,
          notes: fundReportsTable.notes,
          reviewNotes: fundReportsTable.reviewNotes,
          submittedAt: fundReportsTable.submittedAt,
          reviewedAt: fundReportsTable.reviewedAt,
        }).from(fundReportsTable)
          .where(eq(fundReportsTable.organizationId, orgId))
          .orderBy(desc(fundReportsTable.submittedAt));

    return res.json(reports);
  } catch (err) {
    return res.status(500).json({ error: "Gagal mengambil laporan" });
  }
});

router.post("/api/fund-reports", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const {
      programName, projectId, reportPeriodStart, reportPeriodEnd,
      totalFundReceived, totalFundUsed, filename, fileMimeType,
      fileSize, fileContent, notes
    } = req.body;

    if (!programName || !reportPeriodStart || !reportPeriodEnd || !fileContent || !filename) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    if (fileSize > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "Ukuran file maksimal 10MB" });
    }

    const [report] = await db.insert(fundReportsTable).values({
      organizationId: user.organizationId,
      projectId: projectId || null,
      programName,
      reportPeriodStart,
      reportPeriodEnd,
      totalFundReceived: Number(totalFundReceived) || 0,
      totalFundUsed: Number(totalFundUsed) || 0,
      filename,
      fileMimeType: fileMimeType || "application/pdf",
      fileSize: Number(fileSize) || 0,
      fileContent,
      notes: notes || null,
      status: "submitted",
    }).returning();

    return res.status(201).json(report);
  } catch (err) {
    return res.status(500).json({ error: "Gagal mengunggah laporan" });
  }
});

router.get("/api/fund-reports/:id/download", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const id = Number(req.params.id);
    const isAdmin = ["super_admin", "admin", "auditor", "verifikator"].includes(user.role);

    const [report] = await db.select().from(fundReportsTable)
      .where(
        isAdmin
          ? eq(fundReportsTable.id, id)
          : and(eq(fundReportsTable.id, id), eq(fundReportsTable.organizationId, user.organizationId))
      );

    if (!report) return res.status(404).json({ error: "Laporan tidak ditemukan" });

    const buffer = Buffer.from(report.fileContent, "base64");
    res.setHeader("Content-Type", report.fileMimeType || "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${report.filename}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ error: "Gagal mengunduh file" });
  }
});

router.patch("/api/fund-reports/:id/review", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const isAdmin = ["super_admin", "admin", "auditor", "verifikator"].includes(user.role);
    if (!isAdmin) return res.status(403).json({ error: "Akses ditolak" });

    const id = Number(req.params.id);
    const { status, reviewNotes } = req.body;

    const [updated] = await db.update(fundReportsTable)
      .set({ status, reviewNotes, reviewedAt: new Date(), updatedAt: new Date() })
      .where(eq(fundReportsTable.id, id))
      .returning();

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Gagal memperbarui status" });
  }
});

router.delete("/api/fund-reports/:id", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const id = Number(req.params.id);

    const [report] = await db.select({ id: fundReportsTable.id, organizationId: fundReportsTable.organizationId, status: fundReportsTable.status })
      .from(fundReportsTable).where(eq(fundReportsTable.id, id));

    if (!report) return res.status(404).json({ error: "Tidak ditemukan" });

    const isAdmin = ["super_admin", "admin"].includes(user.role);
    if (!isAdmin && report.organizationId !== user.organizationId) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    if (!isAdmin && report.status !== "draft" && report.status !== "revision_needed") {
      return res.status(400).json({ error: "Laporan yang sudah dikirim tidak dapat dihapus" });
    }

    await db.delete(fundReportsTable).where(eq(fundReportsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Gagal menghapus laporan" });
  }
});

export default router;
