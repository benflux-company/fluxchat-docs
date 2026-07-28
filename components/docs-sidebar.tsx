"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "@/components/mobile-sidebar-context";

const MAIN_NAV = [
  { href: "/", label: "Overview" },
  { href: "/docs", label: "Docs" },
  { href: "/sdk", label: "SDKs" },
  { href: "/changelog", label: "Changelog" },
];

export const SIDEBAR: { group: string; items: { id: string; label: string }[] }[] = [
  { group: "Getting started", items: [
    { id: "intro", label: "Introduction" },
    { id: "install", label: "Installation" },
    { id: "quickstart", label: "Quickstart" },
  ] },
  { group: "Use cases", items: [
    { id: "support", label: "In-app support" },
    { id: "assistant", label: "AI assistant" },
  ] },
  { group: "Widget", items: [
    { id: "widget", label: "Overview" },
    { id: "modes", label: "Floating & inline" },
    { id: "themes", label: "Light & dark" },
    { id: "customization", label: "Customization" },
    { id: "env-detection", label: "Dev / prod detection" },
    { id: "auto-context", label: "Auto-context" },
  ] },
  { group: "Integrations", items: [{ id: "integrations", label: "React, Next, Vue…" }] },
  { group: "Reference", items: [
    { id: "sdk", label: "SDK & ask" },
    { id: "persona", label: "Persona & config" },
    { id: "strict-mode", label: "Strict KB mode" },
    { id: "kb", label: "Knowledge base" },
    { id: "auto-crawl", label: "Auto-crawl" },
    { id: "cli", label: "CLI" },
    { id: "auth", label: "Auth & scopes" },
    { id: "api-keys", label: "Dev & prod keys" },
    { id: "versions", label: "API versions" },
  ] },
  { group: "For Developers", items: [
    { id: "for-devs", label: "Build an SDK" },
    { id: "community-sdks", label: "Community SDKs" },
    { id: "sandbox", label: "Sandbox credentials" },
    { id: "sandbox-verify", label: "Verify your capture" },
    { id: "api-reference", label: "REST API reference" },
    { id: "sdk-checklist", label: "Implementation checklist" },
    { id: "sdk-folder-structure", label: "Folder structure" },
    { id: "sdk-test-coverage", label: "Test coverage" },
    { id: "sdk-examples", label: "Code examples" },
    { id: "contributing", label: "How to contribute" },
    { id: "bot-pipeline", label: "Bot pipeline" },
    { id: "priority-order", label: "Context priority" },
    { id: "zero-config-sdk", label: "Zero-config (mobile)" },
  ] },
  { group: "Project", items: [
    { id: "contributing-js", label: "JS SDK — Contributing" },
    { id: "contributors", label: "Contributors" },
  ] },
];

const ALL_IDS = SIDEBAR.flatMap((g) => g.items).map((i) => i.id);

export function DocsSidebar() {
  const [active, setActive] = useState("intro");
  const { open, close } = useMobileSidebar();
  const idsRef = useRef(ALL_IDS);

  useEffect(() => {
    const ids = idsRef.current;

    // Map from id → whether it's currently intersecting
    const intersecting = new Map<string, boolean>(ids.map((id) => [id, false]));

    const pick = () => {
      // Return the first id (in document order) that is currently intersecting
      for (const id of ids) {
        if (intersecting.get(id)) {
          setActive(id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => intersecting.set(e.target.id, e.isIntersecting));
        pick();
      },
      {
        // top offset = navbar height (56 px = 3.5 rem) + a little breathing room
        // bottom offset = only the top ~30% of the viewport triggers "active"
        rootMargin: "-64px 0px -70% 0px",
        threshold: 0,
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Fallback: if nothing is intersecting on load (page top), activate the first visible section
    const syncOnScroll = () => {
      if ([...intersecting.values()].some(Boolean)) return; // observer already has an active
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 80) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };

    window.addEventListener("scroll", syncOnScroll, { passive: true });
    syncOnScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncOnScroll);
    };
  }, []);

  const pathname = usePathname();

  const sectionLinks = (
    <div className="space-y-6">
      {SIDEBAR.map((g) => (
        <div key={g.group}>
          <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g.group}</h4>
          {g.items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={() => { setActive(it.id); close(); }}
              className={cn(
                "block rounded-md px-2 py-1.5 text-[13.5px] transition-colors hover:bg-accent hover:text-foreground",
                active === it.id
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {it.label}
            </a>
          ))}
        </div>
      ))}
    </div>
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
      <nav className="hidden space-y-6 lg:block">
        {sectionLinks}
      </nav>
    </>
  );
}
