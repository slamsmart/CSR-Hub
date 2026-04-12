"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

export function useNotifications(page = 1) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?page=${page}`);
      if (!res.ok) throw new Error("Gagal memuat notifikasi");
      return res.json() as Promise<{
        notifications: Notification[];
        total: number;
        unreadCount: number;
      }>;
    },
    enabled: !!session,
    refetchInterval: 30_000, // Poll every 30 seconds
  });
}

export function useNotificationCount() {
  const { data: session } = useSession();
  const { data } = useQuery({
    queryKey: ["notification-count"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/count");
      if (!res.ok) return { count: 0 };
      return res.json() as Promise<{ count: number }>;
    },
    enabled: !!session,
    refetchInterval: 30_000,
  });

  return { count: data?.count ?? 0 };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal menandai notifikasi");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal menandai semua notifikasi");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });
}
