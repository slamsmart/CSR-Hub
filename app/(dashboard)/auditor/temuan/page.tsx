import { Metadata } from "next";

export const metadata: Metadata = { title: "Temuan & Rekomendasi" };

export default function TemuanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Temuan & Rekomendasi</h1>
        <p className="section-subtitle">Daftar temuan audit dan tindak lanjut rekomendasi.</p>
      </div>
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-sm">Halaman dalam pengembangan</p>
      </div>
    </div>
  );
}
