"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  X,
} from "lucide-react";
import { signOut } from "@/lib/supabase-admin";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/editorial", label: "Editorial Reviews", icon: Newspaper },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string | null, href: string) {
  return pathname === href || pathname?.startsWith(`${href}/`);
}

/** Current page title for the top bar, derived from the active nav item. */
function pageTitle(pathname: string | null) {
  const match = navItems.find((item) => isActive(pathname, item.href));
  return match?.label ?? "Admin";
}

function handleSignOut() {
  void signOut().then(() => window.location.assign("/admin/login"));
}

export function AdminShell({
  children,
  email,
}: {
  children: ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <>
      {/* Logo */}
      <Link
        href="/admin/dashboard"
        className="flex h-16 items-center gap-2 border-b border-[#2A2A3A] px-6"
        onClick={() => setMobileOpen(false)}
      >
        <span className="text-lg font-bold tracking-tight text-[#FF6B00]">
          PickSmart Admin
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#FF6B00] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Account / Sign out */}
      <div className="border-t border-[#2A2A3A] p-4">
        <div className="mb-3 px-1">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            Signed in as
          </div>
          <div className="mt-1 break-all text-sm text-white/80">{email}</div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#2A2A3A] bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0F] text-white">
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-[#2A2A3A] bg-[#12121A] lg:flex">
        {sidebar}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-[#2A2A3A] bg-[#12121A]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 z-10 rounded-md p-1 text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#2A2A3A] bg-[#12121A] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold text-white">{pageTitle(pathname)}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/55 sm:block">{email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg border border-[#2A2A3A] bg-white/[0.03] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
