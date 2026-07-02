"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-surface-container-lowest/95 py-sm shadow-lg backdrop-blur-md"
          : "bg-surface-container-lowest/80 py-md"
      )}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300",
          scrolled
            ? "bg-gradient-to-r from-transparent via-primary to-transparent opacity-100"
            : "bg-outline-variant opacity-100"
        )}
      />
      <div className="mx-auto flex max-w-container-max items-center justify-between px-gutter">
        <div className="flex items-center gap-md">
          <Logo logoUrl={logoUrl} />
          <nav className="hidden items-center gap-lg md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center gap-1.5 font-body-md text-body-md font-medium transition-colors hover:text-primary",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-on-surface-variant"
                )}
              >
                {isActive(link.href) && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse-dot"
                    aria-hidden="true"
                  />
                )}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-md">
          <div
            className={cn(
              "hidden items-center rounded-full border border-outline-variant bg-surface-container-high px-4 py-2 transition-all duration-200 ease-out lg:flex",
              searchFocused
                ? "w-80 ring-2 ring-primary-container/40 shadow-glow"
                : "w-64"
            )}
          >
            <Search className="h-5 w-5 text-on-surface-variant" aria-hidden="true" />
            <Label htmlFor="nav-search" className="sr-only">
              Search products
            </Label>
            <Input
              id="nav-search"
              type="search"
              placeholder="Search products..."
              className="h-auto border-none bg-transparent px-2 py-0 focus-visible:ring-0"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          <Button size="pill" className="group hidden sm:inline-flex hover:shadow-glow">
            <Sparkles className="mr-1.5 h-4 w-4" />
            Top Picks
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Menu</SheetTitle>
              <nav className="mt-lg flex flex-col gap-sm" aria-label="Mobile">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "relative inline-flex items-center gap-1.5 rounded-lg px-md py-3 font-body-md text-body-md transition-colors hover:bg-surface-variant",
                        isActive(link.href)
                          ? "font-bold text-primary"
                          : "text-on-surface-variant"
                      )}
                    >
                      {isActive(link.href) && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse-dot"
                          aria-hidden="true"
                        />
                      )}
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <Button className="mt-md w-full">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Top Picks
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
