"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Github, Search, Command, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          <span>
            fluxchat<span className="text-muted-foreground">/</span>sdk
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-accent hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            className="mr-2 hidden h-8 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
            onClick={() => document.getElementById("install")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Search className="h-3 w-3" />
            <span className="text-xs">Search docs…</span>
            <kbd className="pointer-events-none ml-2 inline-flex h-4 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
          <a
            href="https://www.npmjs.com/package/@fluxchat_sdk/sdk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="npm"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332H10.666zm12.001 0h-1.331v-4h-1.336v4h-1.330v-4h-1.336v4h-2.671V8.667h8.005v5.331zM10.665 10H12v2.667h-1.335V10z" />
            </svg>
          </a>
          <a
            href="https://fluxchat-corp.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/benflux-company/fluxchat-sdk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
