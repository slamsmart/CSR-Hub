# CSR Hub — Platform Kolaborasi CSR Nasional

Platform enterprise full-stack untuk menghubungkan perusahaan dengan NGO, komunitas, sekolah, dan lembaga sosial dalam program CSR yang terstandarisasi, terverifikasi, dan terukur dampaknya.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn-style components |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (Credentials + Google) |
| State | @tanstack/react-query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Upload | react-dropzone |
| Animation | Framer Motion |

---

## Setup & Instalasi

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/csrhub.git
cd csrhub
npm install
```

### 2. Konfigurasi Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi semua nilai yang diperlukan:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/csrhub_db"
NEXTAUTH_SECRET="your-secret-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
# Jalankan migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed data dummy (opsional, untuk development)
npx prisma db seed
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Akun Demo (setelah seed)

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@csrhub.id | Password123! |
| Admin Platform | admin@csrhub.id | Password123! |
| Verifikator | verifikator@csrhub.id | Password123! |
| Perusahaan | csr@pertamina-csr.id | Password123! |
| Pengusul/NGO | ketua@yayasan-cerdas.org | Password123! |

---

## Struktur Proyek

```
csrhub/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Halaman publik (landing page)
│   ├── (auth)/                   # Login & Register
│   └── (dashboard)/              # Dashboard per-role
│       ├── admin/                # Super Admin & Admin Platform
│       ├── verifikator/          # Halaman verifikasi
│       ├── perusahaan/           # Dashboard perusahaan
│       ├── pengusul/             # Dashboard pengusul/NGO
│       ├── notifikasi/           # Notifikasi
│       └── pengaturan/           # Pengaturan akun
├── components/
│   ├── ui/                       # Komponen UI reusable
│   ├── layout/                   # Navbar, Sidebar, Header
│   ├── dashboard/                # Komponen dashboard per-role
│   ├── proposals/                # Form wizard & halaman proposal
│   ├── projects/                 # Monitoring proyek
│   ├── cofunding/                # Co-funding & kolaborasi
│   ├── matching/                 # AI matching
│   ├── notifications/            # Notifikasi
│   ├── settings/                 # Pengaturan
│   ├── sustainability/           # Laporan sustainability
│   └── verifikasi/               # Verifikasi organisasi
├── lib/
│   ├── auth.ts                   # NextAuth config + RBAC
│   ├── security.ts               # Rate limiting, file validation, audit
│   ├── ai.ts                     # AI matching & analysis (local)
│   ├── notifications.ts          # Notification service
│   ├── api-helpers.ts            # Response helpers + pagination
│   └── utils.ts                  # Formatters (Rupiah, tanggal, dll)
├── prisma/
│   ├── schema.prisma             # Database schema lengkap
│   └── seed.ts                   # Data dummy Indonesia
├── middleware.ts                 # Auth + route protection + CSRF
├── types/index.ts                # TypeScript types & labels
└── .env.example                  # Template environment variables
```

---

## Fitur Utama

### Untuk Pengusul (NGO/Komunitas)
- ✅ Wizard form 6-langkah untuk pengajuan proposal
- ✅ Upload dokumen pendukung dengan validasi
- ✅ Monitoring proyek real-time
- ✅ Submit laporan berkala
- ✅ Tracking milestone & realisasi anggaran

### Untuk Perusahaan
- ✅ Dashboard dengan AI matching proposals
- ✅ Shortlist & bandingkan proposal
- ✅ Co-funding & kolaborasi multi-perusahaan
- ✅ Laporan sustainability otomatis (GRI/SDG aligned)
- ✅ Tracking dampak dan realisasi CSR

### Untuk Admin/Verifikator
- ✅ Review & verifikasi organisasi (KYC)
- ✅ Manajemen proposal (approve/revisi/tolak)
- ✅ Dashboard analitik nasional
- ✅ Audit trail lengkap

### Keamanan
- ✅ Autentikasi dua faktor (2FA)
- ✅ Rate limiting per-IP
- ✅ Account lockout (5 percobaan gagal)
- ✅ CSRF protection
- ✅ File upload validation (MIME + size + double-extension)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Audit log setiap aksi sensitif

---

## Roles & Akses

| Role | Deskripsi |
|---|---|
| SUPER_ADMIN | Akses penuh ke semua fitur dan konfigurasi platform |
| ADMIN_PLATFORM | Kelola proposal, pengguna, dan konten platform |
| VERIFIKATOR | Review dan verifikasi dokumen organisasi |
| AUDITOR | Akses baca ke laporan keuangan dan audit trail |
| PERUSAHAAN | Dashboard CSR, matching, co-funding, sustainability report |
| PENGUSUL | Buat proposal, monitoring proyek, submit laporan |
| DONOR_KOLABORATOR | Lihat dan dukung program aktif |
| PUBLIC | Akses terbatas ke informasi publik |

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET/POST | `/api/proposals` | List & buat proposal |
| GET/PATCH/DELETE | `/api/proposals/[id]` | Detail, update, hapus proposal |
| POST | `/api/ai/match` | Jalankan AI matching untuk perusahaan |
| POST | `/api/upload` | Upload file lampiran |
| GET | `/api/notifications` | List notifikasi |
| PATCH | `/api/notifications/[id]` | Update status notifikasi |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables di Vercel Dashboard sesuai `.env.example`.

### Docker (Self-hosted)

```bash
docker build -t csrhub .
docker run -p 3000:3000 --env-file .env csrhub
```

---

## Kontribusi

1. Fork repository
2. Buat branch: `git checkout -b feature/nama-fitur`
3. Commit: `git commit -m "feat: tambah fitur X"`
4. Push: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## Lisensi

MIT License — lihat [LICENSE](LICENSE)

---

*Dibangun dengan ❤️ untuk mendorong ekosistem CSR yang lebih transparan dan berdampak di Indonesia.*
