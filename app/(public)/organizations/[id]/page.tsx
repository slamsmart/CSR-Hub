import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Globe, Users, Calendar, ShieldCheck, Star,
  FileText, ArrowRight, Award, Building2, Target,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    select: { name: true, description: true },
  });
  if (!org) return { title: "Organisasi tidak ditemukan" };
  return {
    title: `${org.name} - CSR Hub`,
    description: org.description || `Profil organisasi ${org.name} di CSR Hub`,
  };
}

const TYPE_LABEL: Record<string, string> = {
  NGO: "NGO / LSM",
  YAYASAN: "Yayasan",
  KOMUNITAS: "Komunitas",
  KOPERASI: "Koperasi",
  PERUSAHAAN: "Perusahaan",
  PEMERINTAH: "Instansi Pemerintah",
  PERGURUAN_TINGGI: "Perguruan Tinggi",
};

const STATUS_COLORS: Record<string, string> = {
  TERVERIFIKASI: "bg-green-100 text-green-700 border-green-200",
  DALAM_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-200",
  DITOLAK: "bg-red-100 text-red-700 border-red-200",
};

export default async function OrganizationProfilePage({ params }: { params: { id: string } }) {
  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      ngoProfile: true,
      members: {
        where: { role: "OWNER", isActive: true },
        include: { user: { select: { name: true, email: true, image: true } } },
        take: 1,
      },
      proposals: {
        where: { status: { in: ["DISETUJUI", "BERJALAN", "SELESAI"] } },
        select: {
          id: true,
          title: true,
          category: true,
          provinsi: true,
          status: true,
          budgetTotal: true,
          fundingSecured: true,
          sdgTags: true,
          slug: true,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  if (!org) notFound();

  const owner = org.members[0]?.user;
  const totalProposals = org.proposals.length;
  const completedProposals = org.proposals.filter((p) => p.status === "SELESAI").length;
  const totalFunding = org.proposals.reduce(
    (sum, p) => sum + Number(p.fundingSecured || 0),
    0
  );

  const CAT_LABELS: Record<string, string> = {
    PENDIDIKAN: "Pendidikan",
    KESEHATAN: "Kesehatan",
    LINGKUNGAN_HIDUP: "Lingkungan",
    PEMBERDAYAAN_EKONOMI: "Pemberdayaan Ekonomi",
    INFRASTRUKTUR: "Infrastruktur",
    TEKNOLOGI_DIGITAL: "Teknologi Digital",
    BUDAYA_OLAHRAGA: "Budaya & Olahraga",
    KEBENCANAAN: "Kebencanaan",
  };

  const STATUS_PROPOSAL: Record<string, { label: string; cls: string }> = {
    DISETUJUI: { label: "Disetujui", cls: "bg-blue-100 text-blue-700" },
    BERJALAN: { label: "Berjalan", cls: "bg-green-100 text-green-700" },
    SELESAI: { label: "Selesai", cls: "bg-gray-100 text-gray-700" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-brand-900 to-teal-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0 border border-white/30">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                org.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{org.name}</h1>
                {org.verificationStatus === "TERVERIFIKASI" && (
                  <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-400/30 text-green-300 text-xs px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3" /> Terverifikasi
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  {TYPE_LABEL[org.type] || org.type}
                </Badge>
                {org.ngoProfile?.kategoriUtama?.slice(0, 2).map((cat) => (
                  <Badge key={cat} className="bg-white/10 text-white border-white/20 text-xs">
                    {CAT_LABELS[cat] || cat}
                  </Badge>
                ))}
              </div>

              <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                {org.description || "Organisasi terdaftar di CSR Hub."}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/60">
                {org.kabupatenKota && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {org.kabupatenKota}, {org.provinsi}
                  </span>
                )}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {org.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Bergabung {new Date(org.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0 no-print">
              <Link href={`/register?role=PERUSAHAAN`}>
                <Button className="bg-white text-brand-700 hover:bg-white/90 gap-2">
                  Danai Program <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Total Program", value: totalProposals, color: "text-brand-600", bg: "bg-brand-50" },
            { icon: Award, label: "Program Selesai", value: completedProposals, color: "text-green-600", bg: "bg-green-50" },
            { icon: Users, label: "Trust Score", value: `${org.trustScore ?? 0}/100`, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Target, label: "Dana Diterima", value: totalFunding > 0 ? formatRupiah(totalFunding) : "–", color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => (
            <Card key={s.label} className="border bg-white">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: About */}
          <div className="md:col-span-1 space-y-4">
            {/* Verification Status */}
            <Card className="border bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3">Status Verifikasi</h3>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${STATUS_COLORS[org.verificationStatus] || "bg-gray-100 text-gray-700"}`}>
                  <ShieldCheck className="h-4 w-4" />
                  {org.verificationStatus === "TERVERIFIKASI" ? "Terverifikasi" :
                   org.verificationStatus === "DALAM_REVIEW" ? "Dalam Review" :
                   org.verificationStatus === "DITOLAK" ? "Ditolak" : "Belum Terverifikasi"}
                </div>
                {org.verifiedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Diverifikasi {new Date(org.verifiedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* NGO Profile */}
            {org.ngoProfile && (
              <Card className="border bg-white">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Profil Organisasi</h3>
                  {org.ngoProfile.wilayahKerja?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Wilayah Kerja</p>
                      <div className="flex flex-wrap gap-1">
                        {(org.ngoProfile.wilayahKerja as string[]).slice(0, 4).map((w) => (
                          <Badge key={w} variant="outline" className="text-xs">{w}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {org.ngoProfile.kategoriUtama?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Fokus Program</p>
                      <div className="flex flex-wrap gap-1">
                        {org.ngoProfile.kategoriUtama.map((cat) => (
                          <Badge key={cat} className="text-xs bg-brand-50 text-brand-700 border-brand-200">
                            {CAT_LABELS[cat] || cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {org.ngoProfile.totalBeneficiaries && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{org.ngoProfile.totalBeneficiaries.toLocaleString("id-ID")} total penerima manfaat</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            {owner && (
              <Card className="border bg-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Kontak PIC</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                      {owner.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{owner.name}</p>
                      <p className="text-xs text-muted-foreground">{owner.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Programs */}
          <div className="md:col-span-2">
            <Card className="border bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Program CSR</h3>
                  <Badge variant="outline" className="text-xs">{totalProposals} program</Badge>
                </div>

                {org.proposals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Belum ada program aktif</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {org.proposals.map((proposal) => {
                      const ps = STATUS_PROPOSAL[proposal.status];
                      return (
                        <Link
                          key={proposal.id}
                          href={`/proposals/${proposal.slug || proposal.id}`}
                          className="block rounded-xl border p-4 hover:shadow-md hover:border-brand-300 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge className={`text-xs ${ps?.cls || "bg-gray-100 text-gray-700"}`}>
                                  {ps?.label || proposal.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {CAT_LABELS[proposal.category] || proposal.category}
                                </Badge>
                              </div>
                              <p className="font-medium text-sm group-hover:text-brand-600 transition-colors leading-snug">
                                {proposal.title}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {proposal.provinsi}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" /> {formatRupiah(Number(proposal.budgetTotal))}
                                </span>
                              </div>
                              {(proposal.sdgTags as string[]).length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {(proposal.sdgTags as string[]).slice(0, 3).map((sdg) => (
                                    <span key={sdg} className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
                                      {sdg}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-brand-600 mt-1" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
