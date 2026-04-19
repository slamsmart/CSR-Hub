"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Bell, Building2, Save, Eye, EyeOff, CheckCircle2, Smartphone, Key, Upload, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage, useStructureCopy } from "@/components/providers/language-provider";
import { getRoleLabels } from "@/types";

type SettingsTab = "profil" | "keamanan" | "notifikasi" | "organisasi";

const TAB_ICONS = { profil: User, keamanan: Lock, notifikasi: Bell, organisasi: Building2 } as const;

const CONTENT = {
  id: {
    headerDescription: "Kelola profil, keamanan, dan preferensi notifikasi Anda.",
    tabs: { profil: "Profil Akun", keamanan: "Keamanan", notifikasi: "Notifikasi", organisasi: "Organisasi" },
    savedUploadFormat: "Format harus JPG, PNG, atau WebP",
    savedUploadSize: "Ukuran maksimal 2MB",
    savedAvatarSuccess: "Foto profil berhasil diperbarui",
    savedAvatarError: "Gagal mengupload foto",
    savedProfileSuccess: "Profil berhasil disimpan",
    savedProfileError: "Gagal menyimpan profil",
    savedPasswordSuccess: "Password berhasil diubah",
    savedTwoFaOff: "2FA dinonaktifkan",
    savedTwoFaOn: "2FA berhasil diaktifkan",
    savedNotifSuccess: "Preferensi notifikasi disimpan",
    savedOrgSuccess: "Profil organisasi disimpan",
    profile: {
      title: "Informasi Pribadi", changePhoto: "Ganti Foto", uploading: "Mengupload...", photoHint: "JPG, PNG, atau WebP, maks. 2MB",
      fullName: "Nama Lengkap", email: "Email", phone: "Nomor HP", role: "Role", fullNamePlaceholder: "Nama lengkap",
      save: "Simpan Perubahan", dangerZone: "Zona Bahaya", deleteTitle: "Hapus Akun", deleteDescription: "Aksi ini permanen dan tidak dapat dibatalkan.", deleteButton: "Hapus Akun"
    },
    security: {
      passwordTitle: "Ubah Password", oldPassword: "Password Lama", oldPlaceholder: "Password saat ini", newPassword: "Password Baru",
      newPlaceholder: "Password baru (min. 8 karakter)", strengthHint: "Gunakan kombinasi huruf besar, angka, dan simbol",
      confirmPassword: "Konfirmasi Password Baru", confirmPlaceholder: "Ulangi password baru", changeButton: "Ubah Password",
      twoFaTitle: "Autentikasi Dua Faktor (2FA)", active: "Aktif", inactive: "Nonaktif", authApp: "Authenticator App",
      authEnabled: "2FA aktif menggunakan Google Authenticator / Authy.", authDisabled: "Tingkatkan keamanan akun dengan kode OTP dari aplikasi authenticator.",
      disable2fa: "Nonaktifkan", enable2fa: "Aktifkan 2FA", recoveryCodes: "Recovery Codes",
      recoveryHint: "Simpan kode ini di tempat aman. Gunakan jika kehilangan akses ke aplikasi authenticator.", loginHistory: "Riwayat Login",
      thisSession: "Sesi Ini", revoke: "Cabut",
      sessions: [
        { device: "Chrome - Windows", location: "Jakarta, Indonesia", time: "Sekarang", current: true },
        { device: "Safari - iPhone 14", location: "Jakarta, Indonesia", time: "2 hari lalu", current: false },
        { device: "Firefox - Mac", location: "Surabaya, Indonesia", time: "5 hari lalu", current: false }
      ]
    },
    notifications: {
      title: "Preferensi Notifikasi", save: "Simpan Preferensi", categories: { Proposal: "Proposal", Proyek: "Proyek", Matching: "Matching", Sistem: "Sistem" },
      prefs: [
        { key: "proposal_status", label: "Perubahan status proposal", category: "Proposal", defaultOn: true },
        { key: "proposal_komentar", label: "Komentar pada proposal saya", category: "Proposal", defaultOn: true },
        { key: "milestone_reminder", label: "Pengingat milestone jatuh tempo", category: "Proyek", defaultOn: true },
        { key: "laporan_reminder", label: "Pengingat laporan bulanan", category: "Proyek", defaultOn: true },
        { key: "ai_match", label: "Rekomendasi AI matching baru", category: "Matching", defaultOn: true },
        { key: "cofunding_invite", label: "Undangan co-funding", category: "Matching", defaultOn: true },
        { key: "verifikasi_update", label: "Update status verifikasi", category: "Sistem", defaultOn: true },
        { key: "platform_news", label: "Berita dan pembaruan platform", category: "Sistem", defaultOn: false }
      ]
    },
    organization: {
      title: "Profil Organisasi", orgName: "Nama Organisasi", orgType: "Jenis Organisasi", npwp: "NPWP", website: "Website",
      address: "Alamat Lengkap", description: "Deskripsi Organisasi", save: "Simpan Profil", verificationTitle: "Status Verifikasi",
      verified: "Organisasi Terverifikasi", verifiedDesc: "Organisasi Anda telah diverifikasi oleh admin platform pada 8 April 2025. Anda dapat mengajukan proposal secara penuh.",
      orgTypeOptions: ["NGO / Yayasan", "Koperasi", "Komunitas", "Sekolah / Universitas", "Social Enterprise"],
      orgNameValue: "Yayasan Cerdas Nusantara", websiteValue: "https://cerdas-nusantara.org",
      addressValue: "Jl. Pendidikan No. 12, Jakarta Selatan, DKI Jakarta",
      descriptionValue: "Yayasan yang bergerak di bidang pendidikan untuk anak-anak kurang mampu di wilayah 3T Indonesia."
    }
  },
  en: {
    headerDescription: "Manage your profile, security, and notification preferences.",
    tabs: { profil: "Account Profile", keamanan: "Security", notifikasi: "Notifications", organisasi: "Organization" },
    savedUploadFormat: "Please upload a JPG, PNG, or WebP image",
    savedUploadSize: "Maximum file size is 2MB",
    savedAvatarSuccess: "Profile photo updated successfully",
    savedAvatarError: "Failed to upload profile photo",
    savedProfileSuccess: "Profile saved successfully",
    savedProfileError: "Failed to save profile",
    savedPasswordSuccess: "Password updated successfully",
    savedTwoFaOff: "Two-factor authentication disabled",
    savedTwoFaOn: "Two-factor authentication enabled",
    savedNotifSuccess: "Notification preferences saved",
    savedOrgSuccess: "Organization profile saved",
    profile: {
      title: "Personal Information", changePhoto: "Change Photo", uploading: "Uploading...", photoHint: "JPG, PNG, or WebP, max 2MB",
      fullName: "Full Name", email: "Email", phone: "Phone Number", role: "Role", fullNamePlaceholder: "Full name",
      save: "Save Changes", dangerZone: "Danger Zone", deleteTitle: "Delete Account", deleteDescription: "This action is permanent and cannot be undone.", deleteButton: "Delete Account"
    },
    security: {
      passwordTitle: "Change Password", oldPassword: "Current Password", oldPlaceholder: "Enter your current password", newPassword: "New Password",
      newPlaceholder: "Enter a new password (min. 8 characters)", strengthHint: "Use a mix of uppercase letters, numbers, and symbols",
      confirmPassword: "Confirm New Password", confirmPlaceholder: "Repeat your new password", changeButton: "Update Password",
      twoFaTitle: "Two-Factor Authentication (2FA)", active: "Active", inactive: "Inactive", authApp: "Authenticator App",
      authEnabled: "2FA is enabled using Google Authenticator or Authy.", authDisabled: "Increase account security with one-time codes from an authenticator app.",
      disable2fa: "Disable", enable2fa: "Enable 2FA", recoveryCodes: "Recovery Codes",
      recoveryHint: "Store these codes in a safe place. Use them if you lose access to your authenticator app.", loginHistory: "Login History",
      thisSession: "Current Session", revoke: "Revoke",
      sessions: [
        { device: "Chrome - Windows", location: "Jakarta, Indonesia", time: "Now", current: true },
        { device: "Safari - iPhone 14", location: "Jakarta, Indonesia", time: "2 days ago", current: false },
        { device: "Firefox - Mac", location: "Surabaya, Indonesia", time: "5 days ago", current: false }
      ]
    },
    notifications: {
      title: "Notification Preferences", save: "Save Preferences", categories: { Proposal: "Proposals", Proyek: "Projects", Matching: "Matching", Sistem: "System" },
      prefs: [
        { key: "proposal_status", label: "Proposal status changes", category: "Proposal", defaultOn: true },
        { key: "proposal_komentar", label: "Comments on my proposals", category: "Proposal", defaultOn: true },
        { key: "milestone_reminder", label: "Upcoming milestone reminders", category: "Proyek", defaultOn: true },
        { key: "laporan_reminder", label: "Monthly report reminders", category: "Proyek", defaultOn: true },
        { key: "ai_match", label: "New AI matching recommendations", category: "Matching", defaultOn: true },
        { key: "cofunding_invite", label: "Co-funding invitations", category: "Matching", defaultOn: true },
        { key: "verifikasi_update", label: "Verification status updates", category: "Sistem", defaultOn: true },
        { key: "platform_news", label: "Platform news and updates", category: "Sistem", defaultOn: false }
      ]
    },
    organization: {
      title: "Organization Profile", orgName: "Organization Name", orgType: "Organization Type", npwp: "Tax ID", website: "Website",
      address: "Full Address", description: "Organization Description", save: "Save Profile", verificationTitle: "Verification Status",
      verified: "Verified Organization", verifiedDesc: "Your organization was verified by the platform admin on April 8, 2025. You can now submit proposals without restriction.",
      orgTypeOptions: ["NGO / Foundation", "Cooperative", "Community", "School / University", "Social Enterprise"],
      orgNameValue: "Yayasan Cerdas Nusantara", websiteValue: "https://cerdas-nusantara.org",
      addressValue: "Jl. Pendidikan No. 12, South Jakarta, DKI Jakarta",
      descriptionValue: "A foundation focused on expanding access to education for underserved children in Indonesia's frontier and remote regions."
    }
  }
} as const;

