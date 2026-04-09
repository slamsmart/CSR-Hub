import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/lib/utils";
import { Link } from "wouter";
import {
  Trophy, Medal, Building2, Star, TrendingUp, Users, Sparkles,
  Crown, ArrowRight, Shield, FileBarChart
} from "lucide-react";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
      <Crown className="w-5 h-5 text-white" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
      <Medal className="w-5 h-5 text-white" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md">
      <Medal className="w-5 h-5 text-white" />
    </div>
  );
  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm">
      #{rank}
    </div>
  );
}

function tierStyle(badge: string): { card: string; badge: string } {
  if (badge === "Platinum") return { card: "border-l-4 border-l-slate-400 bg-gradient-to-r from-slate-50 to-white", badge: "bg-gradient-to-r from-slate-400 to-slate-600 text-white" };
  if (badge === "Gold") return { card: "border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white", badge: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white" };
  if (badge === "Silver") return { card: "border-l-4 border-l-gray-400 bg-gradient-to-r from-gray-50 to-white", badge: "bg-gradient-to-r from-gray-300 to-gray-500 text-white" };
  return { card: "border-l-4 border-l-amber-600 bg-white", badge: "bg-gradient-to-r from-amber-700 to-amber-800 text-white" };
}

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/dashboard/leaderboard"],
    queryFn: () => customFetch<any[]>("/api/dashboard/leaderboard"),
  });

  const list = (leaderboard as any[]) ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 mb-4">
          <Trophy className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Perusahaan Paling Berdampak</h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">
          Peringkat perusahaan berdasarkan total investasi CSR, dampak sosial, dan konsistensi program.
          Tampil di sini berarti Anda diakui sebagai mitra strategis pembangunan berkelanjutan Indonesia.
        </p>
      </div>

      {/* Tier guide */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { tier: "Platinum", desc: "#1 tertinggi", color: "from-slate-400 to-slate-600" },
          { tier: "Gold", desc: "#2", color: "from-yellow-400 to-amber-500" },
          { tier: "Silver", desc: "#3", color: "from-gray-300 to-gray-500" },
          { tier: "Bronze", desc: "#4 ke bawah", color: "from-amber-700 to-amber-800" },
        ].map(({ tier, desc, color }) => (
          <div key={tier} className="text-center">
            <div className={`h-2 rounded-full bg-gradient-to-r ${color} mb-2`} />
            <p className="text-xs font-semibold text-foreground">{tier}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada perusahaan terdaftar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((company: any) => {
            const { card, badge } = tierStyle(company.badge);
            return (
              <div key={company.id} className={`rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${card}`}>
                <div className="flex items-center gap-4 p-4">
                  <RankBadge rank={company.rank} />

                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-foreground text-sm">{company.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badge}`}>
                        <Trophy className="w-2.5 h-2.5" />{company.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                      {company.province && <span>{company.province}</span>}
                      {company.trustScore > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />Skor {company.trustScore}
                        </span>
                      )}
                      {company.successRate > 0 && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <Shield className="w-3 h-3" />{company.successRate}% sukses
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-primary">{formatRupiah(company.totalFunded)}</p>
                    <p className="text-xs text-muted-foreground">Total Dana CSR</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Join CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-sidebar to-sidebar/80 text-white p-8 text-center">
        <Trophy className="w-8 h-8 mx-auto mb-3 text-amber-300" />
        <h3 className="text-lg font-bold mb-2">Ingin Nama Perusahaan Anda di Sini?</h3>
        <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
          Bergabung dan mulai program CSR pertama Anda. Peringkat diperbarui setiap bulan
          berdasarkan total dana, dampak sosial, dan konsistensi pelaporan.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-primary font-semibold hover:opacity-90 transition-opacity text-sm">
            Daftar sebagai Perusahaan <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/sustainability" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors text-sm">
            <FileBarChart className="w-4 h-4" />Lihat Laporan GRI
          </Link>
        </div>
      </div>
    </div>
  );
}
