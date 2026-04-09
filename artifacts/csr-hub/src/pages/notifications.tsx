import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort } from "@/lib/utils";
import { Bell, CheckCheck, CheckCircle, AlertTriangle, Info, XCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

function NotifIcon({ type }: { type?: string }) {
  const map: Record<string, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };
  return <>{map[type ?? "info"] ?? map.info}</>;
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();

  const { data: notifications, isLoading } = useListNotifications(
    {},
    { query: { enabled: isAuthenticated } }
  );

  const markAllMutation = useMarkAllNotificationsRead({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/notifications"] });
        toast.success("Semua notifikasi ditandai sudah dibaca");
      },
    }
  });

  const markOneMutation = useMarkNotificationRead({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/notifications"] }),
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center py-20">
        <Bell className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground">Masuk untuk melihat notifikasi Anda</p>
        <Link href="/login" className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
          Masuk
        </Link>
      </div>
    );
  }

  const notifs = (notifications as any[]) ?? [];
  const unreadCount = notifs.filter((n) => !n.is_read).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifikasi</h1>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground mt-1">{unreadCount} belum dibaca</p>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate({})} disabled={markAllMutation.isPending}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}</div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Tidak ada notifikasi</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notifs.map((n: any) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${!n.is_read ? "bg-primary/5 hover:bg-primary/8" : "hover:bg-muted/30"}`}
                  onClick={() => !n.is_read && markOneMutation.mutate({ id: n.id })}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === "success" ? "bg-green-50" : n.type === "warning" ? "bg-yellow-50" : "bg-blue-50"}`}>
                    <NotifIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!n.is_read ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-muted-foreground">{n.created_at ? formatDateShort(n.created_at) : ""}</span>
                      {n.link_url && (
                        <Link href={n.link_url} className="text-xs text-primary flex items-center gap-1 hover:underline">
                          Lihat <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
