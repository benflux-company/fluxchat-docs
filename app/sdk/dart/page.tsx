import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Footer } from "@/components/footer";
import { Github } from "lucide-react";
import { SdkSidebar } from "@/components/sdk-sidebar";

export const metadata: Metadata = { title: "Dart / Flutter SDK — FluxChat" };

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-20 border-b border-border pb-2 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h3 id={id} className="mt-7 text-lg font-semibold">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{children}</p>;
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">{children}</code>;
}

const NAV_ITEMS = [
  { id: "install",     label: "Installation" },
  { id: "quickstart",  label: "Quickstart" },
  { id: "auth",        label: "Authentication" },
  { id: "chat",        label: "Ask (chat)" },
  { id: "context",     label: "Per-request context" },
  { id: "widgets",     label: "Flutter widgets" },
  { id: "overlay",     label: "FluxChatOverlay" },
  { id: "fab",         label: "FluxChatFab" },
  { id: "page",        label: "FluxChatPage" },
  { id: "controller",  label: "FluxChatController" },
  { id: "knowledge",   label: "Knowledge base" },
  { id: "errors",      label: "Error handling" },
  { id: "options",     label: "Options reference" },
];

async function getDartContributor() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/benflux-company/fluxchat-sdk/commits?sha=sdk/dart&per_page=100",
      { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const commits = await res.json() as { author: { login: string; avatar_url: string; html_url: string } | null }[];
    const skip = new Set(["benbaruka", "claude", "github-actions", "dependabot"]);
    const contributor = commits.find(c => c.author && !skip.has(c.author.login.toLowerCase()))?.author ?? null;
    return contributor;
  } catch {
    return null;
  }
}

