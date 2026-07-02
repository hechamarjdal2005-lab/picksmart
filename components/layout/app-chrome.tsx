"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function AppChrome({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string | null }) {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith("/admin");

  if (isAdminArea) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main id="main" className="pt-[72px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
