"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  User, Lock, Bell, Building2, Shield, Save, Eye, EyeOff,
  CheckCircle2, AlertTriangle, Smartphone, Key, Upload,
  Trash2, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SettingsTab = "profil" | "keamanan" | "notifikasi" | "organisasi";

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "profil", label: "Profil Akun", icon: User },
  { key: "keamanan", label: "Keamanan", icon: Lock },
  { key: "notifikasi", label: "Notifikasi", icon: Bell },
  { key: "organisasi", label: "Organisasi", icon: Building2 },
];

const NOTIFICATION_PREFS = [
  { key: "proposal_status", label: "Perubahan status proposal", category: "Proposal", defaultOn: true },
  { key: "proposal_komentar", label: "Komentar pada proposal saya", category: "Proposal", defaultOn: true },
  { key: "milestone_reminder", label: "Pengingat milestone jatuh tempo", category: "Proyek", defaultOn: true },
  { key: "laporan_reminder", label: "Pengingat laporan bulanan", category: "Proyek", defaultOn: true },
  { key: "ai_match", label: "Rekomendasi AI matching baru", category: "Matching", defaultOn: true },
  { key: "cofunding_invite", label: "Undangan co-funding", category: "Matching", defaultOn: true },
  { key: "verifikasi_update", label: "Update status verifikasi", category: "Sistem", defaultOn: true },
  { key: "platform_news", label: "Berita & pembaruan platform", category: "Sistem", defaultOn: false },
];

