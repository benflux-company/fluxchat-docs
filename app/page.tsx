import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare, Target, Users, BookOpen, LayoutGrid, Terminal, ArrowRight, LifeBuoy, Bot,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Footer } from "@/components/footer";

const FEATURES = [
  { icon: MessageSquare, title: "Ask API", desc: "High-quality answers from your assistant, grounded on your data." },
  { icon: Target, title: "Per-request context", desc: "Real-time data treated as a priority source of truth, above the KB." },
  { icon: Users, title: "Persona", desc: "Assistant name, tone and style rules — per organization." },
  { icon: BookOpen, title: "Knowledge base", desc: "Curate articles; manage them with a scoped API key." },
  { icon: LayoutGrid, title: "Embeddable widget", desc: "Polished, fully customizable, floating or inline support." },
  { icon: Terminal, title: "CLI", desc: "Chat and manage your knowledge from the terminal." },
];

function Mock({ mode }: { mode: "light" | "dark" }) {
  const dark = mode === "dark";
  return (
    <div
      className="w-[300px] max-w-full overflow-hidden rounded-2xl border shadow-2xl"
      style={{
        background: dark ? "#15171a" : "#fff",
        borderColor: dark ? "#2a2e33" : "#e9ebee",
        color: dark ? "#f3f4f6" : "#11181c",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: "hsl(var(--primary))" }}>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-bold">L</div>
        <div className="flex-1">
          <b className="block text-sm">Léa</b>
          <span className="text-[11px] opacity-90">En ligne</span>
        </div>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] capitalize">{mode}</span>
      </div>
      <div className="flex flex-col gap-2 p-3.5" style={{ background: dark ? "#1b1e22" : "#f6f7f9" }}>
        <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md px-3 py-2 text-[12.5px]" style={{ background: dark ? "#23272c" : "#eef0f2" }}>
          Bonjour, comment puis-je vous aider ?
        </div>
        <div className="max-w-[85%] self-end rounded-2xl rounded-br-md px-3 py-2 text-[12.5px] text-white" style={{ background: "hsl(var(--primary))" }}>
          Mon solde ?
        </div>
        <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md px-3 py-2 text-[12.5px]" style={{ background: dark ? "#23272c" : "#eef0f2" }}>
          Il est de <b>4 250 €</b>.
        </div>
      </div>
      <div className="px-3 py-2 text-center text-[11px]" style={{ background: dark ? "#15171a" : "#fff", color: dark ? "#9aa4af" : "#6b7280" }}>
        Propulsé par <span style={{ color: "hsl(var(--primary))" }} className="font-semibold">Benflux</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,#000_55%,transparent)] bg-[linear-gradient(to_right,hsl(var(--border)/.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.5)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="mx-auto max-w-screen-xl px-4 py-24 text-center sm:py-32">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> v0.1.3 · the FluxChat developer kit
            </span>
            <h1 className="mx-auto max-w-3xl text-balance text-5xl font-extrabold tracking-tight sm:text-6xl">
              <span className="bg-[radial-gradient(ellipse_at_50%_0,hsl(var(--primary)),hsl(var(--foreground))_70%)] bg-clip-text text-transparent">
                Assistant &amp; in-app support for any product
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              The official FluxChat SDK, CLI &amp; embeddable widget. Add an AI assistant — or a full in-app support
              experience — with per-request context, a custom persona, and your own knowledge base.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/docs" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110">
                Read the docs <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://www.npmjs.com/package/@fluxchat_sdk/sdk" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent">
                View on npm
              </a>
            </div>
            <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm">
              <span className="text-primary">$</span> npm install @fluxchat_sdk/sdk
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-screen-xl px-4">
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-sm font-semibold text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Everything you need to integrate</h2>
            <p className="mt-3 text-muted-foreground">A typed client, a terminal CLI, and a production-ready widget — one package.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="h-full rounded-xl border border-border bg-card p-6 transition hover:border-primary/50">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-screen-xl px-4">
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-sm font-semibold text-primary">Use cases</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Not just a bot — your support layer</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><LifeBuoy className="h-5 w-5" /></div>
                <h3 className="font-semibold">In-app support</h3>
                <p className="mt-1 text-sm text-muted-foreground">Resolve questions instantly from your knowledge base, with the signed-in user passed as live context. Cut ticket volume, on-brand.</p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Bot className="h-5 w-5" /></div>
                <h3 className="font-semibold">AI assistant</h3>
                <p className="mt-1 text-sm text-muted-foreground">A persona you control, grounded on your data, with conversation continuity when you keep a conversationId.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Widget preview */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <Reveal className="mx-auto mb-12 max-w-xl">
            <p className="text-sm font-semibold text-primary">The widget</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Adapts to light &amp; dark</h2>
            <p className="mt-3 text-muted-foreground">Beautiful in both themes — floating or inline, with an in-header switch.</p>
          </Reveal>
          <Reveal className="flex flex-wrap items-center justify-center gap-5">
            <Mock mode="light" />
            <Mock mode="dark" />
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <Reveal className="mx-auto mb-10 max-w-xl">
            <p className="text-sm font-semibold text-primary">The team</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Built by Benflux</h2>
            <p className="mt-3 text-muted-foreground">An open-source project from Benflux — building the future.</p>
          </Reveal>
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-border bg-card p-7 sm:flex-row sm:text-left">
            <Image src="https://avatars.githubusercontent.com/u/232082870?v=4" alt="Benflux" width={64} height={64} className="rounded-2xl border border-border" unoptimized />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Benflux</h3>
              <p className="text-sm text-muted-foreground">Building the future. FluxChat is part of the Benflux product suite.</p>
              <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <span>Kinshasa, Congo</span>
                <a href="https://benflux-corp.com" target="_blank" rel="noreferrer" className="text-primary">benflux-corp.com</a>
                <a href="https://github.com/benflux-company" target="_blank" rel="noreferrer" className="text-primary">github.com/benflux-company</a>
              </div>
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <a href="https://github.com/benbaruka" target="_blank" rel="noreferrer" className="inline-flex flex-col items-center gap-2">
              <Image src="https://avatars.githubusercontent.com/u/89651828?v=4" alt="benbaruka" width={56} height={56} className="rounded-full border-2 border-border transition hover:border-primary" unoptimized />
              <b className="text-sm">benbaruka</b>
              <span className="text-xs text-muted-foreground">maintainer</span>
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
