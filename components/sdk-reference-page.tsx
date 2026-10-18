import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Footer } from "@/components/footer";
import { SdkSidebar } from "@/components/sdk-sidebar";
import { Github } from "lucide-react";

/**
 * Shared reference page for the language SDKs.
 *
 * The six SDKs contributed in one batch (Python, PHP, Swift, Kotlin, .NET,
 * React Native) document the same six things in the same order — only the
 * snippets differ. Writing them as six near-identical 400-line pages would
 * guarantee they drift apart the first time the API changes; this takes the
 * snippets as data instead, so a contract change is one edit per stack.
 *
 * The hand-written js / go / dart pages stay as they are: each documents
 * stack-specific surface (the browser widget, Go's functional options, the
 * Flutter widgets) that does not fit a common shape.
 */
export interface SDKReferenceSpec {
  lang: string;
  label: string;
  /** Shown next to the title, e.g. "v0.3.0 · Stable". */
  version: string;
  description: string;
  /** GitHub login of the SDK's main author, for the credit line. */
  author: { login: string; contribution: string };
  sourceUrl: string;
  install: { filename: string; code: string };
  client: { filename: string; code: string };
  ask: { filename: string; code: string };
  /** Human handoff: escalate → thread → reply, in this stack's idiom. */
  handoff: { filename: string; code: string };
  knowledge: { filename: string; code: string };
  errors: { filename: string; code: string };
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-20 border-b border-border pb-2 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{children}</p>;
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">{children}</code>;
}

const NAV_ITEMS = [
  { id: "install", label: "Installation" },
  { id: "client", label: "Create a client" },
  { id: "ask", label: "ask()" },
  { id: "handoff", label: "Human handoff" },
  { id: "knowledge", label: "Knowledge base" },
  { id: "errors", label: "Errors" },
];

export function SDKReferencePage({ spec }: { spec: SDKReferenceSpec }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="py-8 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-border lg:pr-4">
          <SdkSidebar navItems={NAV_ITEMS} />
        </aside>

        <article className="min-w-0 max-w-3xl pb-24 pt-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">SDK · Stable</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight">{spec.label}</h1>
            </div>
            <span className="mt-2 shrink-0 rounded-full bg-green-500/10 px-3 py-1 text-[12px] font-medium text-green-600 dark:text-green-400">
              {spec.version}
            </span>
          </div>
          <P>{spec.description}</P>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px]">
            <Link
              href={spec.sourceUrl}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-medium transition-colors hover:bg-muted"
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </Link>
            <span className="text-muted-foreground">
              Contributed by{" "}
              <Link
                href={`https://github.com/${spec.author.login}`}
                className="font-medium text-foreground underline underline-offset-2"
              >
                @{spec.author.login}
              </Link>{" "}
              — {spec.author.contribution}
            </span>
          </div>

          <H2 id="install">Installation</H2>
          <CodeBlock filename={spec.install.filename} code={spec.install.code} />

          <H2 id="client">Create a client</H2>
          <P>
            The base URL defaults to <Code>https://api.fluxchat-corp.com/api/v2</Code> —{" "}
            <strong>production</strong>. Pass it explicitly to target dev.
          </P>
          <CodeBlock filename={spec.client.filename} code={spec.client.code} />

          <H2 id="ask">ask()</H2>
          <P>
            Send a message and get the assistant&apos;s reply. Pass <Code>context</Code> to inject
            real-time data the bot treats as a priority source of truth, above the knowledge base.
            A <Code>sessionId</Code> keeps multi-turn history without persisting a conversation.
          </P>
          <CodeBlock filename={spec.ask.filename} code={spec.ask.code} />

          <H2 id="handoff">Human handoff (support thread)</H2>
          <P>
            When the bot can&apos;t help, hand the visitor to a human. This creates a real support
            ticket in the organization&apos;s dashboard — and unlike a contact form, the
            conversation <strong>stays open in the same thread</strong>: the visitor polls it, the
            agent answers into it.
          </P>
          <CodeBlock filename={spec.handoff.filename} code={spec.handoff.code} />
          <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Ownership is the e-mail.</strong> A wrong e-mail
              and a non-existent ticket both return <Code>404</Code>, deliberately — a guessed
              ticket id reveals nothing. The lookup is also scoped to the organization behind your
              API key.
            </li>
            <li>
              <strong className="text-foreground">Polled, not pushed.</strong> There is no socket on
              the public surface. 5s is the cadence the official widget uses and what the
              route&apos;s limits are sized for: 60 reads/min, 30 replies/min, 5 escalations/min.
            </li>
            <li>
              <strong className="text-foreground">Statuses</strong>: <Code>open</Code> →{" "}
              <Code>in_progress</Code> → <Code>resolved</Code> → <Code>closed</Code>. A reply to a
              resolved ticket reopens it; a closed one refuses the write (<Code>403</Code>) rather
              than swallowing a message nobody will read.
            </li>
            <li>
              Requires the organization&apos;s plan to include <Code>supportTickets</Code> (
              <Code>403</Code> otherwise).
            </li>
          </ul>

          <H2 id="knowledge">Knowledge base</H2>
          <P>
            Create, update and delete articles. Write operations need a key with the{" "}
            <Code>bot:write</Code> scope, or an admin JWT.
          </P>
          <CodeBlock filename={spec.knowledge.filename} code={spec.knowledge.code} />

          <H2 id="errors">Errors</H2>
          <P>
            Every failure is typed: an API error carries the HTTP status and the server&apos;s
            message, a network error wraps the transport failure, and a config error is raised
            before any request leaves.
          </P>
          <CodeBlock filename={spec.errors.filename} code={spec.errors.code} />
        </article>
      </div>
      <Footer />
    </div>
  );
}
