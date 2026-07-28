import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs-sidebar";
import { CodeBlock } from "@/components/code-block";
import { StackTabs } from "@/components/stack-tabs";
import { Footer } from "@/components/footer";
import {
  VersionProvider,
  VersionSelect,
  VersionSwitch,
  V2Only,
  V1Only,
} from "@/components/version-selector";

export const metadata: Metadata = { title: "Documentation" };

function H2({ id, children }: Readonly<{ id: string; children: React.ReactNode }>) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-20 border-b border-border pb-2 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
function P({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{children}</p>;
}
function H3({ children, id }: Readonly<{ children: React.ReactNode; id?: string }>) {
  return <h3 id={id} className="mt-7 scroll-mt-20 text-lg font-semibold">{children}</h3>;
}
function Code({ children }: Readonly<{ children: React.ReactNode }>) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">{children}</code>;
}
function Callout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mt-4 rounded-lg border border-primary/30 bg-primary/[0.07] px-4 py-3 text-sm">{children}</div>;
}
function V2Badge() {
  return (
    <span className="ml-2 inline-block align-middle rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-primary/15 text-primary">
      v2 only
    </span>
  );
}

const SKIP_LOGINS = new Set(["claude", "github-actions", "dependabot", "dependabot[bot]", "github-actions[bot]"]);

type Contributor = { login: string; avatar_url: string; html_url: string; contributions: number };

async function getContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/benflux-company/fluxchat-sdk/commits?per_page=100",
      { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return [];
    const data = await res.json() as { author: { login: string; avatar_url: string; html_url: string } | null }[];
    const counts = new Map<string, Contributor>();
    for (const c of data) {
      if (!c.author) continue;
      const { login, avatar_url, html_url } = c.author;
      if (SKIP_LOGINS.has(login.toLowerCase())) continue;
      const existing = counts.get(login);
      if (existing) existing.contributions++;
      else counts.set(login, { login, avatar_url, html_url, contributions: 1 });
    }
    return [...counts.values()].sort((a, b) => b.contributions - a.contributions);
  } catch {
    return [];
  }
}

