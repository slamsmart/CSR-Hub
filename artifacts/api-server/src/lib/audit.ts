import { db, auditLogsTable } from "@workspace/db";
import { logger } from "./logger";

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: {
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  details?: string;
  ipAddress?: string;
}): Promise<void> {
  try {
    await db.insert(auditLogsTable).values({
      userId: userId ?? null,
      action,
      entityType,
      entityId: entityId ?? null,
      details: details ?? null,
      ipAddress: ipAddress ?? null,
    });
  } catch (err) {
    logger.error({ err }, "Failed to write audit log");
  }
}
