import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle, Circle, Github, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "SDKs — FluxChat" };

type SDK = {
  lang: string;
  label: string;
  status: "stable" | "open";
  version: string | null;
  description: string;
  install: string | null;
  href: string;
  issue: string | null;
};

const STACKS: { label: string; description: string; sdks: SDK[] }[] = [
  {
    label: "Web & Frontend",
    description: "Embeddable widget, browser SDK, and server-side rendering support.",
    sdks: [
      {
        lang: "js",
        label: "JavaScript / TypeScript",
        status: "stable",
        version: "v0.1.4",
        description: "Reference implementation. SDK, CLI, and embeddable widget. ESM + CJS + types.",
        install: "npm install @fluxchat_sdk/sdk",
        href: "/sdk/js",
        issue: null,
      },
      {
        lang: "react-native",
        label: "React Native",
        status: "open",
        version: null,
        description: "Native widget component and hook for React Native.",
        install: null,
        href: "/sdk/react-native",
        issue: "https://github.com/benflux-company/fluxchat-sdk/issues/8",
      },
    ],
  },
  {
    label: "Backend",
    description: "Server-side SDKs for APIs, microservices, scripts, and CLI tools.",
    sdks: [
      {
        lang: "go",
        label: "Go",
        status: "stable",
        version: "v1.0.4",
        description: "Zero-dependency Go SDK. IndexRoutes, full Knowledge CRUD, functional options, typed errors. Works with any Go backend or CLI.",
        install: "go get github.com/benflux-company/fluxchat-sdk/sdk/go@v1.0.4",
        href: "/sdk/go",
        issue: null,
      },
      {
        lang: "python",
        label: "Python",
        status: "open",
        version: null,
        description: "Python SDK for Django, FastAPI, Flask and scripts.",
        install: null,
        href: "/sdk/python",
        issue: "https://github.com/benflux-company/fluxchat-sdk/issues/1",
      },
      {
        lang: "php",
        label: "PHP",
        status: "open",
        version: null,
        description: "PHP SDK for Laravel, Symfony and plain PHP apps.",
        install: null,
        href: "/sdk/php",
        issue: "https://github.com/benflux-company/fluxchat-sdk/issues/2",
      },
      {
        lang: "dotnet",
        label: "C# / .NET",
        status: "open",
        version: null,
        description: ".NET SDK for ASP.NET Core, Blazor, and console apps.",
        install: null,
        href: "/sdk/dotnet",
        issue: "https://github.com/benflux-company/fluxchat-sdk/issues/5",
      },
    ],
  },
  {
    label: "Mobile",
    description: "Native SDKs for iOS, Android, and cross-platform mobile apps.",
    sdks: [
      {
        lang: "swift",
        label: "Swift (iOS / macOS)",
        status: "open",
        version: null,
        description: "Native Swift SDK with async/await for iOS and macOS.",
        install: null,
        href: "/sdk/swift",
        issue: "https://github.com/benflux-company/fluxchat-sdk/issues/6",
      },
      {
        lang: "kotlin",
        label: "Kotlin (Android / JVM)",
        status: "open",
        version: null,
        description: "Kotlin SDK with coroutines for Android and JVM.",
        install: null,
        href: "/sdk/kotlin",
        issue: "https://github.com/benflux-company/fluxchat-sdk/issues/7",
      },
      {
        lang: "dart",
        label: "Dart / Flutter",
        status: "stable",
        version: "v0.1.0",
        description: "Full Flutter/Dart SDK — typed client, Material 3 FAB widget, full-screen chat page, FluxChatController. Android, iOS, and Flutter Web.",
        install: "git: benflux-company/fluxchat-sdk  path: sdk/dart  ref: sdk/dart/v0.1.0",
        href: "/sdk/dart",
        issue: null,
      },
    ],
  },
];

function SDKCard({ sdk }: { sdk: SDK }) {
  return (
    <Link
      href={sdk.href}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-card/80"
    >
      <div className="flex items-start justify-between">
        <span className="font-semibold">{sdk.label}</span>
        {sdk.status === "stable" ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
            <CheckCircle className="h-3 w-3" /> stable
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            <Circle className="h-3 w-3" /> open
          </span>
        )}
      </div>
      {sdk.version && (
        <span className="mt-0.5 text-xs text-muted-foreground">{sdk.version}</span>
      )}
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
        {sdk.description}
      </p>
      {sdk.install && (
        <code className="mt-3 block rounded bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground">
          {sdk.install}
        </code>
      )}
      {sdk.status === "open" && (
        <span className="mt-3 text-[12px] text-primary group-hover:underline">
          View spec &amp; contribute →
        </span>
      )}
      {sdk.status === "stable" && (
        <span className="mt-3 text-[12px] text-primary group-hover:underline">
          View documentation →
        </span>
      )}
    </Link>
  );
}

export default function SDKsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold text-primary">For Developers</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight">SDKs</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          The JavaScript/TypeScript SDK is the official reference implementation. Community SDKs for other
          languages are open for contribution — pick a stack, read the spec, and submit a PR.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="https://github.com/benflux-company/fluxchat-sdk/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            CONTRIBUTING.md
          </a>
          <Link
            href="/sdk/js"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            JS/TS reference
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-14">
        {STACKS.map((stack) => (
          <section key={stack.label}>
            <div className="mb-5 border-b border-border pb-3">
              <h2 className="text-lg font-bold tracking-tight">{stack.label}</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">{stack.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stack.sdks.map((sdk) => (
                <SDKCard key={sdk.lang} sdk={sdk} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
