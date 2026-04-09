import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { customFetch } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, AlertCircle, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const data = await customFetch<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: (data) => {
      login(data.token);
      navigate("/dashboard");
    },
    onError: (err: Error) => {
      setError(err.message || "Login gagal. Periksa email dan password Anda.");
    },
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CSR Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">Platform CSR Indonesia</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Masuk ke Akun</CardTitle>
            <CardDescription>Gunakan email dan password Anda untuk masuk</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@organisasi.co.id" {...register("email")} />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-sm text-center">
            <p className="text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Daftar sekarang
              </Link>
            </p>
            <div className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 text-left">
              <p className="font-medium mb-1.5 text-foreground">Akun demo (password: 123):</p>
              <table className="w-full">
                <tbody>
                  <tr><td className="pr-2 font-mono">admin@csrhub.id</td><td className="text-muted-foreground/70">Admin</td></tr>
                  <tr><td className="pr-2 font-mono">budi@pertamina.com</td><td className="text-muted-foreground/70">Perusahaan</td></tr>
                  <tr><td className="pr-2 font-mono">ahmad@rumahzakat.org</td><td className="text-muted-foreground/70">NGO</td></tr>
                  <tr><td className="pr-2 font-mono">verifikator@csrhub.id</td><td className="text-muted-foreground/70">Verifikator</td></tr>
                  <tr><td className="pr-2 font-mono">auditor@csrhub.id</td><td className="text-muted-foreground/70">Auditor</td></tr>
                </tbody>
              </table>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
