"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "@/components/mobile-sidebar-context";

type NavItem = { id: string; label: string };

const MAIN_NAV = [
  { href: "/", label: "Overview" },
  { href: "/docs", label: "Docs" },
  { href: "/sdk", label: "SDKs" },
  { href: "/changelog", label: "Changelog" },
];

export function SdkSidebar({ navItems }: { navItems: NavItem[] }) {
  const [active, setActive] = useState(navItems[0]?.id ?? "");
  const { open, close } = useMobileSidebar();
  const pathname = usePathname();
  const idsRef = useRef(navItems.map((i) => i.id));

  useEffect(() => {
    const ids = idsRef.current;
    const intersecting = new Map<string, boolean>(ids.map((id) => [id, false]));

    const pick = () => {
      for (const id of ids) {
        if (intersecting.get(id)) { setActive(id); return; }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => intersecting.set(e.target.id, e.isIntersecting));
        pick();
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 },
    );

    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });

    const syncOnScroll = () => {
      if ([...intersecting.values()].some(Boolean)) return;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 80) { setActive(ids[i]); return; }
      }
      if (ids[0]) setActive(ids[0]);
    };

    window.addEventListener("scroll", syncOnScroll, { passive: true });
    syncOnScroll();

    return () => { observer.disconnect(); window.removeEventListener("scroll", syncOnScroll); };
  }, []);

  const sectionLinks = (
    <>
      <Link
        href="/sdk"
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        onClick={close}
      >
        ← All SDKs
      </Link>
      <div className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => { setActive(item.id); close(); }}
            className={cn(
              "block rounded-md px-2 py-1.5 text-[13.5px] transition-colors hover:bg-accent hover:text-foreground",
              active === item.id
                ? "bg-primary/10 font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: fixed overlay so it stays visible regardless of scroll position */}
      {open && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-background px-4 py-4 lg:hidden">
          <div className="mb-4 border-b border-border pb-4">
            {MAIN_NAV.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-foreground",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          {sectionLinks}
        </div>
      )}

      {/* Desktop: normal inline sidebar */}
      <nav className="hidden lg:block">
        {sectionLinks}
      </nav>
    </>
  );
}
