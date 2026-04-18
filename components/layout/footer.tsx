"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useStructureCopy } from "@/components/providers/language-provider";

export function Footer() {
  const copy = useStructureCopy();
  const footerLinks = {
    platform: [
      { href: "/tentang", label: copy.navbar.about },
      { href: "/cara-kerja", label: copy.navbar.howItWorks },
      { href: "/faq", label: copy.navbar.faq },
      { href: "/blog", label: copy.navbar.blog },
      { href: "/kisah-sukses", label: copy.navbar.successStories },
    ],
    applicants: [
      { href: "/register?role=PENGUSUL", label: copy.navbar.registerApplicant },
      { href: "/panduan/proposal", label: copy.footer.proposalGuide },
      { href: "/panduan/verifikasi", label: copy.navbar.verification },
      { href: "/cara-kerja#pengusul", label: copy.footer.reporting },
    ],
    companies: [
      { href: "/register?role=PERUSAHAAN", label: copy.navbar.registerCompany },
      { href: "/panduan/perusahaan", label: copy.footer.companyGuide },
      { href: "/cara-kerja#escrow", label: copy.navbar.cofunding },
      { href: "/tentang#fee", label: copy.footer.fees },
    ],
    legal: [
      { href: "/kebijakan-privasi", label: copy.footer.privacy },
      { href: "/syarat-ketentuan", label: copy.footer.terms },
      { href: "/kebijakan-cookie", label: copy.footer.cookies },
      { href: "/keamanan", label: copy.footer.security },
    ],
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <span className="font-display text-xl font-bold text-white">
                CSR<span className="text-brand-400">Hub</span>
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-400">
              {copy.footer.description}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-brand-400" />
                <span>halo@csrhub.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-brand-400" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-brand-400" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-brand-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{copy.footer.platform}</h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-brand-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{copy.footer.forApplicants}</h3>
            <ul className="space-y-2.5">
              {footerLinks.applicants.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-brand-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{copy.footer.forCompanies}</h3>
            <ul className="space-y-2.5">
              {footerLinks.companies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-brand-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
          <p className="text-sm text-gray-400">{copy.footer.rights}</p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