export function PengaturanPage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, p.defaultOn]))
  );
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(session?.user?.image || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileName, setProfileName] = useState(session?.user?.name || "");
  const [profilePhone, setProfilePhone] = useState((session?.user as any)?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function showSaved(msg: string) {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(null), 3000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showSaved("Format harus JPG, PNG, atau WebP");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showSaved("Ukuran maksimal 2MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "csrhub/avatars");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      const url = result.data.url;
      setAvatarUrl(url);
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
      await updateSession({ image: url });
      showSaved("Foto profil berhasil diperbarui");
    } catch {
      showSaved("Gagal mengupload foto");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      if (!res.ok) throw new Error();
      await updateSession({ name: profileName });
      showSaved("Profil berhasil disimpan");
    } catch {
      showSaved("Gagal menyimpan profil");
    } finally {
      setSavingProfile(false);
    }
  }

  const categories = [...new Set(NOTIFICATION_PREFS.map((p) => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-title">Pengaturan Akun</h1>
        <p className="section-subtitle">Kelola profil, keamanan, dan preferensi notifikasi Anda.</p>
      </div>

      {/* Success toast */}
      {savedMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          {savedMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                    activeTab === tab.key
                      ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.key && <ChevronRight className="h-3 w-3 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content area */}
        <div className="lg:col-span-3 space-y-4">

          {/* Profil Tab */}
          {activeTab === "profil" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informasi Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="h-16 w-16 rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
                          {(profileName || session?.user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingAvatar ? "Mengupload..." : "Ganti Foto"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, atau WebP, maks. 2MB</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nama Lengkap</label>
                      <Input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                      <Input value={session?.user?.email || ""} type="email" disabled className="bg-muted" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nomor HP</label>
                      <Input
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+62..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role</label>
                      <Input value={(session?.user as any)?.role || ""} disabled className="bg-muted" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="brand" className="gap-2" onClick={handleSaveProfile} loading={savingProfile}>
                      <Save className="h-4 w-4" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-red-600">Zona Bahaya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
                    <div>
                      <p className="text-sm font-semibold text-red-700">Hapus Akun</p>
                      <p className="text-xs text-red-600 mt-0.5">Aksi ini permanen dan tidak dapat dibatalkan.</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Hapus Akun
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Keamanan Tab */}
          {activeTab === "keamanan" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ubah Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password Lama</label>
                    <div className="relative">
                      <Input type={showOldPw ? "text" : "password"} placeholder="Password saat ini" className="pr-10" />
                      <button
                        type="button"
                        onClick={() => setShowOldPw(!showOldPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showOldPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password Baru</label>
                    <div className="relative">
                      <Input type={showNewPw ? "text" : "password"} placeholder="Password baru (min. 8 karakter)" className="pr-10" />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={cn("h-1 flex-1 rounded-full", i <= 2 ? "bg-muted" : "bg-muted")} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Gunakan kombinasi huruf besar, angka, dan simbol</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Konfirmasi Password Baru</label>
                    <Input type="password" placeholder="Ulangi password baru" />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="brand" className="gap-2" onClick={() => showSaved("Password berhasil diubah")}>
                      <Lock className="h-4 w-4" />
                      Ubah Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Autentikasi Dua Faktor (2FA)</CardTitle>
                    <Badge variant={twoFAEnabled ? "success" : "secondary"}>
                      {twoFAEnabled ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border",
                    twoFAEnabled ? "bg-green-50 border-green-200" : "bg-muted/50"
                  )}>
                    <Smartphone className={cn("h-5 w-5 flex-shrink-0 mt-0.5", twoFAEnabled ? "text-green-600" : "text-muted-foreground")} />
                    <div>
                      <p className="text-sm font-medium">Authenticator App</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {twoFAEnabled
                          ? "2FA aktif menggunakan Google Authenticator / Authy."
                          : "Tingkatkan keamanan akun dengan kode OTP dari aplikasi authenticator."}
                      </p>
                    </div>
                    <Button
                      variant={twoFAEnabled ? "outline" : "brand"}
                      size="sm"
                      className="ml-auto flex-shrink-0"
                      onClick={() => {
                        setTwoFAEnabled(!twoFAEnabled);
                        showSaved(twoFAEnabled ? "2FA dinonaktifkan" : "2FA berhasil diaktifkan");
                      }}
                    >
                      {twoFAEnabled ? "Nonaktifkan" : "Aktifkan 2FA"}
                    </Button>
                  </div>

                  {twoFAEnabled && (
                    <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recovery Codes</p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                        {["ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456", "QRST-7890", "UVWX-2345"].map((code) => (
                          <span key={code} className="p-2 bg-muted rounded-lg text-center">{code}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Simpan kode ini di tempat aman. Gunakan jika kehilangan akses ke aplikasi authenticator.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Riwayat Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { device: "Chrome · Windows", location: "Jakarta, Indonesia", time: "Sekarang", current: true },
                    { device: "Safari · iPhone 14", location: "Jakarta, Indonesia", time: "2 hari lalu", current: false },
                    { device: "Firefox · Mac", location: "Surabaya, Indonesia", time: "5 hari lalu", current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border">
                      <div className="flex items-center gap-3">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{s.device}</p>
                          <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <Badge variant="success" className="text-xs">Sesi Ini</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500">Cabut</Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifikasi Tab */}
          {activeTab === "notifikasi" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferensi Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categories.map((cat) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{cat}</p>
                    <div className="space-y-2">
                      {NOTIFICATION_PREFS.filter((p) => p.category === cat).map((pref) => (
                        <div
                          key={pref.key}
                          className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors"
                        >
                          <p className="text-sm">{pref.label}</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifPrefs[pref.key] ?? pref.defaultOn}
                              onChange={(e) =>
                                setNotifPrefs((prev) => ({ ...prev, [pref.key]: e.target.checked }))
                              }
                            />
                            <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-brand-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button variant="brand" className="gap-2" onClick={() => showSaved("Preferensi notifikasi disimpan")}>
                    <Save className="h-4 w-4" />
                    Simpan Preferensi
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organisasi Tab */}
          {activeTab === "organisasi" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profil Organisasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nama Organisasi</label>
                      <Input defaultValue="Yayasan Cerdas Nusantara" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Jenis Organisasi</label>
                      <select className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>NGO / Yayasan</option>
                        <option>Koperasi</option>
                        <option>Komunitas</option>
                        <option>Sekolah / Universitas</option>
                        <option>Social Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">NPWP</label>
                      <Input defaultValue="12.345.678.9-012.345" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Website</label>
                      <Input defaultValue="https://cerdas-nusantara.org" type="url" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Alamat Lengkap</label>
                      <Input defaultValue="Jl. Pendidikan No. 12, Jakarta Selatan, DKI Jakarta" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Deskripsi Organisasi</label>
                      <textarea
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-24 resize-none"
                        defaultValue="Yayasan yang bergerak di bidang pendidikan untuk anak-anak kurang mampu di wilayah 3T Indonesia."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="brand" className="gap-2" onClick={() => showSaved("Profil organisasi disimpan")}>
                      <Save className="h-4 w-4" />
                      Simpan Profil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status Verifikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-700">Organisasi Terverifikasi</p>
                      <p className="text-xs text-green-600 mt-0.5">
                        Organisasi Anda telah diverifikasi oleh admin platform pada 8 April 2025. Anda dapat mengajukan proposal secara penuh.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
