import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data as any,
      actionUrl: params.actionUrl,
    },
  });
}

export async function createBulkNotifications(
  params: CreateNotificationParams[]
) {
  return prisma.notification.createMany({
    data: params.map((p) => ({
      userId: p.userId,
      type: p.type,
      title: p.title,
      message: p.message,
      data: p.data as any,
      actionUrl: p.actionUrl,
    })) as any,
  });
}

// Notification templates
export const NotificationTemplates = {
  proposalDikirim: (proposalTitle: string, proposalId: string) => ({
    type: NotificationType.PROPOSAL_DIKIRIM,
    title: "Proposal Berhasil Dikirim",
    message: `Proposal "${proposalTitle}" berhasil dikirim dan sedang menunggu review dari tim kami.`,
    data: { proposalId },
    actionUrl: `/proposals/${proposalId}`,
  }),

  proposalDisetujui: (proposalTitle: string, proposalId: string) => ({
    type: NotificationType.PROPOSAL_DISETUJUI,
    title: "Proposal Disetujui!",
    message: `Selamat! Proposal "${proposalTitle}" Anda telah disetujui oleh admin platform.`,
    data: { proposalId },
    actionUrl: `/proposals/${proposalId}`,
  }),

  proposalDitolak: (proposalTitle: string, proposalId: string, alasan?: string) => ({
    type: NotificationType.PROPOSAL_DITOLAK,
    title: "Proposal Ditolak",
    message: `Proposal "${proposalTitle}" tidak dapat dilanjutkan. ${alasan ? `Alasan: ${alasan}` : ""}`,
    data: { proposalId },
    actionUrl: `/proposals/${proposalId}`,
  }),

  proposalRevisi: (proposalTitle: string, proposalId: string) => ({
    type: NotificationType.PROPOSAL_REVISI,
    title: "Proposal Perlu Direvisi",
    message: `Proposal "${proposalTitle}" membutuhkan revisi. Silakan periksa pesan dari reviewer.`,
    data: { proposalId },
    actionUrl: `/proposals/${proposalId}`,
  }),

  proposalDidanai: (proposalTitle: string, proposalId: string, amount: string) => ({
    type: NotificationType.PROPOSAL_DIDANAI,
    title: "Proposal Mendapat Pendanaan!",
    message: `Proposal "${proposalTitle}" telah mendapat komitmen pendanaan sebesar ${amount}.`,
    data: { proposalId, amount },
    actionUrl: `/proposals/${proposalId}`,
  }),

  verifikasiSelesai: (orgName: string, status: string) => ({
    type: NotificationType.VERIFIKASI_SELESAI,
    title: `Verifikasi ${status === "TERVERIFIKASI" ? "Berhasil" : "Ditolak"}`,
    message:
      status === "TERVERIFIKASI"
        ? `Selamat! Organisasi "${orgName}" telah berhasil diverifikasi. Anda kini mendapat badge terverifikasi.`
        : `Verifikasi organisasi "${orgName}" ditolak. Silakan periksa dokumen dan ajukan kembali.`,
    data: { status },
    actionUrl: "/pengaturan/organisasi",
  }),

  danaDikonfirmasi: (proposalTitle: string, proposalId: string, amount: string) => ({
    type: NotificationType.DANA_DIKONFIRMASI,
    title: "Konfirmasi Dana",
    message: `Dana sebesar ${amount} untuk proposal "${proposalTitle}" telah dikonfirmasi.`,
    data: { proposalId, amount },
    actionUrl: `/proposals/${proposalId}`,
  }),

  riskAlert: (resource: string, reason: string) => ({
    type: NotificationType.RISK_ALERT,
    title: "Peringatan Risiko Terdeteksi",
    message: `Terdeteksi indikasi risiko pada ${resource}: ${reason}`,
    data: { resource, reason },
    actionUrl: "/admin/risk-alerts",
  }),
};
