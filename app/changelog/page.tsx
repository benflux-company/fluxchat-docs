import type { Metadata } from "next";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "Changelog" };

const RELEASES = [
  {
    version: "0.1.8", date: "2026-06-11", heading: "Added",
    items: [
      "Widget: quickReplies option — tap-to-send chip row shown below the greeting; chips disappear after first user message.",
      "Widget: smart input correction — debounced autocorrect chip (900 ms) with ghost-text inline preview; accept with Tab / → / click.",
      "Widget: modern redesign — glassmorphism panel shadow, gradient header with shimmer, slide-in message animation, per-row bot avatar, refined send button.",
      "Widget: suggestion chip bar (.fcw-suggestion) — shows corrected text above composer with Accept / Send / Dismiss actions.",
      "Gateway: public bot prompt respects org strictMode config — non-strict orgs answer from general knowledge when KB is empty.",
      "Gateway: anti-hallucination rule is now conditional — strict mode forces exact KB answers; non-strict mode allows general knowledge with org-fact guard.",
      "Gateway: bot config customInstructions field honoured in system prompt for persona override.",
    ],
  },
  {
    version: "0.1.7", date: "2026-06-11", heading: "Added",
    items: [
      "Widget: universal API interception — fetch() and XMLHttpRequest GET JSON responses are automatically captured and sent to the bot knowledge base.",
      "Widget: localStorage snapshot capture on load — user session data (excluding auth/token keys) is captured as context.",
      "Widget: sendCapture() uses fetch keepalive:true instead of sendBeacon (supports custom X-API-Key header).",
      "Widget: client-side FNV-1a hash dedup — same-content captures are not re-sent.",
      "Gateway: auto-KB learning — after each capture, the AI gateway automatically extracts structured knowledge (title, content, category, keywords) and stores it permanently in bot_knowledge (source='auto').",
      "Gateway: content-change refresh — when captured content hash changes, stale auto-KB entry is deleted and re-extracted.",
      "Gateway: extraction concurrency limiter (max 2 per org) prevents AI API bursts on first visit.",
    ],
  },
  {
    version: "0.1.6", date: "2026-06-09", heading: "Added",
    items: [
      "Widget: sessionId persistence in localStorage — bot session memory survives page reloads.",
      "Widget: follow-up context retention — lastPlatformData reused for short follow-up questions ('which one?', 'tell me more').",
      "Widget: page link capture — internal <a href> links appended to DOM capture for navigation context.",
    ],
  },
  {
    version: "0.1.5", date: "2026-06-08", heading: "Added",
    items: [
      "Widget: autoCapture — passive DOM capture on every page visit via History API interception.",
      "Widget: platformApi — auto-discover and query host platform REST API for live data.",
      "Widget: per-org customisable assistant name, greeting, colours, and position.",
    ],
  },
  {
    version: "0.1.4", date: "2026-06-07", heading: "Added",
    items: [
      "Gateway: Redis session memory for stateless (public widget) mode — bot remembers the last 10 exchanges across page navigations (TTL 2h).",
      "Gateway: anti-hallucination prompt reinforcement with few-shot examples.",
      "Gateway: forceStrict mode for public widget — bot refuses to answer out-of-scope questions.",
    ],
  },
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
