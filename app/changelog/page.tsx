import type { Metadata } from "next";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "Changelog" };

const RELEASES = [
  {
    version: "0.1.3", date: "2026-06-05", heading: "Changed",
    items: [
      "SDK & widget now default to API v2 (/api/v2) — required for per-request context (v1 rejects it).",
      "Documented v1/v2 API versions.",
    ],
  },
  {
    version: "0.1.2", date: "2026-06-05", heading: "Added",
    items: [
      "Widget: inline mode (mode: 'inline') — render the chat directly inside a container as a full support chat.",
    ],
  },
  {
    version: "0.1.1", date: "2026-06-05", heading: "Added",
    items: ["Widget: in-header light/dark toggle (themeToggle) with setTheme() / toggleTheme()."],
  },
  {
    version: "0.1.0", date: "2026-06-05", heading: "Added",
    items: [
      "SDK: FluxChat client — ask with per-request context, testKey, knowledge CRUD, persona config.",
      "CLI: fluxchat (ask, test, kb, config).",
      "Widget: customizable embeddable chat bubble with Benflux footer.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-sm font-semibold text-primary">Releases</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Changelog</h1>
        <p className="mt-3 text-muted-foreground">
          Notable changes to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px]">@fluxchat_sdk/sdk</code>. Follows{" "}
          <a className="text-primary" href="https://semver.org" target="_blank" rel="noreferrer">Semantic Versioning</a>.
        </p>

        <div className="mt-10 space-y-8">
          {RELEASES.map((r) => (
            <div key={r.version} className="relative border-l-2 border-border pl-7">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold">{r.version}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">{r.heading}</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[14.5px] text-muted-foreground">
                {r.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-muted-foreground">
          Full history on{" "}
          <a className="text-primary" href="https://github.com/benflux-company/fluxchat-sdk/commits/main" target="_blank" rel="noreferrer">GitHub</a>.
        </p>
      </div>
      <Footer />
    </main>
  );
}