export default async function DartSDKPage() {
  const contributor = await getDartContributor();
  return (
    <div className="mx-auto max-w-screen-xl px-4">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">

        {/* Sidebar */}
        <aside className="py-8 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-border lg:pr-4">
          <SdkSidebar navItems={NAV_ITEMS} />
        </aside>

        {/* Content */}
        <article className="min-w-0 max-w-3xl pb-24 pt-10">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">SDK · Stable</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Flutter / Dart SDK</h1>
            </div>
            <span className="mt-2 rounded-full bg-green-500/10 px-3 py-1 text-[12px] font-medium text-green-600 dark:text-green-400">
              v0.1.0 · Stable
            </span>
          </div>
          <P>
            Official Flutter &amp; Dart SDK for FluxChat. Drop an AI assistant into any mobile, desktop, or
            Dart web app in minutes — typed API client, a floating FAB widget, and a full-screen chat page,
            all built on Material 3.
          </P>
          <div className="mt-6 flex gap-3">
            <a
              href="https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/dart"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
            <a
              href="https://pub.dev/packages/fluxchat_sdk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              pub.dev
            </a>
          </div>

          {/* ── Installation ── */}
          <H2 id="install">Installation</H2>
          <P>Requires Flutter <Code>≥ 3.16</Code> and Dart <Code>≥ 3.0</Code>.</P>
          <H3>From GitHub (v0.1.0)</H3>
          <CodeBlock filename="pubspec.yaml" code={`dependencies:
  fluxchat_sdk:
    git:
      url: https://github.com/benflux-company/fluxchat-sdk.git
      path: sdk/dart
      ref: sdk/dart/v0.1.0`} />
          <CodeBlock filename="terminal" code={`flutter pub get`} />
          <H3>From pub.dev (coming soon)</H3>
          <CodeBlock filename="terminal" code={`flutter pub add fluxchat_sdk`} />

          {/* ── Quickstart ── */}
          <H2 id="quickstart">Quickstart</H2>
          <H3>Core SDK (pure Dart)</H3>
          <CodeBlock filename="main.dart" code={`import 'package:fluxchat_sdk/fluxchat_sdk.dart';

final fluxchat = FluxChat(apiKey: 'fc_prod_your_key');

final res = await fluxchat.ask(AskOptions(
  message: 'What are your opening hours?',
));
print(res.reply);
print(res.conversationId); // persist for follow-up turns`} />

          <H3>FAB widget — floating bubble over the whole app</H3>
          <CodeBlock filename="main.dart" code={`import 'package:fluxchat_sdk/widget.dart';

MaterialApp(
  // The FAB floats above every route automatically — zero per-screen setup.
  builder: FluxChatOverlay.builder(
    options: FluxChatOptions(
      apiKey: 'fc_prod_your_key',
      assistantName: 'Léa',
      clientName: 'Acme Bank',
    ),
  ),
  home: const MyHomePage(),
)`} />

          {/* ── Authentication ── */}
          <H2 id="auth">Authentication</H2>
          <P>
            All requests require an <Code>apiKey</Code>. For Knowledge Base write operations
            (create, update, delete) you also need a <Code>jwtToken</Code>. The client handles
            both automatically once configured.
          </P>
          <CodeBlock filename="dart" code={`// API key only (read + Ask)
final client = FluxChat(apiKey: Platform.environment['FLUXCHAT_API_KEY']!);

// API key + JWT (read + Ask + KB write)
final adminClient = FluxChat(
  apiKey: Platform.environment['FLUXCHAT_API_KEY']!,
  jwtToken: Platform.environment['FLUXCHAT_JWT']!,
);`} />

          {/* ── Ask ── */}
          <H2 id="chat">Ask (chat)</H2>
          <P>Send a message and get an answer grounded on your knowledge base.</P>
          <CodeBlock filename="dart" code={`final res = await fluxchat.ask(AskOptions(
  message: 'How do I reset my password?',
  // Optional: keep conversation state across multiple turns
  conversationId: previousRes?.conversationId,
  sessionId: 'session-user-42',
));

print(res.reply);
print(res.conversationId); // save this for follow-up messages`} />

          {/* ── Per-request context ── */}
          <H2 id="context">Per-request context</H2>
          <P>
            Mobile replacement for <Code>window.fluxchatContext</Code>. Pass live user data
            (name, plan, current screen, cart…) so the assistant always answers with full
            context — without the widget needing to know about your state management.
          </P>
          <CodeBlock filename="dart" code={`FluxChatOverlay.builder(
  options: FluxChatOptions(
    apiKey: 'fc_prod_your_key',
    assistantName: 'Léa',
    // Called before every message — always fresh
    contextBuilder: () => jsonEncode({
      'user':    currentUser.name,
      'plan':    currentUser.plan,
      'screen':  currentRoute,
      'balance': accountBalance,
    }),
  ),
)`} />

          {/* ── Flutter widgets ── */}
          <H2 id="widgets">Flutter widgets</H2>
          <P>
            Three independent integration modes built on the same <Code>FluxChatController</Code>.
            Pick the one that fits your UX — all share the same options and state.
          </P>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Widget</th>
                  <th className="px-4 py-2 text-left font-medium">When to use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["FluxChatOverlay", "Recommended — wraps MaterialApp.builder; FAB floats above all routes"],
                  ["FluxChatFab", "Manual Stack placement — drop the FAB wherever you want in a single screen"],
                  ["FluxChatPage", "Full-screen chat navigated to as a regular route (push/pop)"],
                ].map(([name, desc]) => (
                  <tr key={name} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-mono text-[12.5px] text-primary">{name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── FluxChatOverlay ── */}
          <H2 id="overlay">FluxChatOverlay (Option A — recommended)</H2>
          <P>
            Wraps <Code>MaterialApp.builder</Code>. The FAB + chat panel float above every route
            automatically — no per-screen setup needed.
          </P>
          <CodeBlock filename="main.dart" code={`import 'package:flutter/material.dart';
import 'package:fluxchat_sdk/widget.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      builder: FluxChatOverlay.builder(
        options: FluxChatOptions(
          apiKey: 'fc_prod_your_key',
          assistantName: 'Léa',
          clientName: 'Acme Bank',
          primaryColor: const Color(0xFF4F46E5),
          contextBuilder: () => 'User is signed in.',
        ),
      ),
      home: const HomeScreen(),
    );
  }
}`} />

          {/* ── FluxChatFab ── */}
          <H2 id="fab">FluxChatFab (Option B — manual placement)</H2>
          <P>
            Drop the FAB widget into any <Code>Stack</Code> for per-screen control.
          </P>
          <CodeBlock filename="dart" code={`import 'package:fluxchat_sdk/widget.dart';

Scaffold(
  body: Stack(
    children: [
      const MyContent(),
      FluxChatFab(
        options: FluxChatOptions(
          apiKey: 'fc_prod_your_key',
          assistantName: 'Léa',
        ),
      ),
    ],
  ),
)`} />

          {/* ── FluxChatPage ── */}
          <H2 id="page">FluxChatPage (Option C — full-screen route)</H2>
          <P>
            Navigate to a full-screen chat experience as a regular route.
          </P>
          <CodeBlock filename="dart" code={`import 'package:fluxchat_sdk/widget.dart';

// From any widget:
Navigator.push(context, MaterialPageRoute(
  builder: (_) => FluxChatPage(
    options: FluxChatOptions(
      apiKey: 'fc_prod_your_key',
      assistantName: 'Léa',
      clientName: 'Acme Bank',
    ),
  ),
));`} />

          {/* ── FluxChatController ── */}
          <H2 id="controller">FluxChatController</H2>
          <P>
            A <Code>ChangeNotifier</Code> that drives the widget programmatically — open, close,
            send messages, and clear history from a button, a deep link, or a push notification.
          </P>
          <CodeBlock filename="dart" code={`import 'package:fluxchat_sdk/widget.dart';

// Create once, share everywhere
final controller = FluxChatController();

// Inject into the widget
FluxChatOverlay.builder(
  options: FluxChatOptions(apiKey: 'fc_prod_your_key'),
  controller: controller,
)

// Drive from anywhere
ElevatedButton(
  onPressed: () {
    controller.open();
    controller.sendMessage('Hi! I need help with my order.');
  },
  child: const Text('Chat with us'),
)

// Clean up
@override
void dispose() {
  controller.dispose();
  super.dispose();
}`} />

          {/* ── Knowledge Base ── */}
          <H2 id="knowledge">Knowledge base</H2>
          <P>
            Full CRUD for knowledge articles. Requires a <Code>jwtToken</Code> in the client.
          </P>
          <CodeBlock filename="dart" code={`final client = FluxChat(
  apiKey: 'fc_prod_your_key',
  jwtToken: 'eyJhbGci...',
);

// List all articles
final articles = await client.knowledge.list();

// Create
final article = await client.knowledge.create(KnowledgeArticle(
  title: 'Return policy',
  content: 'Items can be returned within 30 days of purchase.',
  category: 'support',
));

// Partial update
await client.knowledge.update(article.id, KnowledgeArticle(
  title: 'Return policy v2',
));

// Delete
await client.knowledge.delete(article.id);`} />

          {/* ── Error handling ── */}
          <H2 id="errors">Error handling</H2>
          <P>All errors are typed. Catch the base class or the specific subtype.</P>
          <CodeBlock filename="dart" code={`import 'package:fluxchat_sdk/fluxchat_sdk.dart';

try {
  final res = await fluxchat.ask(AskOptions(message: 'Hello'));
  print(res.reply);
} on FluxChatApiException catch (e) {
  // 4xx / 5xx from the FluxChat API
  print('API error \${e.statusCode}: \${e.message}');
} on FluxChatNetworkException catch (e) {
  // Connectivity issues, timeouts
  print('Network error: \${e.message}');
} on FluxChatConfigException catch (e) {
  // Missing or invalid API key
  print('Config error: \${e.message}');
} on FluxChatException catch (e) {
  // All other FluxChat errors
  print('FluxChat error: \${e.message}');
}`} />

          {/* ── Options reference ── */}
          <H2 id="options">FluxChatOptions reference</H2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Option</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["apiKey", "String", "Required. Your FluxChat API key."],
                  ["assistantName", "String?", "Display name for the bot in the widget header."],
                  ["clientName", "String?", "Your app / brand name shown in the widget."],
                  ["primaryColor", "Color?", "Accent colour for the FAB, header, and sent bubbles."],
                  ["contextBuilder", "String Function()?", "Called before every send — returns live user/page data."],
                  ["baseUrl", "String?", "Override the API base URL (default: https://api.fluxchat-corp.com/api/v2)."],
                  ["connectTimeout", "Duration?", "Connection timeout (default: 10s)."],
                  ["receiveTimeout", "Duration?", "Response timeout (default: 30s)."],
                ].map(([opt, type, desc]) => (
                  <tr key={opt as string} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-mono text-[12.5px] text-primary">{opt}</td>
                    <td className="px-4 py-2 font-mono text-[12.5px] text-muted-foreground">{type}</td>
                    <td className="px-4 py-2 text-[13px] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Contributor ── */}
          {contributor && (
            <div className="mt-16 rounded-2xl border border-border bg-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">SDK Author</p>
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 transition hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-border"
                />
                <div>
                  <p className="font-semibold">@{contributor.login}</p>
                  <p className="text-sm text-muted-foreground">
                    Designed and built the Flutter / Dart SDK for FluxChat.
                  </p>
                </div>
              </a>
            </div>
          )}

        </article>
      </div>
      <Footer />
    </div>
  );
}
