import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_LINKS = {
  platform: [
    { href: "/tentang", label: "Tentang CSR Hub" },
    { href: "/cara-kerja", label: "Cara Kerja" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog & Berita" },
    { href: "/kisah-sukses", label: "Kisah Sukses" },
  ],
  untuk_pengusul: [
    { href: "/register?role=PENGUSUL", label: "Daftar sebagai Pengusul" },
    { href: "/panduan/proposal", label: "Panduan Membuat Proposal" },
    { href: "/panduan/verifikasi", label: "Verifikasi Organisasi" },
    { href: "/cara-kerja#pengusul", label: "Pelaporan Program" },
  ],
  untuk_perusahaan: [
    { href: "/register?role=PERUSAHAAN", label: "Daftar sebagai Perusahaan" },
    { href: "/panduan/perusahaan", label: "Panduan untuk Perusahaan" },
    { href: "/cara-kerja#escrow", label: "Co-Funding & Escrow" },
    { href: "/tentang#fee", label: "Model Bisnis & Fee" },
  ],
  hukum: [
    { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
    { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
    { href: "/kebijakan-cookie", label: "Kebijakan Cookie" },
    { href: "/keamanan", label: "Keamanan" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                CSR<span className="text-brand-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Platform marketplace CSR nasional yang menghubungkan perusahaan dengan
              organisasi sosial untuk menciptakan dampak nyata bagi masyarakat Indonesia.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400 flex-shrink-0" />
                <span>halo@csrhub.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400 flex-shrink-0" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">
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
                  className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Untuk Pengusul</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.untuk_pengusul.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Untuk Perusahaan</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.untuk_perusahaan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2025 CSR Hub. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-6">
            {FOOTER_LINKS.hukum.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
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
