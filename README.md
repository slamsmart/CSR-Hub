# CSR Hub

Platform kolaborasi CSR nasional untuk mempertemukan perusahaan dengan NGO, komunitas, sekolah, dan lembaga sosial dalam program yang terverifikasi dan terukur dampaknya.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn-style components |
| Database | Supabase Postgres + Prisma ORM |
| Auth | NextAuth v5 (Credentials + Google) |
| State | @tanstack/react-query |
| Forms | React Hook Form + Zod |
| Upload | Supabase Storage + react-dropzone |
| Charts | Recharts |
| Animation | Framer Motion |

## Local Setup

1. Install dependency:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Isi `.env.local` minimal dengan:

```env
DATABASE_URL="postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres?schema=public"
SUPABASE_URL="https://project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="csrhub-assets"
NEXTAUTH_SECRET="your-secret-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

4. Generate Prisma client dan sinkronkan schema:

```bash
npx prisma generate
npx prisma db push
```

5. Seed data dummy bila perlu:

```bash
npx prisma db seed
```

6. Jalankan development server:

```bash
npm run dev
```

## Production Recommendation

Rekomendasi paling cocok untuk project ini adalah `Vercel + Supabase`.

- `Vercel` paling mulus untuk Next.js App Router, route handlers, dan NextAuth.
- `Supabase` sudah menangani PostgreSQL production dan storage file.
- `Netlify` masih bisa dipakai, tetapi biasanya butuh adaptasi lebih banyak untuk fitur Next.js yang server-heavy.
- `Cloudflare Pages` kurang ideal untuk setup ini karena project masih memakai Prisma dan Node runtime, jadi effort adaptasinya lebih tinggi.

Kalau targetnya cepat live, stabil, dan mudah dipelihara, pilih `Vercel`.

## Deploy ke Vercel

1. Push repo ke Git provider.
2. Import project ke Vercel.
3. Tambahkan semua environment variable dari `.env.example`.
4. Pastikan database Supabase sudah aktif dan bucket storage sudah dibuat.
5. Jalankan deploy production.

Command penting setelah env siap:

```bash
npx prisma generate
npx prisma db push
```

## Catatan Integrasi

- Database aplikasi memakai Prisma ke `Supabase Postgres`.
- Upload file sekarang diarahkan ke `Supabase Storage`.
- Attachment proposal tersimpan ke database saat draft atau submit.
- Form organisasi di halaman pengaturan sekarang membaca dan menyimpan data organisasi lewat API.
