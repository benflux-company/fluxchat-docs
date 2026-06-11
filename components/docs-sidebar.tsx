"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

export function DocsSidebar() {
  const [active, setActive] = useState("intro");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = SIDEBAR.flatMap((g) => g.items).map((i) => i.id);

    const onScroll = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground lg:hidden"
      >
        {open ? "Hide" : "Menu"}
      </button>
      <nav className={cn("space-y-6", open ? "block" : "hidden lg:block")}>
        {SIDEBAR.map((g) => (
          <div key={g.group}>
            <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g.group}</h4>
            {g.items.map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-[13.5px] transition-colors hover:bg-accent hover:text-foreground",
                  active === it.id ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {it.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}
