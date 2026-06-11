import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "JavaScript / TypeScript SDK — FluxChat" };

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-20 border-b border-border pb-2 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-7 text-lg font-semibold">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{children}</p>;
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">{children}</code>;
}

const NAV_ITEMS = [
  { id: "install", label: "Installation" },
  { id: "quickstart", label: "Quickstart" },
  { id: "widget", label: "Widget (browser)" },
  { id: "quickreplies", label: "Quick replies" },
  { id: "autocapture", label: "autoCapture" },
  { id: "autokb", label: "Auto-KB learning" },
  { id: "platformapi", label: "platformApi (live data)" },
  { id: "context", label: "User context injection" },
  { id: "frameworks", label: "Framework setup" },
  { id: "api", label: "API reference" },
  { id: "knowledge", label: "Knowledge base" },
  { id: "types", label: "TypeScript types" },
];

export default function JsSDKPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside className="py-8 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-border lg:pr-4">
          <Link href="/sdk" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            ← All SDKs
          </Link>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-md px-2 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0 max-w-3xl pb-24 pt-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">SDK · Stable</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight">JavaScript / TypeScript SDK</h1>
            </div>
            <span className="mt-2 rounded-full bg-green-500/10 px-3 py-1 text-[12px] font-medium text-green-600 dark:text-green-400">
              v0.1.8 · Stable
            </span>
          </div>
          <P>
            The official FluxChat SDK for browser and Node.js. Provides a floating chat widget, a headless{" "}
            <Code>ask()</Code> client, and knowledge base management.
          </P>

          <H2 id="install">Installation</H2>
          <CodeBlock filename="terminal" code={`npm install @fluxchat_sdk/sdk
# or
yarn add @fluxchat_sdk/sdk
# or
pnpm add @fluxchat_sdk/sdk`} />

          <H2 id="quickstart">Quickstart</H2>
          <H3>Headless — ask() only</H3>
          <CodeBlock filename="chat.ts" code={`import { FluxChatClient } from '@fluxchat_sdk/sdk';

const client = new FluxChatClient({
  apiKey: process.env.FLUXCHAT_API_KEY!,
});

const { reply, conversationId } = await client.ask({
  message: 'What are your opening hours?',
  context: 'User: Alice, Plan: Pro',  // optional
});

console.log(reply);`} />

          <H2 id="widget">Widget (browser)</H2>
          <P>
            Drop <Code>FluxChatWidget</Code> anywhere in your React tree. It renders a floating chat bubble with no additional configuration.
          </P>
          <CodeBlock filename="App.tsx" code={`import { FluxChatWidget } from '@fluxchat_sdk/sdk';

export default function App() {
  return (
    <>
      <YourApp />
      <FluxChatWidget apiKey={process.env.VITE_FLUXCHAT_API_KEY!} />
    </>
  );
}`} />

          <H2 id="quickreplies">Quick replies — greeting chip row</H2>
          <P>
            Pass a <Code>quickReplies</Code> array to show tap-to-send chips below the greeting message when the panel first opens. Each chip sends that exact text as the user&apos;s first message and then disappears.
          </P>
          <CodeBlock filename="init.js" code={`FluxChatWidget.init({
  apiKey: 'fc_live_xxx',
  greeting: 'Bonjour ! Comment puis-je vous aider ?',
  quickReplies: [
    'What can you do?',
    'Show me pricing',
    'I need support',
  ],
});

// React component:
<FluxChatWidget
  apiKey={process.env.NEXT_PUBLIC_FLUXCHAT_API_KEY!}
  greeting="Hello! How can I help?"
  quickReplies={['What can you do?', 'Show me pricing', 'Contact sales']}
/>`} />
          <P>
            Chips are horizontally scrollable on mobile, styled with your <Code>primaryColor</Code>, and removed permanently as soon as the user sends any message (whether via a chip or by typing).
          </P>

          <H2 id="autocapture">autoCapture — zero-config site intelligence</H2>
          <P>
            From v0.1.5, the widget passively captures every page the user visits. From <strong>v0.1.7</strong>, it also intercepts all <Code>fetch()</Code> and <Code>XMLHttpRequest</Code> GET responses (JSON only) and snapshots <Code>localStorage</Code> — giving the bot full awareness of your app's live data with zero configuration.
          </P>
          <CodeBlock filename="any-site.html" code={`<!-- That's it. autoCapture is true by default. -->
<script src="https://cdn.jsdelivr.net/npm/@fluxchat_sdk/sdk/dist/widget.global.js"></script>
<script>
  FluxChatWidget.init({ apiKey: 'fc_live_xxx' });
</script>

<!-- What gets captured automatically (v0.1.7+):
     ✓ Page DOM text  — every URL visited (once per session)
     ✓ fetch() GET    — JSON API responses (/api/clients, /api/products, …)
     ✓ XHR GET        — same filtering as fetch
     ✓ localStorage   — user session data (auth/token keys excluded)

     User visits /dashboard → API calls intercepted
     User asks "how many clients do we have?" → bot reads captured API data -->`} />
          <P>
            Works on <strong>static HTML, WordPress, React Router, Vue Router, Angular, Next.js</strong> — any site. SPA navigation is intercepted via <Code>pushState</Code> / <Code>replaceState</Code> / <Code>popstate</Code> / <Code>hashchange</Code>. Captured data is deduplicated by content hash — re-visiting a page with unchanged content does not send a duplicate.
          </P>
          <P>
            Auto-filtered: auth endpoints (<Code>/login</Code>, <Code>/token</Code>, <Code>/refresh</Code>), static assets, images, and binary responses are never captured.
          </P>
          <P>
            Set <Code>autoCapture: false</Code> only if you populate the knowledge base manually (admin import or crawl).
          </P>

          <H2 id="autokb">Auto-KB learning — permanent knowledge from captures</H2>
          <P>
            From <strong>v0.1.7</strong>, the FluxChat gateway automatically extracts structured knowledge from every capture and stores it permanently in your organization&apos;s knowledge base — no TTL, no re-fetching needed.
          </P>
          <CodeBlock filename="flow.txt" code={`SDK captures page / API response
        ↓
Gateway stores raw capture (bot_session_page, TTL 1h)
        ↓  [fire-and-forget, max 2 concurrent per org]
AI gateway extracts:
  • title      — "Services and pricing — Acme Corp"
  • content    — "Acme offers web dev ($500–2000), SEO ($300/mo)…"
  • category   — pricing | product | contact | support | …
  • keywords   — ["web dev", "SEO", "pricing", "Acme"]
        ↓
Stored in bot_knowledge (source = 'auto', permanent)
        ↓
Bot answers from permanent KB — even after 1h session TTL expires`} />
          <P>
            <strong>Content-change refresh:</strong> if the same URL is captured again with different content (e.g. your client list grew), the stale auto-KB entry is replaced automatically. The hash is compared — unchanged content is a no-op.
          </P>
          <P>
            Auto-generated entries are tagged <Code>source: &apos;auto&apos;</Code> in the knowledge base and can be reviewed, edited, or deleted from the admin panel like any manual entry.
          </P>

          <H2 id="platformapi">platformApi — live data from your own API</H2>
          <P>
            The widget can query your platform&apos;s REST API in real time to answer questions that require fresh data (orders, events, products, sermons, etc.).
          </P>
          <CodeBlock filename="init.js" code={`FluxChatWidget.init({
  apiKey: 'fc_live_xxx',
  platformApi: {
    baseUrl: 'https://api.my-app.com',
    // authTokenKeys: ['member_token', 'admin_token'] // optional override
  },
});
// The widget fetches your OpenAPI/Swagger spec once, scores every GET endpoint
// against each user question, calls the top matches, and injects the results
// into context before sending to FluxChat.
// The user's auth token is read from localStorage automatically.`} />
          <P>
            No manual intent/action setup. No configuration beyond the base URL. If your API has an OpenAPI spec (<Code>/openapi.json</Code>, <Code>/swagger.json</Code>, or <Code>/api-docs</Code>), the bot uses it automatically.
          </P>

          <H2 id="context">User context injection</H2>
          <P>
            Set <Code>window.fluxchatContext</Code> before the widget loads. The SDK reads it at send-time and includes it in every request so the bot knows who is talking.
          </P>
          <CodeBlock filename="context-schema.ts" code={`window.fluxchatContext = {
  user: {
    name: 'Alice Martin',       // display name
    email: 'alice@example.com', // optional
    role: 'admin',              // free string — sent verbatim to the bot
  },
  org: {
    name: 'My Organisation',    // shown in widget header
  },
  // any extra key-value pairs are also forwarded
  plan: 'pro',
  locale: 'fr',
};`} />

          <H3>React hook — inject on login</H3>
          <CodeBlock filename="FluxChatContextInjector.tsx" code={`import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function FluxChatContextInjector() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      window.fluxchatContext = {
        user: { name: user.name, email: user.email, role: user.role },
        org:  { name: user.orgName },
      };
    }
  }, [user]);

  return null;
}`} />

          <H3>Framework environment variables</H3>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Framework</th>
                  <th className="px-4 py-2 font-medium">Env file</th>
                  <th className="px-4 py-2 font-medium">Variable name</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Vite", ".env", "VITE_FLUXCHAT_API_KEY"],
                  ["Next.js", ".env.local", "NEXT_PUBLIC_FLUXCHAT_API_KEY"],
                  ["Create React App", ".env", "REACT_APP_FLUXCHAT_API_KEY"],
                  ["Node / Express", ".env", "FLUXCHAT_API_KEY"],
                ].map(([fw, file, varname]) => (
                  <tr key={fw} className="border-t border-border">
                    <td className="px-4 py-2">{fw}</td>
                    <td className="px-4 py-2 font-mono text-[12px] text-muted-foreground">{file}</td>
                    <td className="px-4 py-2 font-mono text-[12px] text-primary">{varname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="frameworks">Framework setup</H2>
          <H3>Next.js (App Router)</H3>
          <CodeBlock filename="app/layout.tsx" code={`import { FluxChatWidget } from '@fluxchat_sdk/sdk';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FluxChatWidget apiKey={process.env.NEXT_PUBLIC_FLUXCHAT_API_KEY!} />
      </body>
    </html>
  );
}`} />

          <H3>Vite / React</H3>
          <CodeBlock filename="src/main.tsx" code={`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FluxChatWidget } from '@fluxchat_sdk/sdk';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <FluxChatWidget apiKey={import.meta.env.VITE_FLUXCHAT_API_KEY} />
  </React.StrictMode>,
);`} />

          <H3>Plain HTML (CDN)</H3>
          <CodeBlock filename="index.html" code={`<script src="https://cdn.jsdelivr.net/npm/@fluxchat_sdk/sdk/dist/widget.umd.js"></script>
<script>
  FluxChat.init({ apiKey: 'fc_prod_your_key' });
</script>`} />

          <H2 id="api">API reference</H2>
          <H3>FluxChatClient</H3>
          <CodeBlock filename="client.ts" code={`const client = new FluxChatClient({ apiKey: 'fc_prod_...' });

// Send a message
const { reply, conversationId } = await client.ask({
  message: 'Hello',
  context?: string,          // optional — user/page context
  conversationId?: string,   // optional — omit for stateless
});

// Verify the key
const { organizationId, scopes } = await client.testKey();`} />

          <H3>FluxChatWidget props</H3>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Prop</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Default</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["apiKey", "string", "—", "Required. Your fc_prod_... key."],
                  ["baseUrl", "string", "auto", "Override API URL (useful for self-hosted)."],
                  ["clientName", "string", "—", "Brand name shown in the header."],
                  ["assistantName", "string", "'Assistant'", "Assistant display name."],
                  ["primaryColor", "string", "'#4f46e5'", "Brand color for header and buttons."],
                  ["theme", "'light' | 'dark'", "'light'", "Initial color theme."],
                  ["position", "'right' | 'left'", "'right'", "Launcher corner."],
                  ["greeting", "string", "auto", "First message shown to user."],
                  ["context", "string", "—", "Static context sent with every message."],
                  ["autoContext", "boolean", "true", "Auto-inject page title, URL, DOM text and window.fluxchatContext into every message."],
                  ["autoCapture", "boolean", "true", "Passively capture every page visited — bot learns your entire site automatically."],
                  ["platformApi", "{ baseUrl: string }", "—", "Your REST API base URL. Widget auto-queries relevant endpoints per message for live data."],
                  ["quickReplies", "string[]", "[]", "Tap-to-send chip row shown below the greeting. Chips disappear after the first user message. E.g. ['What can you do?', 'Show me pricing']."],
                  ["openOnLoad", "boolean", "false", "Open the panel automatically."],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-[12px] text-primary">{prop}</td>
                    <td className="px-4 py-2 font-mono text-[12px] text-muted-foreground">{type}</td>
                    <td className="px-4 py-2 font-mono text-[12px] text-muted-foreground">{def}</td>
                    <td className="px-4 py-2 text-[13px] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="knowledge">Knowledge base</H2>
          <P>
            Manage your bot's knowledge base programmatically. Requires a key with <Code>bot:write</Code> scope for create/update/delete.
          </P>
          <CodeBlock filename="kb.ts" code={`// Create an article
const article = await client.knowledge.create({
  title: 'Opening hours',
  content: 'We are open Mon–Fri 9am–6pm.',
  category: 'general',
  keywords: ['hours', 'schedule'],
});

// Update
await client.knowledge.update(article.id, { content: 'New content' });

// Delete
await client.knowledge.delete(article.id);

// List all (requires admin JWT)
const articles = await client.knowledge.list();

// Get one
const item = await client.knowledge.get(article.id);`} />

          <H2 id="types">TypeScript types</H2>
          <CodeBlock filename="types.ts" code={`export interface AskOptions {
  message: string;
  context?: string;
  conversationId?: string;
}

export interface AskResponse {
  reply: string;
  conversationId: string;
  intent: string | null;
  confidence: number;
}

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FluxChatContext {
  user?: { name?: string; email?: string; role?: string };
  org?:  { name?: string };
  [key: string]: unknown;
}`} />

          <Footer />
        </article>
      </div>
    </div>
  );
}
