"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Star, Users, DollarSign,
  Building2, ShieldCheck, BarChart3, Globe2, Zap, Award,
  FileText, Search, HandHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, useStructureCopy } from "@/components/providers/language-provider";

const BASE_STATS = [
  { value: "2.847", icon: FileText, color: "text-brand-600", bg: "bg-brand-50" },
  { value: "Rp 189M", icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50" },
  { value: "1,2 Juta", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "347", icon: Building2, color: "text-amber-600", bg: "bg-amber-50" },
];

const BASE_FEATURES = [
  { icon: Search, color: "text-brand-600", bg: "bg-brand-50" },
  { icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-50" },
  { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: HandHeart, color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Globe2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
];

const BASE_STEPS = [{ step: "01" }, { step: "02" }, { step: "03" }, { step: "04" }];

const SDG_EXAMPLES = {
  id: [
    { sdg: "SDG 4", label: "Pendidikan", color: "bg-red-500" },
    { sdg: "SDG 3", label: "Kesehatan", color: "bg-green-500" },
    { sdg: "SDG 8", label: "Pekerjaan Layak", color: "bg-amber-500" },
    { sdg: "SDG 13", label: "Iklim", color: "bg-teal-500" },
    { sdg: "SDG 1", label: "Tanpa Kemiskinan", color: "bg-red-600" },
    { sdg: "SDG 5", label: "Gender", color: "bg-orange-500" },
  ],
  en: [
    { sdg: "SDG 4", label: "Quality Education", color: "bg-red-500" },
    { sdg: "SDG 3", label: "Good Health", color: "bg-green-500" },
    { sdg: "SDG 8", label: "Decent Work", color: "bg-amber-500" },
    { sdg: "SDG 13", label: "Climate Action", color: "bg-teal-500" },
    { sdg: "SDG 1", label: "No Poverty", color: "bg-red-600" },
    { sdg: "SDG 5", label: "Gender Equality", color: "bg-orange-500" },
  ],
} as const;

const TESTIMONIALS = [
  { name: "Budi Santoso", role: "CSR Manager", company: "PT Maju Bersama Tbk", rating: 5 },
  { name: "Siti Rahayu", role: "Direktur Eksekutif", company: "Yayasan Peduli Anak Bangsa", rating: 5 },
  { name: "Ahmad Fauzi", role: "Founder", company: "Komunitas Hijau Nusantara", rating: 5 },
];

export default function LandingPage() {
  const { language } = useLanguage();
  const copy = useStructureCopy();
  const stats = BASE_STATS.map((item, index) => ({ ...item, label: copy.home.impact[index].label }));
  const impactStats = [
    { value: "Rp 189M+", ...copy.home.impact[0] },
    { value: "2.847", ...copy.home.impact[1] },
    { value: "1,2 Juta+", ...copy.home.impact[2] },
    { value: "94%", ...copy.home.impact[3] },
  ];
  const features = BASE_FEATURES.map((item, index) => ({
    ...item,
    title: copy.home.features[index].title,
    description: copy.home.features[index].description,
  }));
  const steps = BASE_STEPS.map((item, index) => ({
    ...item,
    title: copy.home.steps[index].title,
    description: copy.home.steps[index].description,
    forRole: copy.home.steps[index].forRole,
  }));
  const testimonials = TESTIMONIALS.map((item, index) => ({
    ...item,
    content: copy.home.testimonialsList[index],
  }));
  const sdgs = SDG_EXAMPLES[language];

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-screen items-center pt-16 gradient-hero">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-7xl px-4 py-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-brand-300" />
                <span>{copy.home.badge}</span>
              </div>

              <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                {copy.home.heroTitle1}
                <span className="block bg-gradient-to-r from-brand-300 to-teal-300 bg-clip-text text-transparent">
                  {copy.home.heroTitle2}
                </span>
                {copy.home.heroTitle3}
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-white/80">
                {copy.home.heroDescription}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register?role=PERUSAHAAN">
                  <Button size="lg" variant="brand" className="w-full gap-2 sm:w-auto">
                    {copy.home.companyCta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register?role=PENGUSUL">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white sm:w-auto"
                  >
                    {copy.home.applicantCta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-300" />
                  <span className="text-sm text-white/70">{copy.home.verified}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-300" />
                  <span className="text-sm text-white/70">{copy.home.free}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl border border-white/80 bg-white p-6 shadow-lg">
                    <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="font-display text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-3">
            <span className="mr-2 self-center text-sm text-white/50">{copy.home.contributesTo}</span>
            {sdgs.map((sdg) => (
              <span
                key={sdg.sdg}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm"
              >
                <span className={`h-2 w-2 rounded-full ${sdg.color}`} />
                {sdg.sdg}: {sdg.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {impactStats.map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display text-3xl font-bold text-brand-600 md:text-4xl">{item.value}</p>
                <p className="mt-1 font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Badge variant="brand" className="mb-4">{copy.home.featured}</Badge>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {copy.home.featuredTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {copy.home.featuredDescription}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.bg}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Badge variant="teal" className="mb-4">{copy.home.how}</Badge>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{copy.home.howTitle}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={step.step} className="relative">
                {idx < steps.length - 1 && (
                  <div className="absolute left-full top-8 z-0 hidden h-0.5 w-full -translate-y-0.5 bg-gradient-to-r from-brand-200 to-teal-200 lg:block" />
                )}
                <div className="relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg gradient-brand font-display">
                    {step.step}
                  </div>
                  <Badge variant="secondary" className="mb-3 text-xs">{step.forRole}</Badge>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Badge variant="success" className="mb-4">{copy.home.testimonials}</Badge>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{copy.home.testimonialsTitle}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white gradient-brand">
                      {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} • {t.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 gradient-hero">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-4 text-center text-white">
          <h2 className="mb-6 font-display text-3xl font-bold md:text-4xl">{copy.home.ctaTitle}</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">{copy.home.ctaDescription}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register?role=PERUSAHAAN">
              <Button size="xl" variant="brand" className="w-full gap-2 sm:w-auto">
                <Building2 className="h-5 w-5" />
                {copy.home.registerCompany}
              </Button>
            </Link>
            <Link href="/register?role=PENGUSUL">
              <Button size="xl" className="w-full gap-2 bg-white text-brand-700 hover:bg-white/90 sm:w-auto">
                <Users className="h-5 w-5" />
                {copy.home.ctaApplicant}
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/60">{copy.home.ctaFoot}</p>
        </div>
      </section>
    </div>
  );
}
