import { useState } from "react";
import { useListUsers } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getRoleColor, getStatusLabel, formatDateShort } from "@/lib/utils";
import { Users, Search, Lock, Mail, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function UsersPage() {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListUsers({ page, limit: 20 });

  if (!isAuthenticated || !["super_admin","admin"].includes(user?.role ?? "")) {
    return (
      <div className="p-6 text-center py-20">
        <Lock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Akses Terbatas</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Halaman ini hanya untuk Super Admin dan Admin</p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const users = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const filtered = search
    ? users.filter((u: any) => (u.name || u.full_name || "").toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manajemen Pengguna</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} pengguna terdaftar di platform</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">Tidak ada pengguna ditemukan</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u: any) => {
            const uName = u.name || u.full_name || u.email || "Pengguna";
            const initials = uName !== u.email ? uName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() : "?";
            return (
              <Card key={u.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-foreground text-sm truncate">{uName}</p>
                      <Badge className={`${getRoleColor(u.role ?? "")} border-0 text-xs shrink-0`}>
                        {getStatusLabel(u.role ?? "")}
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 shrink-0" />{u.email}
                      </p>
                      {u.created_at && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />Bergabung {formatDateShort(u.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
          <span className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya</Button>
        </div>
      )}
    </div>
  );
}
