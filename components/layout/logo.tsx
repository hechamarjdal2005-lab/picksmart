import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, logoUrl }: { className?: string; logoUrl?: string | null }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      aria-label="PickSmart home"
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt="PickSmart"
          width={160}
          height={40}
          className="h-8 w-auto transition-transform duration-200 hover:scale-105"
          priority
        />
      ) : (
        <Image
          src="/logo.svg"
          alt="PickSmart"
          width={160}
          height={40}
          className="h-8 w-auto"
          priority
        />
      )}
    </Link>
  );
}
