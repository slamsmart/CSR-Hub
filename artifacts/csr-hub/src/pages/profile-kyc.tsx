import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Building2, FileCheck, Shield, CheckCircle, AlertCircle, Upload,
  Phone, MapPin, Globe, CreditCard, User, Landmark, Info,
  ChevronRight, Lock, ClipboardList
} from "lucide-react";

const PROVINCES = [
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau","Jambi",
  "Sumatera Selatan","Kepulauan Bangka Belitung","Bengkulu","Lampung",
  "Banten","DKI Jakarta","Jawa Barat","Jawa Tengah","DI Yogyakarta","Jawa Timur",
  "Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat",
  "Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara",
  "Sulawesi Utara","Gorontalo","Sulawesi Tengah","Sulawesi Barat","Sulawesi Selatan",
  "Sulawesi Tenggara","Maluku","Maluku Utara","Papua Barat","Papua",
  "Papua Selatan","Papua Tengah","Papua Pegunungan",
];

const LEGAL_ENTITY_TYPES = [
  { value: "pt", label: "PT (Perseroan Terbatas)" },
  { value: "pt_persero", label: "PT Persero / BUMN" },
  { value: "tbk", label: "PT Tbk (Perusahaan Publik)" },
  { value: "yayasan", label: "Yayasan" },
  { value: "perkumpulan", label: "Perkumpulan" },
  { value: "cv", label: "CV (Commanditaire Vennootschap)" },
  { value: "koperasi", label: "Koperasi" },
  { value: "lsm", label: "LSM / NGO" },
  { value: "ormas", label: "Organisasi Masyarakat (Ormas)" },
  { value: "komunitas", label: "Komunitas / Kelompok Masyarakat" },
];

const BANKS = [
  "Bank BRI","Bank BNI","Bank Mandiri","Bank BCA","Bank BTN","Bank CIMB Niaga",
  "Bank Danamon","Bank Permata","Bank Mega","Bank OCBC NISP","Bank Maybank",
  "Bank HSBC","Bank Standard Chartered","Bank BJB","Bank Jatim","Bank DKI",
  "Bank Syariah Indonesia (BSI)","Bank Muamalat","Bank BRI Syariah",
  "Bank Lainnya",
];

