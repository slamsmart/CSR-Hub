import { useState } from "react";
import { Link } from "wouter";
import { useListOrganizations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { Building2, Search, CheckCircle, MapPin, Globe, ArrowRight, Star } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "semua", label: "Semua Tipe" },
  { value: "perusahaan", label: "Perusahaan" },
  { value: "ngo", label: "LSM / NGO" },
  { value: "komunitas", label: "Komunitas" },
  { value: "sekolah", label: "Sekolah" },
  { value: "yayasan", label: "Yayasan" },
  { value: "startup_sosial", label: "Startup Sosial" },
];

export default function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [orgType, setOrgType] = useState("semua");
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListOrganizations({
    page,
    limit: 12,
    org_type: orgType === "semua" ? undefined : orgType,
    verified,
    search: search || undefined,
  });

  const orgs = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Direktori Organisasi</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} organisasi terdaftar di CSR Hub</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari nama atau lokasi organisasi..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={orgType} onValueChange={(v) => { setOrgType(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant={verified === true ? "default" : "outline"}
          size="sm"
          onClick={() => setVerified(verified === true ? undefined : true)}
        >
          <CheckCircle className="w-3.5 h-3.5 mr-1" />
          Terverifikasi
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Tidak ada organisasi ditemukan</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orgs.map((org: any) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <Badge className={`${getStatusColor(org.verification_status ?? "menunggu")} border-0 text-xs`}>
                    {getStatusLabel(org.verification_status ?? "menunggu")}
                  </Badge>
                </div>

                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{org.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{getStatusLabel(org.org_type)}</p>

                {org.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{org.description}</p>}

                <div className="space-y-1 mb-3">
                  {org.province && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /><span className="truncate">{org.province}</span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" /><span className="truncate">{org.website}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  {org.trust_score !== null && org.trust_score !== undefined ? (
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />Skor {org.trust_score}
                    </div>
                  ) : <div />}
                  <Link href={`/organizations/${org.id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    Detail <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
          <span className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya</Button>
        </div>
      )}
    </div>
  );
}