export default async function DocsPage() {
  const contributors = await getContributors();
  return (
    <div className="mx-auto max-w-screen-xl px-4">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="py-8 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-border lg:pr-4 scroll-thin">
          <DocsSidebar />
        </aside>

        <article className="min-w-0 max-w-3xl pb-24 pt-10">
          <VersionProvider>
            <section id="intro" className="scroll-mt-20">
              <p className="text-sm font-semibold text-primary">Documentation</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight">FluxChat SDK</h1>
              <P>Add an AI assistant — or a full <b>in-app support</b> experience — to any product. This kit ships a typed SDK, a CLI, and an embeddable widget that adapts to light &amp; dark.</P>
            </section>

            {/* Version selector — shown right after the intro */}
            <div className="mt-8">
              <VersionSelect />
            </div>

            <H2 id="install">Installation</H2>
            <P>Works with npm, pnpm or yarn. Requires Node.js 18+ (the widget runs in any browser).</P>
            <CodeBlock filename="terminal" code={`# npm · pnpm · yarn
npm install @fluxchat_sdk/sdk
pnpm add @fluxchat_sdk/sdk
yarn add @fluxchat_sdk/sdk`} />

            <H2 id="quickstart">Quickstart</H2>
            <H3>1. Get your API key</H3>
            <VersionSwitch
              v1={<P>Open the <a className="text-primary" href="https://fluxchat-corp.com" target="_blank" rel="noreferrer">FluxChat dashboard</a> → API Keys → Generate. Add <Code>bot:write</Code> to manage the knowledge base.</P>}
              v2={<P>Open the <a className="text-primary" href="https://fluxchat-corp.com" target="_blank" rel="noreferrer">FluxChat dashboard</a> → API Keys → Generate — or use the provision endpoint to get a dev <b>and</b> prod key at once. Add <Code>bot:write</Code> to manage the knowledge base.</P>}
            />
            <H3>2. Send your first message</H3>
            <P>Create a client and call <Code>ask</Code>. Use <Code>context</Code> for real-time, priority data.</P>
            <VersionSwitch
              v1={<CodeBlock filename="first-call.ts" code={`import { FluxChat } from '@fluxchat_sdk/sdk';

const fluxchat = new FluxChat({ apiKey: process.env.FLUXCHAT_API_KEY });

const { reply } = await fluxchat.ask({ message: 'What are your opening hours?' });`} />}
              v2={<CodeBlock filename="first-call.ts" code={`import { FluxChat } from '@fluxchat_sdk/sdk';

const fluxchat = new FluxChat({ apiKey: process.env.FLUXCHAT_API_KEY });

const { reply } = await fluxchat.ask({
  message: 'What is the status of my order?',
  context: 'Order #1234 — shipped on June 3rd.',   // v2: injected as priority truth
});`} />}
            />
            <H3>3. Add the widget (optional)</H3>
            <VersionSwitch
              v1={<CodeBlock filename="index.html" code={`<script src="https://unpkg.com/@fluxchat_sdk/sdk/dist/widget.global.js"></script>
<script> FluxChatWidget.init({ apiKey: 'fc_prod_xxx' }); </script>`} />}
              v2={<CodeBlock filename="index.html" code={`<script src="https://unpkg.com/@fluxchat_sdk/sdk/dist/widget.global.js"></script>
<script>
  FluxChatWidget.init({
    apiKey: 'fc_prod_xxx',
    autoContext: true,   // captures page title, URL and visible text automatically
    autoCrawl: true,     // indexes this page in your KB on first load
  });
</script>`} />}
            />

            <H2 id="support">In-app support</H2>
            <P>FluxChat is a complete <b>in-app support</b> layer, not just an assistant. Embed the widget as your help channel: it answers from your knowledge base, uses live <Code>context</Code> about the signed-in user, and stays on-brand — cutting ticket volume.</P>
            <CodeBlock filename="support.ts" code={`const { reply } = await fluxchat.ask({
  message: userQuestion,
  context: \`Plan: \${user.plan}. Open tickets: \${tickets.length}.\`,
});`} />

            <H2 id="assistant">FluxChat AI assistant</H2>
            <P>Use the same kit as a general assistant: a persona you control, grounded on your knowledge base, with continuity when you pass a <Code>conversationId</Code>.</P>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] text-muted-foreground">
              <li><b>Stateless</b> by default for public widgets — nothing stored unless you keep a <Code>conversationId</Code>.</li>
              <li><b>Persona</b> per org — <Code>assistantName</Code>, <Code>tone</Code>, <Code>styleRules</Code>.</li>
              <li><b>Priority context</b> — <Code>context</Code> always wins over the KB.</li>
              <V2Only><li><b>Strict mode</b> — bot only answers from your KB, refuses anything outside it.</li></V2Only>
              <V2Only><li><b>Auto-context</b> — widget captures the current page automatically, no code needed.</li></V2Only>
            </ul>

            {/* ── Architecture ─────────────────────────────────── */}
            <H2 id="architecture">Architecture</H2>
            <P>FluxChat is a three-layer system: your <b>browser / app</b>, the <b>FluxChat Gateway</b> (NestJS, multi-tenant PostgreSQL, Redis), and <b>FluxChat AI</b> that never surfaces to end-users.</P>

            <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-muted/30 p-5 font-mono text-[12px] leading-relaxed text-muted-foreground">
              <pre>{`Browser / App                  FluxChat Gateway              FluxChat AI
─────────────────────────────────────────────────────────────────────
1. User visits page
   SDK auto-captures DOM ──────► POST /bot/pages
   + fetch/XHR JSON responses       │
   + localStorage snapshot          │ 2. extractAndLearn ─────────►
                                     │    (async, rate-limited)    │
                                     │ ◄── structured KB entry ────┘
                                     │    stored in bot_knowledge
                                     │
3. User sends message ─────────────► POST /bot/ask
                                     │
                                     │ 4. SQL ILIKE search
                                     │    bot_knowledge + bot_session_page
                                     │
                                     │ 5. Build system prompt
                                     │    = persona + KB context
                                     │      + live context + history
                                     │
                                     │ 6. Call FluxChat AI ────────►
                                     │ ◄── reply ──────────────────┘
4. ◄── reply ◄─────────────────────┘`}</pre>
            </div>

            <H3>Key components</H3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Layer</th>
                  <th className="px-4 py-2 font-medium">What it does</th>
                </tr></thead>
                <tbody>
                  {[
                    ["Widget SDK", "Embeddable JS bundle — captures context, sends messages, renders the chat UI."],
                    ["Gateway /bot/pages", "Receives captures (page DOM, API JSON, localStorage). Stores in bot_session_page (24h TTL) and triggers async KB extraction."],
                    ["extractAndLearn", "Background job per capture — FluxChat AI extracts structured knowledge (title, content, category, keywords) and upserts it permanently into bot_knowledge."],
                    ["bot_knowledge", "Permanent, searchable knowledge base per tenant schema. Source of truth for the bot."],
                    ["bot_session_page", "Short-lived live captures (24h). Searched first — highest priority, most recent data."],
                    ["Gateway /bot/ask", "Combines KB search results + context + conversation history into a system prompt, then calls FluxChat AI."],
                    ["Strict mode", "When enabled, the bot only answers from bot_knowledge. Off by default — bot falls back to general knowledge."],
                  ].map(([layer, desc]) => (
                    <tr key={String(layer)} className="border-t border-border">
                      <td className="px-4 py-2 font-semibold text-foreground">{layer}</td>
                      <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Auto-KB pipeline ──────────────────────────────── */}
            <V2Only>
              <H2 id="auto-kb">Auto-KB pipeline<V2Badge /></H2>
              <P>When <Code>autoCapture: true</Code> (the default), the widget silently captures every page the user visits and every JSON API response the app makes. The Gateway processes each capture in two stages.</P>

              <H3>Stage 1 — Ingest (immediate)</H3>
              <P>The widget POSTs the raw content to <Code>/api/v2/public/bot/pages</Code>. The Gateway stores it in <Code>bot_session_page</Code> (24-hour TTL) and makes it <b>instantly searchable</b> — the bot can answer questions about it right away.</P>

              <H3>Stage 2 — Extract (async, FluxChat AI)</H3>
              <P>For each new or changed capture, FluxChat AI extracts structured knowledge:</P>
              <CodeBlock filename="extracted-entry.json" code={`{
  "title": "Bengali Chicken Curry",
  "content": "Chicken curry from Bengal. Ingredients: 4 chicken breasts…",
  "category": "recipe",
  "keywords": ["chicken", "curry", "bengal", "spices"]
}`} />
              <P>This entry is written to <Code>bot_knowledge</Code> (permanent, no TTL). From that point on, the bot answers from the KB even after the session page expires. Extraction is <b>rate-limited to 2 concurrent jobs per org</b> to avoid spikes.</P>

              <H3>What gets captured</H3>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Source</th>
                    <th className="px-4 py-2 font-medium">Skipped when</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["page", "DOM innerText of <main> or <body> + visible links", "Under 80 chars (not yet rendered)"],
                      ["api", "GET JSON responses from fetch() or XHR", "Auth endpoints, uploads, binary, > 80 KB"],
                      ["cache", "localStorage key/value snapshot", "Token, auth, JWT, session, password keys"],
                    ].map(([type, source, skip]) => (
                      <tr key={String(type)} className="border-t border-border">
                        <td className="px-4 py-2"><Code>{type}</Code></td>
                        <td className="px-4 py-2 text-muted-foreground">{source}</td>
                        <td className="px-4 py-2 text-muted-foreground">{skip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout><b>Privacy:</b> Auth tokens, passwords, JWTs, session keys and binary data are never captured. The widget filters by key name for localStorage and by URL pattern for API calls.</Callout>
            </V2Only>

            <H2 id="widget">The embeddable widget</H2>
            <P>A floating chat bubble, great out of the box and fully themeable. Drop it in with a script tag, or import it in your framework.</P>
            <VersionSwitch
              v1={<CodeBlock filename="widget.ts" code={`import { init } from '@fluxchat_sdk/sdk/widget';

const widget = init({
  apiKey: 'fc_prod_xxx',
  clientName: 'Acme Bank',
  assistantName: 'Léa',
  primaryColor: '#5b6ef0',
});
// widget.open() · widget.toggleTheme() · widget.destroy()`} />}
              v2={<CodeBlock filename="widget.ts" code={`import { init } from '@fluxchat_sdk/sdk/widget';

const widget = init({
  apiKey: 'fc_prod_xxx',
  clientName: 'Acme Bank',
  assistantName: 'Léa',
  primaryColor: '#5b6ef0',
  autoEnvDetect: true,  // DEV badge on localhost, prod badge in production
  autoContext: true,    // captures page context automatically
  autoCrawl: true,      // indexes pages in your KB silently
});
// widget.open() · widget.toggleTheme() · widget.destroy()`} />}
            />

            {/* ── Quick replies ─────────────────────────────────── */}
            <H2 id="quick-replies">Quick replies</H2>
            <P>Show a row of tap-to-send chips below the greeting message. Great for onboarding — users see what the bot can answer before typing anything. The chips disappear as soon as the first message is sent.</P>
            <CodeBlock filename="widget-quick-replies.ts" code={`import { init } from '@fluxchat_sdk/sdk/widget';

init({
  apiKey: 'fc_prod_xxx',
  greeting: 'Bonjour ! Comment puis-je vous aider ?',
  quickReplies: [
    'Quelles sont vos horaires ?',
    'Comment vous contacter ?',
    'Voir les tarifs',
    'Suivre ma commande',
  ],
});`} />
            <Callout>Chips are <b>horizontally scrollable</b> — no limit on the number of items, though 3–5 is optimal for UX. Clicking a chip sends the message immediately and hides the row.</Callout>

            {/* ── Autocorrect ───────────────────────────────────── */}
            <V2Only>
              <H2 id="autocorrect">Smart input correction<V2Badge /></H2>
              <P>The widget automatically detects typos and grammar errors as the user types (debounced 900 ms). When a correction is found, a <b>suggestion chip</b> appears above the input — no configuration needed.</P>

              <H3>How it works</H3>
              <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px] text-muted-foreground">
                <li>User types a message with errors (minimum 7 characters).</li>
                <li>After 900 ms of inactivity, the widget sends the raw text to the bot with a correction prompt.</li>
                <li>If the bot returns a corrected version (normalized comparison — case, trailing punctuation), the suggestion chip appears above the input.</li>
                <li>User accepts with <Code>Tab</Code> / <Code>→</Code> / chip click, or sends corrected text directly.</li>
              </ol>

              <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-muted/30 p-5 font-mono text-[12px] leading-relaxed text-muted-foreground">
                <pre>{`  ┌─────────────────────────────────────────────────┐
  │ Correction suggérée :  [quel est le curry ?]  Envoyer  ×  │
  ├─────────────────────────────────────────────────┤
  │  kelle es le cury ?                      [Send] │
  └─────────────────────────────────────────────────┘`}</pre>
              </div>

              <P>The correction is powered by FluxChat AI — the UI label reads <b>"Correction suggérée"</b>. No configuration required; the feature is always active in the widget.</P>
              <Callout><b>Ghost text:</b> If the corrected text starts with what the user already typed, the missing suffix is shown inline as grey ghost text — same UX as mobile autocomplete. Accept with <Code>Tab</Code> or <Code>→</Code> at the end of the input.</Callout>
            </V2Only>

            <H2 id="modes">Floating &amp; inline</H2>
            <P>Two display modes via the <Code>mode</Code> option.</P>
            <H3>Floating (default) — a launcher bubble</H3>
            <CodeBlock filename="floating.ts" code={`init({ apiKey: 'fc_prod_xxx', mode: 'floating', position: 'right' });`} />
            <H3>Inline — a full support chat in your page</H3>
            <P>In <Code>inline</Code> mode the chat renders <b>directly inside a container</b> (no launcher, always open, fills its parent). Perfect for a <b>support / help page</b>. Give the container a height.</P>
            <CodeBlock filename="support-page.html" code={`<div id="support" style="height: 600px; max-width: 460px"></div>

<script src="https://unpkg.com/@fluxchat_sdk/sdk/dist/widget.global.js"></script>
<script>
  FluxChatWidget.init({ apiKey: 'fc_prod_xxx', mode: 'inline', target: '#support' });
</script>`} />

            <H2 id="themes">Light &amp; dark</H2>
            <P>The widget ships with both themes and an in-header sun/moon toggle (<Code>themeToggle</Code>, default true). Set the initial theme with <Code>theme</Code>, or hide the switch with <Code>themeToggle: false</Code>.</P>

            <H2 id="customization">Customization</H2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Option</th><th className="px-4 py-2 font-medium">Default</th><th className="px-4 py-2 font-medium">Description</th>
                </tr></thead>
                <tbody>
                  {([
                    ["clientName", "—", "Brand name in the header.", false],
                    ["assistantName", "Assistant", "Display name & avatar initial.", false],
                    ["primaryColor", "#4f46e5", "Header, bubbles & buttons color.", false],
                    ["theme", "light", "Initial theme: light / dark.", false],
                    ["themeToggle", "true", "In-header light/dark switch.", false],
                    ["mode", "floating", "floating bubble or inline support chat.", false],
                    ["position", "right", "Launcher corner (floating).", false],
                    ["context", "—", "Static context sent with every message.", false],
                    ["showBranding", "true", "Show the Benflux footer.", false],
                    ["greeting", "Bonjour…", "First bot message shown when the panel opens.", false],
                    ["quickReplies", "—", "Array of tap-to-send chips shown below the greeting.", false],
                    ["autoEnvDetect", "true", "DEV badge + header on localhost / fc_dev_ keys.", true],
                    ["autoContext", "true", "Auto-capture page title, URL and visible text as context.", true],
                    ["autoCapture", "true", "Passively capture every page + API call into the KB.", true],
                    ["autoCrawl", "false", "Silently index the current page in your KB on first load.", true],
                  ] as const).map(([opt, def, desc, v2only]) => (
                    <tr key={opt} className="border-t border-border">
                      <td className="px-4 py-2">
                        <Code>{opt}</Code>
                        {v2only && (
                          <V2Only>
                            <span className="ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-primary/15 text-primary">v2</span>
                          </V2Only>
                        )}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{def}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {v2only ? <V2Only>{desc}</V2Only> : desc}
                        {v2only && <V1Only>—</V1Only>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <V2Only>
              <H2 id="env-detection">Dev / prod detection<V2Badge /></H2>
              <P>The widget auto-detects whether it is running in a development environment using two signals — the API key prefix and the current hostname — and adjusts its behavior automatically.</P>
              <H3>API key prefixes</H3>
              <CodeBlock filename="terminal" code={`fc_dev_xxx   → development (relaxed rate limits, verbose logs)
fc_prod_xxx  → production (full enforcement)`} />
              <P>Use the provision endpoint to generate both keys at once for a new organisation:</P>
              <CodeBlock filename="provision.ts" code={`POST /api/v2/organizations/:orgId/api-keys/provision
// returns { dev: { key: 'fc_dev_xxx' }, prod: { key: 'fc_prod_xxx' } }`} />
              <H3>Hostname detection</H3>
              <P>Even with a prod key, the widget detects local hostnames (<Code>localhost</Code>, <Code>127.0.0.1</Code>, <Code>*.local</Code>, <Code>*.dev</Code>, <Code>*.test</Code>) and shows the DEV badge. The <Code>X-FluxChat-Env: development</Code> header is also sent with every request so the API can apply dev-mode rules.</P>
              <CodeBlock filename="widget.ts" code={`init({
  apiKey: 'fc_dev_xxx',     // fc_dev_ prefix → dev mode
  autoEnvDetect: true,      // default — can be set to false to disable
});`} />
              <Callout><b>Override:</b> Pass <Code>X-FluxChat-Env: development</Code> as a header to force dev mode even with a prod key — useful in staging environments.</Callout>
            </V2Only>

            <V2Only>
              <H2 id="auto-context">Auto-context<V2Badge /></H2>
              <P>When <Code>autoContext: true</Code> (the default in v2), the widget automatically captures the current page context and injects it into every message — no code required on your side.</P>
              <H3>Capture priority</H3>
              <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px] text-muted-foreground">
                <li><Code>window.fluxchatContext</Code> — set by your app at runtime (highest priority).</li>
                <li><Code>data-fluxchat="..."</Code> attributes on DOM elements.</li>
                <li>Page <Code>title</Code> + current <Code>URL</Code>.</li>
                <li>Visible text from <Code>&lt;main&gt;</Code> (or <Code>&lt;body&gt;</Code>), truncated to 3 000 chars.</li>
              </ol>
              <P>The auto-captured context is merged with any static <Code>context</Code> option and truncated to 8 000 chars before sending.</P>

              <H3>Injecting app data at runtime</H3>
              <P>Set <Code>window.fluxchatContext</Code> once (or update it whenever state changes) so the bot always has access to your live data — user profile, cart, subscription, current record, etc. The widget reads it at send time, not at init.</P>
              <CodeBlock filename="runtime-context.js" code={`// Basic — string or object, both work
window.fluxchatContext = "User: Marie, Plan: Pro, Cart: 2 items";

// Recommended — structured object (auto-serialised to JSON)
window.fluxchatContext = {
  user: { name: "Marie", email: "marie@example.com", plan: "Pro" },
  cart: [{ id: 1, name: "T-shirt", qty: 2, price: 29.99 }],
};

// Merging sections (e.g. set user at root, add billing on billing page)
window.fluxchatContext = {
  ...window.fluxchatContext,
  billing: { plan: "Enterprise", messages_used: 255, messages_limit: 500000 },
};`} />

              <H3>React / Next.js pattern</H3>
              <P>Set it in a <Code>useEffect</Code> at the root of your authenticated layout so the bot has full profile context on every page. Merge additional data (billing, cart, record details) deeper in the tree — each page just spreads the existing value and adds its own key.</P>
              <CodeBlock filename="AuthLayout.tsx" code={`// Root authenticated layout — runs once after login
useEffect(() => {
  if (!user) return;
  window.fluxchatContext = {
    user: {
      name: user.displayName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
    },
    org: { name: currentOrg.name },
  };
}, [user, currentOrg]);

// Billing page — adds quota data on top, removes on unmount
useEffect(() => {
  window.fluxchatContext = {
    ...window.fluxchatContext,
    billing: { plan: "Enterprise", messages_used: 255, messages_limit: 500000 },
  };
  return () => {
    const c = { ...window.fluxchatContext };
    delete c.billing;
    window.fluxchatContext = c;
  };
}, [subscription, usage]);`} />

              <Callout>The bot reads <Code>window.fluxchatContext</Code> at send time — update it at any point and the next message will include the latest value. No re-init needed.</Callout>
            </V2Only>

            <H2 id="integrations">Works with your stack</H2>
            <P>Pick your framework — copy, paste, done.</P>
            <StackTabs tabs={[
              { key: "react", label: "React", filename: "FluxChat.tsx", code: `import { useEffect } from 'react';
import { init } from '@fluxchat_sdk/sdk/widget';

export function FluxChat() {
  useEffect(() => {
    const w = init({ apiKey: import.meta.env.VITE_FLUXCHAT_API_KEY });
    return () => w.destroy();
  }, []);
  return null;
}` },
              { key: "next", label: "Next.js", filename: "app/fluxchat.tsx", code: `'use client';
import { useEffect } from 'react';
import { init } from '@fluxchat_sdk/sdk/widget';

export default function Widget() {
  useEffect(() => {
    const w = init({ apiKey: process.env.NEXT_PUBLIC_FLUXCHAT_KEY! });
    return () => w.destroy();
  }, []);
  return null;
}` },
              { key: "vue", label: "Vue", filename: "FluxChat.vue", code: `<script setup>
import { onMounted, onUnmounted } from 'vue';
import { init } from '@fluxchat_sdk/sdk/widget';
let w;
onMounted(() => (w = init({ apiKey: import.meta.env.VITE_FLUXCHAT_API_KEY })));
onUnmounted(() => w?.destroy());
</script>` },
              { key: "svelte", label: "Svelte", filename: "FluxChat.svelte", code: `<script>
  import { onMount } from 'svelte';
  import { init } from '@fluxchat_sdk/sdk/widget';
  onMount(() => init({ apiKey: import.meta.env.VITE_FLUXCHAT_API_KEY }).destroy);
</script>` },
              { key: "vanilla", label: "Vanilla", filename: "index.html", code: `<script src="https://unpkg.com/@fluxchat_sdk/sdk/dist/widget.global.js"></script>
<script> FluxChatWidget.init({ apiKey: 'fc_prod_xxx' }); </script>` },
              { key: "node", label: "Node.js", filename: "server.ts", code: `import { FluxChat } from '@fluxchat_sdk/sdk';
const fx = new FluxChat({ apiKey: process.env.FLUXCHAT_API_KEY });

app.post('/chat', async (req, res) => {
  const { reply } = await fx.ask({ message: req.body.message });
  res.json({ reply });
});` },
            ]} />

            <H2 id="sdk">SDK &amp; ask</H2>
            <P>The <Code>FluxChat</Code> client authenticates with an API key (or a JWT for admin operations). The <Code>organizationId</Code> is optional — only for knowledge &amp; config.</P>
            <VersionSwitch
              v1={<CodeBlock filename="client.ts" code={`const fluxchat = new FluxChat({
  apiKey: 'fc_prod_xxx',
  organizationId: 'org-uuid', // only needed for knowledge & config
});

const res = await fluxchat.ask({ message, conversationId });
const info = await fluxchat.testKey();`} />}
              v2={<CodeBlock filename="client.ts" code={`const fluxchat = new FluxChat({
  apiKey: 'fc_prod_xxx',
  organizationId: 'org-uuid', // only needed for knowledge & config
});

const res = await fluxchat.ask({ message, context, conversationId });
const info = await fluxchat.testKey();`} />}
            />
            <Callout><b>When do I need the Organization ID?</b> Only for <Code>knowledge.*</Code> and <Code>config.*</Code> (org-scoped URLs). <Code>ask</Code>, <Code>testKey</Code> and the widget don&apos;t need it — the API key already identifies your org.</Callout>

            <H2 id="persona">Persona &amp; config</H2>
            <P>Give the assistant its own identity per organization — a name, a tone, style rules and extra instructions. Applied to every answer, no knowledge-base entry needed.</P>
            <CodeBlock filename="persona.ts" code={`await fluxchat.config.update({
  assistantName: 'Léa',
  tone: 'chaleureux et concis',
  styleRules: 'Tutoie le client, évite le jargon.',
  captureTrainingData: false,
});

const current = await fluxchat.config.get();`} />
            <Callout>In the FluxChat dashboard, the persona is editable in <b>Bot IA → Personnalité</b> using your admin session — no manual JWT needed.</Callout>

            <V2Only>
              <H2 id="strict-mode">Strict KB mode<V2Badge /></H2>
              <P>When strict mode is enabled for your organisation, the bot <b>only answers questions covered by your knowledge base</b>. General knowledge questions (politics, geography, unrelated topics…) are politely refused in the user&apos;s own language. Greetings, thanks and small talk are always allowed.</P>
              <P>Strict mode is configured per-organisation in the dashboard (<b>Bot IA → Configuration → Strict mode</b>) or via the config API:</P>
              <CodeBlock filename="strict.ts" code={`await fluxchat.config.update({ strictMode: true });`} />
              <Callout><b>Language-aware:</b> The bot detects the user&apos;s language automatically and replies — including refusal messages — in the same language. All world languages are supported.</Callout>
            </V2Only>

            <H2 id="kb">Knowledge base</H2>
            <P>Writes work with a <Code>bot:write</Code> API key; reads need a JWT.</P>
            <CodeBlock filename="kb.ts" code={`await fluxchat.knowledge.create({ title: 'Horaires', content: 'Lun–Ven 9h–18h.' });
await fluxchat.knowledge.update(id, { content: 'Lun–Ven 8h–19h.' });
await fluxchat.knowledge.remove(id);
const all = await fluxchat.knowledge.list(); // JWT`} />

            <V2Only>
              <H2 id="auto-crawl">Auto-crawl<V2Badge /></H2>
              <P>Populate the knowledge base directly from your website — no manual article creation. Submit a URL (or a <Code>sitemap.xml</Code>) and the API fetches each page, extracts its content, and creates KB articles automatically. Duplicate URLs are skipped.</P>
              <H3>Via the SDK</H3>
              <CodeBlock filename="crawl.ts" code={`// Single page
await fluxchat.knowledge.crawl({ url: 'https://acme.com/faq' });

// From a sitemap (up to 20 pages)
await fluxchat.knowledge.crawl({
  url: 'https://acme.com/sitemap.xml',
  isSitemap: true,
  maxPages: 20,
});`} />
              <H3>Via the CLI</H3>
              <CodeBlock filename="terminal" code={`fluxchat kb crawl --url https://acme.com/faq
fluxchat kb crawl --url https://acme.com/sitemap.xml --sitemap --max-pages 20`} />
              <H3>Via the widget (autoCrawl)</H3>
              <P>Set <Code>autoCrawl: true</Code> in the widget options and it silently indexes the current page URL on first load — zero backend code required.</P>
              <CodeBlock filename="widget.ts" code={`init({ apiKey: 'fc_prod_xxx', autoCrawl: true });`} />
              <Callout>The crawl API requires a <Code>bot:write</Code> API key. Errors are swallowed in the widget — the chat works normally even if the crawl fails.</Callout>
            </V2Only>

            <H2 id="cli">CLI</H2>
            <P>Credentials via flags or <Code>FLUXCHAT_*</Code> env vars.</P>
            <VersionSwitch
              v1={<CodeBlock filename="terminal" code={`export FLUXCHAT_API_KEY="fc_prod_xxx"
fluxchat test
fluxchat ask "Bonjour !" --context "Client VIP"
fluxchat kb create --title "FAQ" --content "…"`} />}
              v2={<CodeBlock filename="terminal" code={`export FLUXCHAT_API_KEY="fc_prod_xxx"
fluxchat test
fluxchat ask "Bonjour !" --context "Client VIP"
fluxchat kb create --title "FAQ" --content "…"

# v2 — crawl a URL or sitemap
fluxchat kb crawl --url https://acme.com/faq
fluxchat kb crawl --url https://acme.com/sitemap.xml --sitemap --max-pages 20`} />}
            />

            <H2 id="auth">Auth &amp; scopes</H2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground"><th className="px-4 py-2 font-medium">Operation</th><th className="px-4 py-2 font-medium">Auth</th></tr></thead>
                <tbody>
                  <tr className="border-t border-border"><td className="px-4 py-2"><Code>ask</Code>, <Code>testKey</Code>, widget</td><td className="px-4 py-2 text-muted-foreground">API key (X-API-Key)</td></tr>
                  <tr className="border-t border-border"><td className="px-4 py-2">Knowledge write, crawl</td><td className="px-4 py-2 text-muted-foreground">API key with <Code>bot:write</Code></td></tr>
                  <tr className="border-t border-border"><td className="px-4 py-2">Knowledge read, persona config</td><td className="px-4 py-2 text-muted-foreground">JWT (admin)</td></tr>
                </tbody>
              </table>
            </div>

            <V2Only>
              <H2 id="api-keys">Dev &amp; prod keys<V2Badge /></H2>
              <P>v2 introduces two key types for the same organisation. Use your dev key locally and your prod key in production — same codebase, no environment switching required.</P>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Key</th>
                    <th className="px-4 py-2 font-medium">Prefix</th>
                    <th className="px-4 py-2 font-medium">Behaviour</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Dev</td>
                      <td className="px-4 py-2"><Code>fc_dev_xxx</Code></td>
                      <td className="px-4 py-2 text-muted-foreground">Relaxed rate limits, verbose API logs, DEV badge in widget.</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Prod</td>
                      <td className="px-4 py-2"><Code>fc_prod_xxx</Code></td>
                      <td className="px-4 py-2 text-muted-foreground">Full enforcement, no extra logging, no DEV badge.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <P>Provision both keys at once for a new organisation:</P>
              <CodeBlock filename="provision.sh" code={String.raw`curl -X POST /api/v2/organizations/$ORG_ID/api-keys/provision \
  -H "Authorization: Bearer $ADMIN_JWT"`} />
              <Callout>The widget detects the key prefix automatically (<Code>autoEnvDetect: true</Code> by default) and shows a DEV badge in the header when a dev key is used, or when the hostname is local.</Callout>
            </V2Only>

            <H2 id="versions">API versions</H2>
            <P>The FluxChat API is URI-versioned. Every endpoint is available on both <Code>/api/v1</Code> and <Code>/api/v2</Code>. This SDK and the widget target <b>v2</b> by default.</P>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Version</th>
                  <th className="px-4 py-2 font-medium">Base URL</th>
                  <th className="px-4 py-2 font-medium">Notes</th>
                </tr></thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2"><b>v2</b> <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-primary/15 text-primary">Latest</span></td>
                    <td className="px-4 py-2"><Code>…/api/v2</Code></td>
                    <td className="px-4 py-2 text-muted-foreground">Context, stateless asks, strict mode, auto-crawl, dev/prod keys.</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2"><b>v1</b> <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-muted text-muted-foreground">Stable</span></td>
                    <td className="px-4 py-2"><Code>…/api/v1</Code></td>
                    <td className="px-4 py-2 text-muted-foreground">Stable. Conversations always persisted. No <Code>context</Code> field.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <P>Sending <Code>context</Code> to v1 returns <Code>400</Code> — use v2 for context-aware answers.</P>

            <H2 id="for-devs">For Developers — Build an SDK</H2>
            <P>
              The JS/TypeScript SDK is the reference implementation. Community SDKs for other languages are tracked as open GitHub issues.
              Pick one, fork the repo, work inside <Code>sdk/&lt;language&gt;/</Code>, and submit a PR.
              All SDKs call the same REST API — no framework dependency required.
              Documentation lives in each SDK&apos;s <Code>README.md</Code>; this table is updated when a PR is merged.
            </P>

            <H3 id="community-sdks">Community SDKs</H3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Stack</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">README</th>
                    <th className="px-4 py-2 font-medium">Issue</th>
                    <th className="px-4 py-2 font-medium">Package</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    {
                      stack: "JS / TypeScript",
                      status: "available",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/README.md",
                      issue: null,
                      pkg: { label: "npm", href: "https://www.npmjs.com/package/@fluxchat_sdk/sdk" },
                    },
                    {
                      stack: "Python",
                      status: "open",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/python/README.md",
                      issue: "https://github.com/benflux-company/fluxchat-sdk/issues/1",
                      pkg: null,
                    },
                    {
                      stack: "PHP",
                      status: "open",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/php/README.md",
                      issue: "https://github.com/benflux-company/fluxchat-sdk/issues/2",
                      pkg: null,
                    },
                    {
                      stack: "Dart / Flutter",
                      status: "available",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/dart/README.md",
                      issue: null,
                      pkg: { label: "pub add", href: "https://pub.dev/packages/fluxchat_sdk" },
                    },
                    {
                      stack: "Go",
                      status: "available",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/go/README.md",
                      issue: null,
                      pkg: { label: "go get", href: "https://github.com/benflux-company/fluxchat-sdk/releases/tag/sdk%2Fgo%2Fv1.0.4" },
                    },
                    {
                      stack: "C# / .NET",
                      status: "open",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/dotnet/README.md",
                      issue: "https://github.com/benflux-company/fluxchat-sdk/issues/5",
                      pkg: null,
                    },
                    {
                      stack: "Swift (iOS / macOS)",
                      status: "open",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/swift/README.md",
                      issue: "https://github.com/benflux-company/fluxchat-sdk/issues/6",
                      pkg: null,
                    },
                    {
                      stack: "Kotlin (Android)",
                      status: "open",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/kotlin/README.md",
                      issue: "https://github.com/benflux-company/fluxchat-sdk/issues/7",
                      pkg: null,
                    },
                    {
                      stack: "React Native",
                      status: "open",
                      readme: "https://github.com/benflux-company/fluxchat-sdk/blob/main/sdk/react-native/README.md",
                      issue: "https://github.com/benflux-company/fluxchat-sdk/issues/8",
                      pkg: null,
                    },
                  ] as { stack: string; status: string; readme: string; issue: string | null; pkg: { label: string; href: string } | null }[]).map(({ stack, status, readme, issue, pkg }) => (
                    <tr key={stack} className="border-t border-border">
                      <td className="px-4 py-2 font-medium">{stack}</td>
                      <td className="px-4 py-2">
                        {status === "available" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">available</span>
                        ) : status === "in progress" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">in progress</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">open</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <a className="text-primary hover:underline" href={readme} target="_blank" rel="noreferrer">README →</a>
                      </td>
                      <td className="px-4 py-2">
                        {issue ? <a className="text-primary hover:underline" href={issue} target="_blank" rel="noreferrer">Claim →</a> : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-2">
                        {pkg ? <a className="text-primary hover:underline" href={pkg.href} target="_blank" rel="noreferrer">{pkg.label} →</a> : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Callout>This table is updated when a PR is merged. Contributors write their documentation in <Code>sdk/&lt;language&gt;/README.md</Code> — no need to modify this site.</Callout>

            {/* ── Sandbox ─────────────────────────────────── */}
            <H2 id="sandbox">Developer Sandbox</H2>
            <P>
              The sandbox is a real FluxChat organization reserved for contributors.
              It has an active 1-year subscription — all features unlocked, no rate limit surprises.
              Use it to test your SDK against the live API without creating your own account.
            </P>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-300">Sandbox credentials — public, do not use for production</p>
              <div className="grid gap-2 text-sm font-mono">
                <div className="flex gap-3"><span className="w-28 shrink-0 text-muted-foreground">Dashboard</span><a className="text-primary hover:underline break-all" href="https://fluxchat-corp.com" target="_blank" rel="noreferrer">https://fluxchat-corp.com</a></div>
                <div className="flex gap-3"><span className="w-28 shrink-0 text-muted-foreground">Login</span><span className="break-all select-all">heyakaf832@ocuser.com</span></div>
                <div className="flex gap-3"><span className="w-28 shrink-0 text-muted-foreground">Password</span><span className="select-all">Test1234567890@</span></div>
                <div className="flex gap-3"><span className="w-28 shrink-0 text-muted-foreground">Org ID</span><span className="break-all select-all">ba134db3-993d-4076-8431-bb2c922d4db2</span></div>
                <div className="flex gap-3"><span className="w-28 shrink-0 text-muted-foreground">API Key</span><span className="break-all select-all text-xs">fc_prod_f45868df738ddbec537c6c929570f1dad830fb0ca0cd5f82652e9eb7db4ede16</span></div>
                <div className="flex gap-3"><span className="w-28 shrink-0 text-muted-foreground">Base URL</span><span className="break-all select-all">https://dev-api.fluxchat-corp.com/api/v2</span></div>
              </div>
            </div>

            <Callout>The sandbox is shared — do not store personal data in it. Reset the KB anytime from the dashboard: <b>Bot → Knowledge base → Delete all</b>.</Callout>

            {/* ── Verify capture ───────────────────────────── */}
            <H2 id="sandbox-verify">Verifying your capture works</H2>
            <P>
              Testing <Code>capturePage</Code> is not just about getting a 204 back.
              You need to prove the full pipeline ran end-to-end: the page arrived, FluxChat AI extracted the knowledge, and the bot uses it when answering.
              Follow these 5 steps every time you test a capture.
            </P>

            <H3>Step 1 — Send a capture with a unique phrase</H3>
            <P>Use a phrase that could not possibly come from the AI general knowledge — something invented and specific. This eliminates false positives.</P>
            <CodeBlock filename="test-capture.http" code={`POST https://dev-api.fluxchat-corp.com/api/v2/public/bot/pages
Content-Type: application/json
X-API-Key: fc_prod_f45868df738ddbec537c6c929570f1dad830fb0ca0cd5f82652e9eb7db4ede16

{
  "url": "https://test.example.com/about",
  "title": "About FluxTest",
  "content": "FluxTest is a fictional company founded in 2099 by Zara Kowalski. Our slogan is: code never lies, only humans do."
}`} />
            <P><b>Expected response:</b></P>
            <CodeBlock filename="response" code={`HTTP/1.1 204 No Content`} />
            <P>204 means the capture was received and queued for extraction. The AI extraction runs async — wait ~5 seconds before the next step.</P>

            <H3>Step 2 — Ask the bot about the unique phrase</H3>
            <P>Now ask the bot something only answerable from that captured content.</P>
            <CodeBlock filename="test-ask.http" code={`POST https://dev-api.fluxchat-corp.com/api/v2/public/bot/ask
Content-Type: application/json
X-API-Key: fc_prod_f45868df738ddbec537c6c929570f1dad830fb0ca0cd5f82652e9eb7db4ede16

{
  "message": "Who founded FluxTest and what is their slogan?"
}`} />
            <P><b>Expected response (proof that extraction worked):</b></P>
            <CodeBlock filename="response.json" code={`{
  "success": true,
  "data": {
    "reply": "FluxTest was founded in 2099 by Zara Kowalski. Their slogan is: code never lies, only humans do.",
    "conversationId": "",
    "confidence": 1
  }
}`} />
            <P>If the bot answers with details from your captured page — your SDK works. If it says "I don't have this information", either the capture did not reach the server (check your request) or the extraction is still running (retry after 10 seconds).</P>

            <H3>Step 3 — Confirm in the dashboard</H3>
            <P>For a definitive proof, log in to the dashboard and check the knowledge base directly.</P>
            <div className="mt-3 rounded-xl border border-border bg-muted/30 p-4 text-sm space-y-2">
              <p><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground mr-2">1</span>Go to <a className="text-primary hover:underline font-medium" href="https://fluxchat-corp.com" target="_blank" rel="noreferrer">fluxchat-corp.com</a> and log in with the sandbox credentials above.</p>
              <p><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground mr-2">2</span>In the left sidebar, click <b>Bot</b> then <b>Base de connaissances</b>.</p>
              <p><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground mr-2">3</span>You should see an entry titled <b>"About FluxTest"</b> with the extracted content. If it appears — the full pipeline worked.</p>
              <p><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground mr-2">4</span>If the entry is NOT there after 30 seconds, the extraction failed. Check that <Code>content</Code> was not empty and was under 6000 characters.</p>
            </div>

            <H3>Step 4 — Test context maintenance</H3>
            <P>A correct SDK must also pass the same <Code>sessionId</Code> on every request. Without it, the bot loses context between messages. Verify it with two consecutive calls:</P>
            <CodeBlock filename="test-context.http" code={`// Message 1 — introduce something
POST /public/bot/ask
{ "message": "My name is Zara.", "sessionId": "test-session-001" }
→ bot: "Nice to meet you, Zara!"

// Message 2 — same sessionId — test context retention
POST /public/bot/ask
{ "message": "What is my name?", "sessionId": "test-session-001" }
→ bot: "Your name is Zara."   ← PASS

// Message 2 — NO sessionId — test that context is correctly absent
POST /public/bot/ask
{ "message": "What is my name?", "sessionId": "test-session-002" }
→ bot: "I don't have your name."   ← PASS (different session, no context)
`} />
            <Callout>If the second call with the same <Code>sessionId</Code> does NOT remember "Zara", your SDK is generating a new session ID per request instead of reusing the same one. Fix: generate the sessionId once (store in memory or localStorage) and reuse it for the entire session.</Callout>

            <H3>Step 5 — What a failing capture looks like</H3>
            <P>Know the difference between a bug in your SDK and an expected API error:</P>
            <CodeBlock filename="error-cases.txt" code={`400 Bad Request   → missing required field (url, title, or content is empty)
401 Unauthorized  → API key header missing or malformed
403 Forbidden     → API key is valid but lacks bot:write scope (use the sandbox key above — it has all scopes)
413               → content exceeds 6000 chars — truncate before sending
204 but bot doesn't answer → content was received but extraction is still running — wait 10s and retry
204 but entry missing from KB → content was too short or had no extractable facts (min ~50 words recommended)`} />

            <H3 id="api-reference">REST API — base URL</H3>
            <P>Base URL: <Code>https://dev-api.fluxchat-corp.com/api/v2</Code>. All public endpoints require <Code>X-API-Key: fc_prod_your_key</Code> in the request header.</P>
            <CodeBlock filename="ask.http" code={`POST /public/bot/ask
Content-Type: application/json
X-API-Key: fc_prod_your_key

{
  "message": "What are your opening hours?",
  "context": "User: Alice, Plan: Pro",    // optional — highest priority
  "sessionId": "sess_abc123",             // optional — stateful Redis session
  "conversationId": ""                    // optional — omit for stateless
}

// Success response (every endpoint follows this envelope)
{
  "success": true,
  "data": {
    "reply": "We are open Mon–Fri 9am–6pm.",
    "conversationId": "conv-uuid",        // empty string if stateless
    "intent": null,
    "confidence": 1
  },
  "timestamp": "2026-06-11T00:00:00.000Z"
}

// Error response
{
  "success": false,
  "statusCode": 403,
  "message": "API key missing required scope(s): bot:write",
  "timestamp": "2026-06-11T00:00:00.000Z"
}`} />
            <CodeBlock filename="other-endpoints.http" code={`// Verify API key
GET /public/bot/test
X-API-Key: fc_prod_your_key
→ { "data": { "organizationId": "uuid", "scopes": ["bot:write"] } }

// Passive page capture (no bot:write needed)
POST /public/bot/pages
{ "url": "https://app.com/about", "title": "About", "content": "…max 6000 chars…" }
→ 204 No Content

// KB article — requires bot:write scope
POST   /bot/knowledge          { title, content, category, keywords }
PATCH  /bot/knowledge/:id      { content: "updated" }
DELETE /bot/knowledge/:id      → 204

// Admin (JWT required)
GET    /bot/knowledge           list all articles
GET    /bot/knowledge/:id       get one article
GET    /bot/config              get persona config
PATCH  /bot/config              { assistantName, tone, styleRules, strictMode }`} />

            <H3 id="sdk-checklist">What every SDK must implement</H3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Feature</th>
                  <th className="px-4 py-2 font-medium">Auth</th>
                  <th className="px-4 py-2 font-medium">Required</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr></thead>
                <tbody>
                  {[
                    { feature: "ask(message, context?, conversationId?)", auth: "API key", req: "Yes", desc: "Send a message, return reply + conversationId" },
                    { feature: "testKey()", auth: "API key", req: "Yes", desc: "Verify the key, return organizationId + scopes" },
                    { feature: "capturePage(url, title, content)", auth: "API key", req: "Recommended", desc: "POST /public/bot/pages — passive capture for mobile/desktop SDKs" },
                    { feature: "knowledge.create(title, content, ...)", auth: "API key (bot:write)", req: "Yes", desc: "Add a KB article" },
                    { feature: "knowledge.update(id, patch)", auth: "API key (bot:write)", req: "Yes", desc: "Update a KB article" },
                    { feature: "knowledge.delete(id)", auth: "API key (bot:write)", req: "Yes", desc: "Delete a KB article" },
                    { feature: "knowledge.list()", auth: "JWT (admin)", req: "Yes", desc: "List all KB articles" },
                    { feature: "knowledge.get(id)", auth: "JWT (admin)", req: "Yes", desc: "Get one KB article" },
                    { feature: "FluxChatNetworkError", auth: "—", req: "Yes", desc: "Connection refused, timeout, DNS failure" },
                    { feature: "FluxChatApiError(status, message)", auth: "—", req: "Yes", desc: "HTTP 4xx / 5xx — include status code" },
                    { feature: "FluxChatConfigError(message)", auth: "—", req: "Yes", desc: "Missing API key, invalid baseUrl" },
                  ].map(({ feature, auth, req, desc }) => (
                    <tr key={feature} className="border-t border-border">
                      <td className="px-4 py-2 font-mono text-[11px] text-primary">{feature}</td>
                      <td className="px-4 py-2 text-muted-foreground text-[12px]">{auth}</td>
                      <td className="px-4 py-2 text-[12px]">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${req === "Yes" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>{req}</span>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground text-[13px]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3 id="sdk-folder-structure">Repository structure — monorepo layout</H3>
            <P>The <Code>fluxchat-sdk</Code> repo is a monorepo. The root contains the official JS/TS SDK. Each community SDK lives in its own <Code>sdk/&lt;language&gt;/</Code> subdirectory — self-contained with its own package config, README and tests.</P>
            <CodeBlock filename="fluxchat-sdk/" code={`fluxchat-sdk/               ← root = official JS/TS SDK (published to npm)
├── src/
├── dist/
├── package.json
├── README.md
│
├── sdk/                    ← community SDKs live here
│   ├── python/             ← your contribution goes here
│   │   ├── README.md       # install + quickstart for Python
│   │   ├── src/
│   │   ├── tests/
│   │   └── pyproject.toml
│   │
│   ├── flutter/
│   │   ├── README.md
│   │   ├── lib/
│   │   ├── test/
│   │   └── pubspec.yaml
│   │
│   ├── go/
│   │   ├── README.md
│   │   ├── fluxchat.go
│   │   ├── fluxchat_test.go
│   │   └── go.mod
│   │
│   └── <your-stack>/       ← same pattern for every other language
│       ├── README.md
│       ├── src/
│       ├── tests/
│       └── <package config>`} />

            <H3 id="sdk-test-coverage">Test coverage required</H3>
            <P>Every SDK PR must include tests covering these cases:</P>
            <CodeBlock filename="test-cases.txt" code={`✓ ask — successful response parsing
✓ ask — stateless (no conversationId → empty string returned)
✓ testKey — parse organizationId + scopes
✓ knowledge.create — create + parse response
✓ knowledge.list — list parsing
✓ knowledge.delete — 204 handling
✓ Network error (connection refused) → FluxChatNetworkError
✓ 401 Unauthorized → FluxChatApiError(401)
✓ 403 Forbidden (missing scope) → FluxChatApiError(403)`} />

            <H3 id="sdk-examples">Minimal ask() — language examples</H3>
            <CodeBlock filename="sdk/python/fluxchat.py" code={`import httpx
from dataclasses import dataclass

BASE_URL = "https://api.fluxchat-corp.com/api/v2"

@dataclass
class AskResponse:
    reply: str
    conversation_id: str

class FluxChatApiError(Exception):
    def __init__(self, status: int, message: str):
        self.status = status
        super().__init__(f"FluxChat API {status}: {message}")

class FluxChat:
    def __init__(self, api_key: str, base_url: str = BASE_URL):
        self._headers = {"X-API-Key": api_key, "Content-Type": "application/json"}
        self.base_url = base_url.rstrip("/")

    def ask(self, message: str, *, context: str | None = None,
            conversation_id: str | None = None) -> AskResponse:
        payload: dict = {"message": message}
        if context:     payload["context"] = context
        if conversation_id: payload["conversationId"] = conversation_id
        with httpx.Client() as c:
            r = c.post(f"{self.base_url}/public/bot/ask",
                       json=payload, headers=self._headers)
        if not r.is_success:
            raise FluxChatApiError(r.status_code, r.text)
        data = r.json()["data"]
        return AskResponse(reply=data["reply"],
                           conversation_id=data.get("conversationId", ""))

    def capture_page(self, url: str, title: str, content: str) -> None:
        with httpx.Client() as c:
            c.post(f"{self.base_url}/public/bot/pages",
                   json={"url": url, "title": title, "content": content[:6000]},
                   headers=self._headers)`} />
            <CodeBlock filename="sdk/go/client.go" code={`package fluxchat

import (
    "bytes"; "encoding/json"; "fmt"; "net/http"
)

const defaultBaseURL = "https://api.fluxchat-corp.com/api/v2"

type Client struct { apiKey, baseURL string; http *http.Client }

type AskOptions struct {
    Message        string \`json:"message"\`
    Context        string \`json:"context,omitempty"\`
    ConversationID string \`json:"conversationId,omitempty"\`
}
type AskResponse struct {
    Reply          string \`json:"reply"\`
    ConversationID string \`json:"conversationId"\`
}

func New(apiKey string) *Client {
    return &Client{apiKey: apiKey, baseURL: defaultBaseURL, http: &http.Client{}}
}

func (c *Client) Ask(opts AskOptions) (*AskResponse, error) {
    body, _ := json.Marshal(opts)
    req, _ := http.NewRequest("POST", c.baseURL+"/public/bot/ask", bytes.NewReader(body))
    req.Header.Set("X-API-Key", c.apiKey)
    req.Header.Set("Content-Type", "application/json")
    resp, err := c.http.Do(req)
    if err != nil { return nil, fmt.Errorf("network: %w", err) }
    defer resp.Body.Close()
    if resp.StatusCode >= 400 { return nil, fmt.Errorf("api error %d", resp.StatusCode) }
    var env struct{ Data AskResponse \`json:"data"\` }
    json.NewDecoder(resp.Body).Decode(&env)
    return &env.Data, nil
}`} />
            <CodeBlock filename="sdk/dart/fluxchat.dart" code={`import 'dart:convert';
import 'package:http/http.dart' as http;

class FluxChat {
  final String apiKey;
  final String baseUrl;
  FluxChat({required this.apiKey,
            this.baseUrl = 'https://api.fluxchat-corp.com/api/v2'});

  Future<Map<String, dynamic>> ask(String message,
      {String? context, String? conversationId}) async {
    final body = <String, dynamic>{'message': message};
    if (context != null) body['context'] = context;
    if (conversationId != null) body['conversationId'] = conversationId;
    final r = await http.post(
      Uri.parse('$baseUrl/public/bot/ask'),
      headers: {'X-API-Key': apiKey, 'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    if (r.statusCode >= 400) throw Exception('FluxChat \${r.statusCode}: \${r.body}');
    final data = jsonDecode(r.body)['data'];
    return {'reply': data['reply'], 'conversationId': data['conversationId'] ?? ''};
  }

  Future<void> capturePage(String url, String title, String content) =>
    http.post(Uri.parse('$baseUrl/public/bot/pages'),
      headers: {'X-API-Key': apiKey, 'Content-Type': 'application/json'},
      body: jsonEncode({'url': url, 'title': title,
                        'content': content.substring(0, content.length.clamp(0, 6000))}));
}`} />

            <H3 id="contributing">How to contribute — workflow</H3>
            <CodeBlock filename="terminal" code={`# 1. Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/fluxchat-sdk.git
cd fluxchat-sdk

# 2. Create your branch (sdk/<language> for new SDKs)
git checkout -b sdk/python

# 3. Create sdk/python/ with:
#    - README.md (install + quickstart)
#    - src/       (your implementation)
#    - tests/     (required test coverage — see above)
#    - pyproject.toml / go.mod / pubspec.yaml / etc.

# 4. Push and open a PR against main
git push origin sdk/python
# → open PR at github.com/benflux-company/fluxchat-sdk`} />
            <P>
              Branch naming: <Code>sdk/&lt;language&gt;</Code> for new SDKs, <Code>feat/&lt;description&gt;</Code> for features, <Code>fix/&lt;description&gt;</Code> for bugs.
              All PRs require one review by <a className="text-primary" href="https://github.com/benbaruka" target="_blank" rel="noreferrer">@benbaruka</a> before merge.
            </P>
            <H3 id="bot-pipeline">The bot pipeline — how a message becomes a reply</H3>
            <P>Understanding this pipeline is required to build a correct SDK. Here is exactly what happens on every <Code>POST /public/bot/ask</Code>:</P>
            <CodeBlock filename="pipeline.txt" code={`User message → POST /public/bot/ask
        │
        ▼
1. Authenticate X-API-Key → resolve organizationId + org config (strictMode, persona)
        │
        ▼
2. Upsert per-request context into bot_session_page (BEFORE stateless check)
        │
        ▼
3. Stateless check: no conversationId → skip DB load, reply won't be persisted
        │
        ▼
4. Build knowledge context
   a. ILIKE search in bot_knowledge  (permanent KB articles)
   b. ILIKE search in bot_session_page  (passively captured pages)
        │
        ▼
5. Intent detection (pattern match) → if matched, call org API/DB for live data
        │
        ▼
6. Build system prompt
   = persona (name, tone, style rules)
   + anti-hallucination rule (conditional on strictMode)
   + KB context (step 4a)
   + session page context (step 4b)
   + live action data (step 5)  ← highest priority
   + per-request context (from SDK)
        │
        ▼
7. FluxChat AI call
        │
        ▼
8. Return { reply, conversationId }   ← conversationId is "" if stateless`} />
            <H3 id="priority-order">Context priority order (highest → lowest)</H3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium w-8">#</th>
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium">What it is</th>
                </tr></thead>
                <tbody>
                  {[
                    ["1", "Action data", "Live DB/API result from intent detection — absolute source of truth"],
                    ["2", "Per-request context", "Injected by SDK per message — page content, user info, live platform data"],
                    ["3", "KB articles", "Curated by admins — permanent, structured knowledge"],
                    ["4", "Session pages", "Passively captured by SDK autoCapture — immediate, no admin needed"],
                    ["5", "FluxChat AI general knowledge", "Used only when nothing above matches AND strictMode is off"],
                  ].map(([n, src, desc]) => (
                    <tr key={String(n)} className="border-t border-border">
                      <td className="px-4 py-2 font-bold text-primary">{n}</td>
                      <td className="px-4 py-2 font-semibold">{src}</td>
                      <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3 id="zero-config-sdk">Zero-config features — implementing in non-JS SDKs</H3>
            <P><b>autoCapture on mobile / desktop (Flutter, Swift, Kotlin, React Native):</b> instead of DOM interception, expose a manual API and call it from screen lifecycle hooks.</P>
            <CodeBlock filename="mobile-capture.dart" code={`// Flutter — call when a new screen loads
@override
void initState() {
  super.initState();
  FluxChat.capturePage(
    url: 'app://my-app/\${widget.routeName}',
    title: widget.title,
    content: extractVisibleText(),   // serialize the screen's visible text
  );
}`} />
            <CodeBlock filename="mobile-capture-rn.js" code={`// React Native — call on screen focus
useEffect(() => {
  fluxchat.capturePage({
    url: \`app://my-app/\${route.name}\`,
    title: route.params?.title ?? route.name,
    content: extractScreenText(),
  });
}, [route]);`} />
            <P><b>autoContext — what to inject per request:</b></P>
            <CodeBlock filename="context-contract.txt" code={`Priority order when building the context string:
1. window.fluxchatContext (or platform equivalent) — user, org, any runtime data
2. data-fluxchat="…" attributes on DOM / screen elements
3. Screen title + current URL / route
4. Visible text from the main content area (first message only, max 3000 chars)

Rules:
- Set persistent data (user, org) once at app root, not per screen
- Always MERGE page-specific data — never overwrite the full object
- Clean up page-specific keys on screen unmount
- DOM / screen scraping only on first message — subsequent messages use context only`} />
            <P><b>HTTP status codes — what your SDK must handle:</b></P>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Meaning</th>
                  <th className="px-4 py-2 font-medium">Throw</th>
                </tr></thead>
                <tbody>
                  {[
                    ["401", "Invalid or missing API key", "FluxChatApiError(401)"],
                    ["403", "Valid key, missing scope (e.g. bot:write for KB writes)", "FluxChatApiError(403)"],
                    ["404", "Resource not found (knowledge article ID doesn't exist)", "FluxChatApiError(404)"],
                    ["422", "Validation error (message too long, missing required field)", "FluxChatApiError(422)"],
                    ["5xx", "Server error", "FluxChatApiError(status)"],
                    ["network", "Connection refused, timeout, DNS failure", "FluxChatNetworkError"],
                  ].map(([status, meaning, error]) => (
                    <tr key={String(status)} className="border-t border-border">
                      <td className="px-4 py-2 font-mono text-[12px] text-primary">{status}</td>
                      <td className="px-4 py-2 text-muted-foreground">{meaning}</td>
                      <td className="px-4 py-2 font-mono text-[11px]">{error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Callout>Source of truth: <a className="text-primary" href="https://github.com/benflux-company/fluxchat-sdk/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">CONTRIBUTING.md on GitHub →</a></Callout>

            <H2 id="contributing-js">Contributing to the JS SDK</H2>
            <P>FluxChat SDK is open source (MIT) on <a className="text-primary" href="https://github.com/benflux-company/fluxchat-sdk" target="_blank" rel="noreferrer">GitHub</a>. Bug fixes and improvements are welcome.</P>
            <CodeBlock filename="terminal" code={`git clone https://github.com/benflux-company/fluxchat-sdk
cd fluxchat-sdk && npm install
npm run build   # tsup → ESM + CJS + types + CLI + IIFE widget
npm test        # vitest
npm run typecheck`} />
            <H3>Source structure</H3>
            <CodeBlock filename="src/" code={`src/
├── index.ts            # main SDK entry (FluxChatClient, errors)
├── client.ts           # HTTP client
├── knowledge.ts        # KB CRUD
├── config.ts           # persona config
├── cli/
│   └── index.ts        # CLI commands (ask, test, kb, config)
└── widget/
    ├── widget.ts        # embeddable widget — DOM, SPA capture, autocorrect
    ├── types.ts         # WidgetOptions, WidgetInstance interfaces
    └── styles.ts        # CSS-in-JS widget styles`} />
            <H2 id="contributors">Contributors</H2>
            <P>People who built and maintain FluxChat. Want to join? Open an issue or submit a PR on <a className="text-primary" href="https://github.com/benflux-company/fluxchat-sdk" target="_blank" rel="noreferrer">GitHub</a>.</P>
            <div className="mt-6 flex flex-wrap gap-4">
              {contributors.map((c) => (
                <a
                  key={c.login}
                  href={c.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 hover:bg-muted/60 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.avatar_url} alt={c.login} width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">@{c.login}</p>
                    <p className="text-[12px] text-muted-foreground">{c.contributions} commit{c.contributions > 1 ? "s" : ""}</p>
                  </div>
                </a>
              ))}
              <a
                href="https://github.com/benflux-company/fluxchat-sdk/issues"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-border text-xl text-muted-foreground">+</div>
                <div>
                  <p className="text-sm font-semibold">You?</p>
                  <p className="text-[12px] text-muted-foreground">Contribute an SDK</p>
                </div>
              </a>
            </div>

          </VersionProvider>

          <Footer />
        </article>
      </div>
    </div>
  );
}