function KYCStatusBadge({ org }: { org: any }) {
  const hasNib = !!org?.nib;
  const hasSk = !!org?.skKemenkumham;
  const hasNpwp = !!org?.npwp;
  const verified = org?.verificationStatus === "verified";

  if (verified) return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-green-700">Profil Terverifikasi</p>
        <p className="text-xs text-green-600">Semua dokumen legal telah divalidasi oleh tim CSR Hub</p>
      </div>
      <Badge className="ml-auto bg-green-100 text-green-700 border-0">Verified</Badge>
    </div>
  );

  const completedCount = [hasNib, hasSk, hasNpwp].filter(Boolean).length;
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-700">Profil Belum Lengkap</p>
        <p className="text-xs text-amber-600">Lengkapi {3 - completedCount} dokumen lagi untuk meningkatkan kepercayaan</p>
        <div className="flex gap-2 mt-1.5">
          {[
            { label: "NIB", done: hasNib },
            { label: "SK Kemenkumham", done: hasSk },
            { label: "NPWP", done: hasNpwp },
          ].map(({ label, done }) => (
            <span key={label} className={`text-xs px-2 py-0.5 rounded-full font-medium ${done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {done ? "✓" : "○"} {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfileKYCPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const orgId = (user as any)?.organizationId;

  const { data: org, isLoading } = useQuery({
    queryKey: ["/api/organizations", orgId],
    queryFn: () => customFetch<any>(`/api/organizations/${orgId}`),
    enabled: !!orgId,
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name ?? "",
        description: org.description ?? "",
        website: org.website ?? "",
        province: org.province ?? "",
        city: org.city ?? "",
        address: org.address ?? "",
        phone: org.phone ?? "",
        email: org.email ?? "",
        npwp: org.npwp ?? "",
        nib: org.nib ?? "",
        skKemenkumham: org.skKemenkumham ?? "",
        legalEntityType: org.legalEntityType ?? "",
        foundingYear: String(org.foundingYear ?? ""),
        directorName: org.directorName ?? "",
        contactPersonName: org.contactPersonName ?? "",
        contactPersonPhone: org.contactPersonPhone ?? "",
        bankName: org.bankName ?? "",
        bankAccountNumber: org.bankAccountNumber ?? "",
        bankAccountName: org.bankAccountName ?? "",
      });
    }
  }, [org]);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      return customFetch(`/api/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizations", orgId] });
      setSaved(true);
      toast.success("Profil KYC berhasil disimpan!");
      setTimeout(() => setSaved(false), 3000);
    },
    onError: () => {
      toast.error("Gagal menyimpan profil. Coba lagi.");
    },
  });

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const payload: Record<string, any> = { ...form };
    if (payload.foundingYear) payload.foundingYear = parseInt(payload.foundingYear, 10);
    mutation.mutate(payload);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <Lock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground">Silakan login untuk mengakses halaman ini</p>
        <Button className="mt-4" onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  if (!orgId) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="font-semibold text-foreground mb-2">Anda belum terdaftar sebagai organisasi</p>
        <p className="text-sm text-muted-foreground mb-4">Daftarkan organisasi Anda terlebih dahulu untuk melengkapi profil KYC</p>
        <Button onClick={() => navigate("/register")}>Daftar Sekarang</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileCheck className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Profil & KYC Organisasi</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-10">
          Lengkapi profil legal untuk meningkatkan kepercayaan dan mempercepat verifikasi
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
        <div className="space-y-5">

          {/* KYC Status */}
          <KYCStatusBadge org={org} />

          {/* KYC Completion Guide */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 space-y-1">
                <p className="font-semibold">Mengapa KYC penting?</p>
                <p>Organisasi yang lengkap dokumen KYC-nya mendapat <strong>Trust Score lebih tinggi</strong>, tampil di urutan atas pencarian, dan bisa langsung mengakses co-funding multi-perusahaan.</p>
                <p>Untuk NGO: NIB wajib. SK Kemenkumham wajib jika berbadan hukum Yayasan/Perkumpulan.</p>
                <p>Untuk Perusahaan: NIB wajib. NPWP wajib untuk proses dokumen pajak CSR.</p>
              </div>
            </div>
          </div>

          {/* Section 1: Info Dasar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />Informasi Dasar Organisasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Nama Organisasi *</Label>
                  <Input className="mt-1" value={form.name ?? ""} onChange={e => set("name", e.target.value)} placeholder="Nama lengkap organisasi" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Bentuk Badan Hukum</Label>
                  <Select value={form.legalEntityType} onValueChange={v => set("legalEntityType", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih bentuk badan hukum..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LEGAL_ENTITY_TYPES.map(lt => (
                        <SelectItem key={lt.value} value={lt.value}>{lt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Tahun Berdiri</Label>
                  <Input className="mt-1" type="number" min={1900} max={new Date().getFullYear()} value={form.foundingYear ?? ""} onChange={e => set("foundingYear", e.target.value)} placeholder="contoh: 2010" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Website</Label>
                  <Input className="mt-1" value={form.website ?? ""} onChange={e => set("website", e.target.value)} placeholder="https://www.organisasi.id" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Deskripsi Organisasi</Label>
                <Textarea className="mt-1" rows={3} value={form.description ?? ""} onChange={e => set("description", e.target.value)} placeholder="Ceritakan visi, misi, dan kegiatan utama organisasi Anda..." />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Dokumen Legal (NIB, SK, NPWP) */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                Dokumen Legal & KYC
                <Badge className="bg-primary/10 text-primary border-0 text-xs ml-1">Wajib untuk Verifikasi</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-primary">NIB — Nomor Induk Berusaha *</Label>
                  <Input
                    className="mt-1 border-primary/30 focus:border-primary"
                    value={form.nib ?? ""}
                    onChange={e => set("nib", e.target.value)}
                    placeholder="contoh: 1234567890123"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Wajib bagi semua jenis organisasi. Diterbitkan oleh OSS (oss.go.id)</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-primary">NPWP — Nomor Pokok Wajib Pajak *</Label>
                  <Input
                    className="mt-1 border-primary/30 focus:border-primary"
                    value={form.npwp ?? ""}
                    onChange={e => set("npwp", e.target.value)}
                    placeholder="contoh: 00.000.000.0-000.000"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Diperlukan untuk proses dokumen potongan pajak CSR</p>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold">
                  SK Kemenkumham — Nomor Surat Keputusan
                  <span className="text-muted-foreground font-normal ml-1">(untuk Yayasan/Perkumpulan/Ormas)</span>
                </Label>
                <Input
                  className="mt-1"
                  value={form.skKemenkumham ?? ""}
                  onChange={e => set("skKemenkumham", e.target.value)}
                  placeholder="contoh: AHU-0012345.AH.01.04.Tahun 2020"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nomor SK dari Kementerian Hukum dan HAM yang mengesahkan badan hukum yayasan atau perkumpulan Anda.
                  Cek di SABH Kemenkumham (ahu.go.id).
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <p>
                  <strong>Catatan:</strong> CSR Hub tidak menyimpan dokumen fisik. Hanya nomor dokumen yang disimpan untuk keperluan verifikasi.
                  Tim verifikator kami akan mengkonfirmasi keabsahan nomor dokumen melalui sistem OSS dan SABH Kemenkumham.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Alamat */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />Alamat & Kontak Kantor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Provinsi</Label>
                  <Select value={form.province} onValueChange={v => set("province", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih provinsi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Kota / Kabupaten</Label>
                  <Input className="mt-1" value={form.city ?? ""} onChange={e => set("city", e.target.value)} placeholder="contoh: Kota Surabaya" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Alamat Lengkap</Label>
                <Textarea className="mt-1" rows={2} value={form.address ?? ""} onChange={e => set("address", e.target.value)} placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Nomor Telepon Kantor</Label>
                  <Input className="mt-1" value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+62 21 12345678" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Email Organisasi</Label>
                  <Input className="mt-1" type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)} placeholder="info@organisasi.id" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Narahubung */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />Pimpinan & Narahubung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Nama Direktur / Ketua</Label>
                  <Input className="mt-1" value={form.directorName ?? ""} onChange={e => set("directorName", e.target.value)} placeholder="Nama lengkap sesuai SK" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Nama Person in Charge (PIC)</Label>
                  <Input className="mt-1" value={form.contactPersonName ?? ""} onChange={e => set("contactPersonName", e.target.value)} placeholder="Nama PIC untuk CSR Hub" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">No. HP PIC</Label>
                <Input className="mt-1 max-w-xs" value={form.contactPersonPhone ?? ""} onChange={e => set("contactPersonPhone", e.target.value)} placeholder="+62 812 3456 7890" />
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Rekening Bank */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" />Rekening Bank Pencairan Dana
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                <p>Rekening ini digunakan untuk pencairan dana program CSR yang telah disetujui. Pastikan nama rekening sesuai dengan nama organisasi yang terdaftar.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Nama Bank</Label>
                  <Select value={form.bankName} onValueChange={v => set("bankName", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih bank..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BANKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Nomor Rekening</Label>
                  <Input className="mt-1" value={form.bankAccountNumber ?? ""} onChange={e => set("bankAccountNumber", e.target.value)} placeholder="contoh: 012345678" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Nama Pemilik Rekening</Label>
                <Input className="mt-1 max-w-xs" value={form.bankAccountName ?? ""} onChange={e => set("bankAccountName", e.target.value)} placeholder="Sesuai nama di buku tabungan" />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <p className="text-xs text-muted-foreground">
              * Kolom wajib untuk proses verifikasi akun
            </p>
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              className={saved ? "bg-green-600 hover:bg-green-700" : ""}
              size="lg"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</span>
              ) : saved ? (
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Tersimpan!</span>
              ) : (
                <span className="flex items-center gap-2">Simpan Profil KYC <ChevronRight className="w-4 h-4" /></span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
