import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(10, "Judul minimal 10 karakter"),
  description: z.string().min(50, "Deskripsi minimal 50 karakter"),
  category: z.string().min(1, "Pilih kategori"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  budget_requested: z.number().min(1000000, "Minimal Rp 1.000.000"),
  target_beneficiaries: z.number().min(1, "Minimal 1 penerima manfaat"),
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
  implementation_plan: z.string().min(30, "Rencana implementasi minimal 30 karakter"),
  sdg_goals: z.array(z.string()).min(1, "Pilih minimal 1 SDG"),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = [
  { value: "pendidikan", label: "Pendidikan" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "lingkungan", label: "Lingkungan Hidup" },
  { value: "ekonomi", label: "Pemberdayaan Ekonomi" },
  { value: "infrastruktur", label: "Infrastruktur" },
  { value: "budaya", label: "Seni & Budaya" },
  { value: "bencana", label: "Penanggulangan Bencana" },
  { value: "lainnya", label: "Lainnya" },
];

const SDGS = ["SDG 1","SDG 2","SDG 3","SDG 4","SDG 5","SDG 6","SDG 7","SDG 8","SDG 9","SDG 10","SDG 11","SDG 12","SDG 13","SDG 14","SDG 15","SDG 16","SDG 17"];
const STEPS = ["Informasi Dasar", "Detail Program", "SDG & Submit"];

export default function NewProposalPage() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sdg_goals: [] },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const data = await customFetch<{ id: number }>("/api/proposals", {
        method: "POST",
        body: JSON.stringify(values),
      });
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast.success("Proposal berhasil dibuat!");
      navigate(`/proposals/${data.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sdgGoals = watch("sdg_goals") ?? [];

  const toggleSdg = (sdg: string) => {
    const current = getValues("sdg_goals") ?? [];
    if (current.includes(sdg)) {
      setValue("sdg_goals", current.filter((s) => s !== sdg), { shouldValidate: true });
    } else {
      setValue("sdg_goals", [...current, sdg], { shouldValidate: true });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/proposals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Buat Proposal Baru</h1>
        <p className="text-muted-foreground text-sm mt-1">Ajukan program CSR Anda untuk mendapatkan pendanaan</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 ${
              i < step ? "bg-primary text-white" : i === step ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <Card>
          <CardContent className="p-6 space-y-5">
            {step === 0 && (
              <>
                <CardTitle className="text-base mb-4">Informasi Dasar Proposal</CardTitle>
                <div className="space-y-2">
                  <Label>Judul Proposal *</Label>
                  <Input placeholder="Program Beasiswa untuk Siswa Berprestasi di Kalimantan Barat" {...register("title")} />
                  {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi Program *</Label>
                  <Textarea placeholder="Jelaskan program CSR Anda secara detail..." rows={5} {...register("description")} />
                  {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori *</Label>
                    <Select onValueChange={(v) => setValue("category", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-destructive text-xs">{errors.category.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi *</Label>
                    <Input placeholder="Jakarta Selatan, DKI Jakarta" {...register("location")} />
                    {errors.location && <p className="text-destructive text-xs">{errors.location.message}</p>}
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <CardTitle className="text-base mb-4">Detail Program & Anggaran</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Anggaran Diajukan (Rp) *</Label>
                    <Input type="number" placeholder="150000000" onChange={(e) => setValue("budget_requested", Number(e.target.value))} />
                    {errors.budget_requested && <p className="text-destructive text-xs">{errors.budget_requested.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Target Penerima Manfaat *</Label>
                    <Input type="number" placeholder="500" onChange={(e) => setValue("target_beneficiaries", Number(e.target.value))} />
                    {errors.target_beneficiaries && <p className="text-destructive text-xs">{errors.target_beneficiaries.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanggal Mulai *</Label>
                    <Input type="date" {...register("start_date")} />
                    {errors.start_date && <p className="text-destructive text-xs">{errors.start_date.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Selesai *</Label>
                    <Input type="date" {...register("end_date")} />
                    {errors.end_date && <p className="text-destructive text-xs">{errors.end_date.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rencana Implementasi *</Label>
                  <Textarea placeholder="Deskripsikan tahapan pelaksanaan program, jadwal kegiatan, dan strategi monitoring..." rows={6} {...register("implementation_plan")} />
                  {errors.implementation_plan && <p className="text-destructive text-xs">{errors.implementation_plan.message}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <CardTitle className="text-base mb-4">Tujuan Pembangunan Berkelanjutan (SDGs)</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">Pilih SDGs yang relevan dengan program Anda (minimal 1):</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SDGS.map((sdg) => (
                    <div
                      key={sdg}
                      onClick={() => toggleSdg(sdg)}
                      className={`cursor-pointer border-2 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors ${
                        sdgGoals.includes(sdg)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {sdg}
                    </div>
                  ))}
                </div>
                {errors.sdg_goals && <p className="text-destructive text-xs">{errors.sdg_goals.message}</p>}

                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium mb-1">Ringkasan Proposal:</p>
                  <p className="text-xs text-muted-foreground">{watch("title") || "—"}</p>
                  <p className="text-xs text-muted-foreground">Anggaran: {watch("budget_requested") ? `Rp ${(watch("budget_requested")).toLocaleString("id-ID")}` : "—"}</p>
                  <p className="text-xs text-muted-foreground">SDGs: {sdgGoals.join(", ") || "—"}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={() => setStep(s => Math.max(s-1, 0))} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />Sebelumnya
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setStep(s => Math.min(s+1, STEPS.length-1))}>
              Berikutnya <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan sebagai Draft"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
