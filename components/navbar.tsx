"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Github, Search, Command, LayoutDashboard, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobileSidebar } from "@/components/mobile-sidebar-context";
import { SearchModal } from "@/components/search-modal";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/docs", label: "Docs" },
  { href: "/sdk", label: "SDKs" },
  { href: "/changelog", label: "Changelog" },
];

export function Navbar() {
  const pathname = usePathname();
  const { open: sidebarOpen, toggle: toggleSidebar } = useMobileSidebar();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  // Pages that have a section sidebar — hamburger toggles that sidebar
  const hasSidebar = pathname.startsWith("/docs") || /^\/sdk\/.+/.test(pathname);

  const menuOpen = hasSidebar ? sidebarOpen : navOpen;
  const toggleMenu = hasSidebar ? toggleSidebar : () => setNavOpen((v) => !v);

  return (
    <>
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

          {/* Right-side icons + hamburger always last */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="mr-2 hidden h-8 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
            >
              <Search className="h-3 w-3" />
              <span className="text-xs">Search docs…</span>
              <kbd className="pointer-events-none ml-2 inline-flex h-4 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
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
            {/* Hamburger — always last, visible only on mobile */}
            <button
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav dropdown — only on pages without a section sidebar */}
      {!hasSidebar && navOpen && (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-border bg-background shadow-lg lg:hidden">
          <nav className="mx-auto max-w-screen-xl px-4 py-2">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
                    active ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