export function PengaturanPage() {
  const { data: session, update: updateSession } = useSession();
  const { language } = useLanguage();
  const copy = useStructureCopy();
  const roleLabels = getRoleLabels(language);
  const text = CONTENT[language];
  const tabs = [
    { key: "profil" as const, label: text.tabs.profil, icon: TAB_ICONS.profil },
    { key: "keamanan" as const, label: text.tabs.keamanan, icon: TAB_ICONS.keamanan },
    { key: "notifikasi" as const, label: text.tabs.notifikasi, icon: TAB_ICONS.notifikasi },
    { key: "organisasi" as const, label: text.tabs.organisasi, icon: TAB_ICONS.organisasi }
  ];
  const notificationPrefs = text.notifications.prefs;
  const categories = [...new Set(notificationPrefs.map((p) => p.category))];
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(Object.fromEntries(notificationPrefs.map((p) => [p.key, p.defaultOn])));
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(session?.user?.image || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileName, setProfileName] = useState(session?.user?.name || "");
  const [profilePhone, setProfilePhone] = useState((session?.user as { phone?: string } | undefined)?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgNpwp, setOrgNpwp] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgVerificationStatus, setOrgVerificationStatus] = useState<string | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setNotifPrefs(Object.fromEntries(CONTENT[language].notifications.prefs.map((p) => [p.key, p.defaultOn])));
  }, [language]);

  React.useEffect(() => {
    const orgId = (session?.user as { organizationId?: string } | undefined)?.organizationId;
    setOrganizationId(orgId || null);

    if (!orgId) {
      setOrgName("");
      setOrgType("");
      setOrgNpwp("");
      setOrgWebsite("");
      setOrgAddress("");
      setOrgDescription("");
      setOrgVerificationStatus(null);
      return;
    }

    let active = true;
    setLoadingOrg(true);

    fetch(`/api/organizations/${orgId}`)
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Gagal memuat organisasi");
        if (!active) return;

        const org = result.data;
        setOrgName(org.name || "");
        setOrgType(org.type || "");
        setOrgNpwp(org.nomorNPWP || "");
        setOrgWebsite(org.website || "");
        setOrgAddress(org.address || "");
        setOrgDescription(org.description || "");
        setOrgVerificationStatus(org.verificationStatus || null);
      })
      .catch(() => {
        if (active) showSaved(text.savedProfileError);
      })
      .finally(() => {
        if (active) setLoadingOrg(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user, text.savedProfileError]);

  function showSaved(msg: string) {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(null), 3000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return showSaved(text.savedUploadFormat);
    if (file.size > 2 * 1024 * 1024) return showSaved(text.savedUploadSize);
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
      await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: url }) });
      await updateSession({ image: url });
      showSaved(text.savedAvatarSuccess);
    } catch {
      showSaved(text.savedAvatarError);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profileName, phone: profilePhone }) });
      if (!res.ok) throw new Error();
      await updateSession({ name: profileName });
      showSaved(text.savedProfileSuccess);
    } catch {
      showSaved(text.savedProfileError);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveOrganization() {
    if (!organizationId) return;

    setSavingOrg(true);
    try {
      const res = await fetch(`/api/organizations/${organizationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName,
          website: orgWebsite,
          address: orgAddress,
          description: orgDescription,
          nomorNPWP: orgNpwp,
        }),
      });
      if (!res.ok) throw new Error();
      showSaved(text.savedOrgSuccess);
    } catch {
      showSaved(text.savedProfileError);
    } finally {
      setSavingOrg(false);
    }
  }

  const roleValue = useMemo(() => {
    const role = (session?.user as { role?: keyof typeof roleLabels } | undefined)?.role;
    return role ? roleLabels[role] ?? role : "";
  }, [roleLabels, session?.user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">{copy.dashboard.nav.settings}</h1>
        <p className="section-subtitle">{text.headerDescription}</p>
      </div>

      {savedMsg && (
        <div className="animate-fade-in fixed right-6 top-6 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          {savedMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                    activeTab === tab.key ? "border border-brand-200 bg-brand-50 text-brand-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.key && <ChevronRight className="ml-auto h-3 w-3" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 lg:col-span-3">
          {activeTab === "profil" && (
            <>
              <Card>
                <CardHeader><CardTitle className="text-base">{text.profile.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full border-2 border-border object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
                          {(profileName || session?.user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      {uploadingAvatar && <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /></div>}
                    </div>
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingAvatar ? text.profile.uploading : text.profile.changePhoto}
                      </Button>
                      <p className="mt-1 text-xs text-muted-foreground">{text.profile.photoHint}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.profile.fullName}</label><Input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder={text.profile.fullNamePlaceholder} /></div>
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.profile.email}</label><Input value={session?.user?.email || ""} type="email" disabled className="bg-muted" /></div>
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.profile.phone}</label><Input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="+62..." /></div>
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.profile.role}</label><Input value={roleValue} disabled className="bg-muted" /></div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="brand" className="gap-2" onClick={handleSaveProfile} loading={savingProfile}>
                      <Save className="h-4 w-4" />
                      {text.profile.save}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base text-red-600">{text.profile.dangerZone}</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                    <div>
                      <p className="text-sm font-semibold text-red-700">{text.profile.deleteTitle}</p>
                      <p className="mt-0.5 text-xs text-red-600">{text.profile.deleteDescription}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="mr-1.5 h-4 w-4" />{text.profile.deleteButton}</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "keamanan" && (
            <>
              <Card>
                <CardHeader><CardTitle className="text-base">{text.security.passwordTitle}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.security.oldPassword}</label>
                    <div className="relative">
                      <Input type={showOldPw ? "text" : "password"} placeholder={text.security.oldPlaceholder} className="pr-10" />
                      <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showOldPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.security.newPassword}</label>
                    <div className="relative">
                      <Input type={showNewPw ? "text" : "password"} placeholder={text.security.newPlaceholder} className="pr-10" />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-1 flex-1 rounded-full bg-muted" />)}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{text.security.strengthHint}</p>
                  </div>
                  <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.security.confirmPassword}</label><Input type="password" placeholder={text.security.confirmPlaceholder} /></div>
                  <div className="flex justify-end">
                    <Button variant="brand" className="gap-2" onClick={() => showSaved(text.savedPasswordSuccess)}><Lock className="h-4 w-4" />{text.security.changeButton}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{text.security.twoFaTitle}</CardTitle>
                    <Badge variant={twoFAEnabled ? "success" : "secondary"}>{twoFAEnabled ? text.security.active : text.security.inactive}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={cn("flex items-start gap-3 rounded-xl border p-4", twoFAEnabled ? "border-green-200 bg-green-50" : "bg-muted/50")}>
                    <Smartphone className={cn("mt-0.5 h-5 w-5 flex-shrink-0", twoFAEnabled ? "text-green-600" : "text-muted-foreground")} />
                    <div>
                      <p className="text-sm font-medium">{text.security.authApp}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{twoFAEnabled ? text.security.authEnabled : text.security.authDisabled}</p>
                    </div>
                    <Button
                      variant={twoFAEnabled ? "outline" : "brand"}
                      size="sm"
                      className="ml-auto flex-shrink-0"
                      onClick={() => {
                        setTwoFAEnabled(!twoFAEnabled);
                        showSaved(twoFAEnabled ? text.savedTwoFaOff : text.savedTwoFaOn);
                      }}
                    >
                      {twoFAEnabled ? text.security.disable2fa : text.security.enable2fa}
                    </Button>
                  </div>

                  {twoFAEnabled && (
                    <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{text.security.recoveryCodes}</p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-xs">{["ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456", "QRST-7890", "UVWX-2345"].map((code) => <span key={code} className="rounded-lg bg-muted p-2 text-center">{code}</span>)}</div>
                      <p className="text-xs text-muted-foreground">{text.security.recoveryHint}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">{text.security.loginHistory}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {text.security.sessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                      <div className="flex items-center gap-3">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{s.device}</p>
                          <p className="text-xs text-muted-foreground">{s.location} - {s.time}</p>
                        </div>
                      </div>
                      {s.current ? <Badge variant="success" className="text-xs">{text.security.thisSession}</Badge> : <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500">{text.security.revoke}</Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "notifikasi" && (
            <Card>
              <CardHeader><CardTitle className="text-base">{text.notifications.title}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {categories.map((cat) => (
                  <div key={cat}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {text.notifications.categories[cat as keyof typeof text.notifications.categories]}
                    </p>
                    <div className="space-y-2">
                      {notificationPrefs.filter((p) => p.category === cat).map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/30">
                          <p className="text-sm">{pref.label}</p>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={notifPrefs[pref.key] ?? pref.defaultOn}
                              onChange={(e) => setNotifPrefs((prev) => ({ ...prev, [pref.key]: e.target.checked }))}
                            />
                            <div className="h-5 w-10 rounded-full bg-muted transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-600 peer-checked:after:translate-x-5" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button variant="brand" className="gap-2" onClick={() => showSaved(text.savedNotifSuccess)}><Save className="h-4 w-4" />{text.notifications.save}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "organisasi" && (
            <>
              <Card>
                <CardHeader><CardTitle className="text-base">{text.organization.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.organization.orgName}</label><Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={loadingOrg || !organizationId} /></div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.organization.orgType}</label>
                      <select className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={orgType} disabled>
                        <option value={orgType}>{orgType || "-"}</option>
                        {text.organization.orgTypeOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </div>
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.organization.npwp}</label><Input value={orgNpwp} onChange={(e) => setOrgNpwp(e.target.value)} disabled={loadingOrg || !organizationId} /></div>
                    <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.organization.website}</label><Input value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} type="url" disabled={loadingOrg || !organizationId} /></div>
                    <div className="md:col-span-2"><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.organization.address}</label><Input value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} disabled={loadingOrg || !organizationId} /></div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{text.organization.description}</label>
                      <textarea className="h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)} disabled={loadingOrg || !organizationId} />
                    </div>
                  </div>
                  {!organizationId && <p className="text-xs text-muted-foreground">Akun ini belum terhubung ke organisasi.</p>}
                  <div className="flex justify-end">
                    <Button variant="brand" className="gap-2" onClick={handleSaveOrganization} loading={savingOrg} disabled={!organizationId || loadingOrg}><Save className="h-4 w-4" />{text.organization.save}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">{text.organization.verificationTitle}</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-700">{text.organization.verified}</p>
                      <p className="mt-0.5 text-xs text-green-600">
                        {orgVerificationStatus === "TERVERIFIKASI"
                          ? text.organization.verifiedDesc
                          : `Status saat ini: ${orgVerificationStatus || "BELUM_DIAJUKAN"}`}
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
