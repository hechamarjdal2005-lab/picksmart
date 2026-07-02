import Link from "next/link";
import { Share2, Globe } from "lucide-react";
import { Logo } from "./logo";
import {
  footerColumns,
  footerBlurb,
  affiliateDisclosure,
} from "@/lib/data";

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-lowest py-lg">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-lg px-gutter md:grid-cols-4 md:gap-md">
        <div className="space-y-md">
          <Logo />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {footerBlurb}
          </p>
          <div className="flex gap-sm">
            <Link
              href="#"
              aria-label="Share PickSmart"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all hover:bg-primary-container/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Share2 className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="#"
              aria-label="Visit our website"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all hover:bg-primary-container/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Globe className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-md font-display text-headline-sm text-on-surface">
              {col.title}
            </h2>
            <ul className="space-y-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="font-body-sm text-body-sm text-on-surface-variant underline transition-all hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-lg max-w-container-max border-t border-outline-variant/30 px-gutter pt-lg text-center">
        <p className="font-body-sm text-body-sm italic text-on-surface-variant">
          {affiliateDisclosure}
        </p>
      </div>
    </footer>
  );
}
