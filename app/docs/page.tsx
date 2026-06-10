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
  return <h3 id={id} className="mt-7 text-lg font-semibold">{children}</h3>;
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

export default function DocsPage() {
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

            <H2 id="assistant">AI assistant</H2>
            <P>Use the same kit as a general assistant: a persona you control, grounded on your knowledge base, with continuity when you pass a <Code>conversationId</Code>.</P>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] text-muted-foreground">
              <li><b>Stateless</b> by default for public widgets — nothing stored unless you keep a <Code>conversationId</Code>.</li>
              <li><b>Persona</b> per org — <Code>assistantName</Code>, <Code>tone</Code>, <Code>styleRules</Code>.</li>
              <li><b>Priority context</b> — <Code>context</Code> always wins over the KB.</li>
              <V2Only><li><b>Strict mode</b> — bot only answers from your KB, refuses anything outside it.</li></V2Only>
              <V2Only><li><b>Auto-context</b> — widget captures the current page automatically, no code needed.</li></V2Only>
            </ul>

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
                    ["autoEnvDetect", "true", "DEV badge + header on localhost / fc_dev_ keys.", true],
                    ["autoContext", "true", "Auto-capture page title, URL and visible text as context.", true],
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
            <P>The JS/TypeScript SDK is the reference implementation. Community SDKs for other languages are tracked as open issues — pick one, fork the repo, and submit a PR.</P>

            <H3>Open SDK issues</H3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Stack</th>
                  <th className="px-4 py-2 font-medium">Branch</th>
                  <th className="px-4 py-2 font-medium">Issue</th>
                </tr></thead>
                <tbody>
                  {[
                    { stack: "Dart / Flutter", branch: "sdk/dart", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/3" },
                    { stack: "Python", branch: "sdk/python", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/1" },
                    { stack: "PHP", branch: "sdk/php", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/2" },
                    { stack: "Go", branch: "sdk/go", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/4" },
                    { stack: "C# / .NET", branch: "sdk/dotnet", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/5" },
                    { stack: "Swift (iOS / macOS)", branch: "sdk/swift", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/6" },
                    { stack: "Kotlin (Android)", branch: "sdk/kotlin", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/7" },
                    { stack: "React Native", branch: "sdk/react-native", issue: "https://github.com/benflux-company/fluxchat-sdk/issues/8" },
                  ].map(({ stack, branch, issue }) => (
                    <tr key={branch} className="border-t border-border">
                      <td className="px-4 py-2 font-medium">{stack}</td>
                      <td className="px-4 py-2"><Code>{branch}</Code></td>
                      <td className="px-4 py-2"><a className="text-primary hover:underline" href={issue} target="_blank" rel="noreferrer">View issue →</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3 id="api-reference">API reference</H3>
            <P>All SDKs call the same REST endpoint. No SDK package required — just HTTP.</P>
            <CodeBlock filename="ask.http" code={`POST https://dev-api.fluxchat-corp.com/api/v2/public/bot/ask
Content-Type: application/json
X-API-Key: fc_prod_your_key

{
  "message": "What are your opening hours?",
  "context": "User: Alice, Plan: Pro",    // optional — highest priority
  "conversationId": ""                    // optional — omit for stateless
}

// Response
{
  "success": true,
  "data": {
    "reply": "We are open Mon–Fri 9am–6pm.",
    "conversationId": "conv-uuid",
    "intent": null,
    "confidence": 1
  }
}`} />
            <CodeBlock filename="test-key.http" code={`GET https://dev-api.fluxchat-corp.com/api/v2/public/bot/test
X-API-Key: fc_prod_your_key

// Response
{
  "success": true,
  "data": { "organizationId": "org-uuid", "scopes": ["bot:read"] }
}`} />

            <H3 id="sdk-checklist">What every SDK must implement</H3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Feature</th>
                  <th className="px-4 py-2 font-medium">Auth required</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr></thead>
                <tbody>
                  {[
                    { feature: "ask(message, context?, conversationId?)", auth: "API key", desc: "Send a message, return reply + conversationId" },
                    { feature: "testKey()", auth: "API key", desc: "Verify the key, return organizationId + scopes" },
                    { feature: "knowledge.create(title, content, ...)", auth: "API key (bot:write)", desc: "Add a KB article" },
                    { feature: "knowledge.update(id, patch)", auth: "API key (bot:write)", desc: "Update a KB article" },
                    { feature: "knowledge.delete(id)", auth: "API key (bot:write)", desc: "Delete a KB article" },
                    { feature: "knowledge.list()", auth: "JWT (admin)", desc: "List all KB articles" },
                    { feature: "knowledge.get(id)", auth: "JWT (admin)", desc: "Get one KB article" },
                    { feature: "Error types", auth: "—", desc: "ApiError, NetworkError, ConfigError with status code" },
                  ].map(({ feature, auth, desc }) => (
                    <tr key={feature} className="border-t border-border">
                      <td className="px-4 py-2 font-mono text-[12px]">{feature}</td>
                      <td className="px-4 py-2 text-muted-foreground text-[12px]">{auth}</td>
                      <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3 id="contributing">How to contribute</H3>
            <P>Fork the repo, create your branch, implement the checklist above, open a PR. All PRs require one review before merge.</P>
            <CodeBlock filename="terminal" code={`# 1. Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/fluxchat-sdk.git
cd fluxchat-sdk

# 2. Create your branch
git checkout -b sdk/dart   # replace 'dart' with your language

# 3. Create sdk/<language>/ with your code + README + tests

# 4. Push and open a PR against main
git push origin sdk/dart`} />
            <Callout>Read <a className="text-primary" href="https://github.com/benflux-company/fluxchat-sdk/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">CONTRIBUTING.md</a> for the full guide — required files, test expectations, and PR rules.</Callout>

            <H2 id="contributing-js">Contributing to the JS SDK</H2>
            <P>FluxChat SDK is open source (MIT) on <a className="text-primary" href="https://github.com/benflux-company/fluxchat-sdk" target="_blank" rel="noreferrer">GitHub</a>. Bug fixes and improvements are welcome.</P>
            <CodeBlock filename="terminal" code={`git clone https://github.com/benflux-company/fluxchat-sdk
cd fluxchat-sdk && npm install
npm run build   # tsup → ESM + CJS + types + CLI + widget
npm test        # vitest`} />
          </VersionProvider>

          <Footer />
        </article>
      </div>
    </div>
  );
}
