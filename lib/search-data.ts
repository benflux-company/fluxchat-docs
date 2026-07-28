export type SearchItem = {
  id: string;
  title: string;
  description: string;
  section: string;
  href: string;
};

export const SEARCH_DATA: SearchItem[] = [
  // ── Overview page ────────────────────────────────────────────────
  { id: "overview-hero", title: "FluxChat SDK", description: "Official SDK, CLI & embeddable widget for any product.", section: "Overview", href: "/" },

  // ── Docs page ────────────────────────────────────────────────────
  { id: "intro", title: "Introduction", description: "Overview of the FluxChat SDK, CLI, and embeddable widget.", section: "Getting started", href: "/docs#intro" },
  { id: "install", title: "Installation", description: "npm install @fluxchat_sdk/sdk — works with npm, pnpm, yarn.", section: "Getting started", href: "/docs#install" },
  { id: "quickstart", title: "Quickstart", description: "Get your API key, send your first message, add the widget.", section: "Getting started", href: "/docs#quickstart" },
  { id: "support", title: "In-app support", description: "Embed a full support experience in your product with knowledge base and context.", section: "Use cases", href: "/docs#support" },
  { id: "assistant", title: "AI assistant", description: "FluxChat AI assistant — persona, answers, custom knowledge.", section: "Use cases", href: "/docs#assistant" },
  { id: "widget", title: "Widget overview", description: "Embeddable chat widget for any website or app. Floating and inline modes.", section: "Widget", href: "/docs#widget" },
  { id: "quick-replies", title: "Quick replies", description: "Greeting chip row — tap-to-send chips for common questions.", section: "Widget", href: "/docs#quick-replies" },
  { id: "modes", title: "Floating & inline", description: "Widget display modes: floating launcher bubble or inline full chat.", section: "Widget", href: "/docs#modes" },
  { id: "themes", title: "Light & dark themes", description: "Widget adapts to light/dark mode automatically or via themeToggle.", section: "Widget", href: "/docs#themes" },
  { id: "customization", title: "Customization", description: "primaryColor, assistantName, greeting, position, showBranding.", section: "Widget", href: "/docs#customization" },
  { id: "env-detection", title: "Dev / prod detection", description: "Automatic environment detection via API key prefix (fc_dev_ vs fc_prod_).", section: "Widget", href: "/docs#env-detection" },
  { id: "auto-context", title: "Auto-context", description: "Widget automatically captures page title, URL, and visible text.", section: "Widget", href: "/docs#auto-context" },
  { id: "integrations", title: "React, Next, Vue integrations", description: "Drop-in integration for React, Next.js, Vue, Angular, and plain HTML.", section: "Integrations", href: "/docs#integrations" },
  { id: "sdk-ref", title: "SDK & ask()", description: "FluxChat class — ask(), testKey(), knowledge base methods.", section: "Reference", href: "/docs#sdk" },
  { id: "persona", title: "Persona & config", description: "getPersonaConfig(), updatePersonaConfig() — bot name, instructions, tone.", section: "Reference", href: "/docs#persona" },
  { id: "strict-mode", title: "Strict KB mode", description: "Bot only answers from knowledge base — no hallucination.", section: "Reference", href: "/docs#strict-mode" },
  { id: "kb", title: "Knowledge base", description: "Create, list, update, delete knowledge base articles via SDK.", section: "Reference", href: "/docs#kb" },
  { id: "auto-crawl", title: "Auto-crawl", description: "Automatically index your docs site or marketing pages into the KB.", section: "Reference", href: "/docs#auto-crawl" },
  { id: "cli", title: "CLI", description: "npx @fluxchat_sdk/sdk — test-key, ask, kb commands.", section: "Reference", href: "/docs#cli" },
  { id: "auth", title: "Auth & scopes", description: "API key scopes: bot:read, bot:write, messages:read/write, members:read.", section: "Reference", href: "/docs#auth" },
  { id: "api-keys", title: "Dev & prod keys", description: "fc_dev_ keys for testing, fc_prod_ for production — separate KB.", section: "Reference", href: "/docs#api-keys" },
  { id: "versions", title: "API versions", description: "v1 (stable) vs v2 (latest) — differences and migration guide.", section: "Reference", href: "/docs#versions" },
  { id: "for-devs", title: "Build an SDK", description: "Spec, architecture, and requirements for building a community SDK.", section: "For Developers", href: "/docs#for-devs" },
  { id: "community-sdks", title: "Community SDKs", description: "Python, Go, Dart, PHP, Kotlin, Swift, .NET, React Native SDKs.", section: "For Developers", href: "/docs#community-sdks" },
  { id: "sandbox", title: "Developer Sandbox", description: "Sandbox credentials for testing integrations without production data.", section: "For Developers", href: "/docs#sandbox" },
  { id: "sandbox-verify", title: "Verify your capture", description: "Step-by-step guide to confirm autoCapture works end to end.", section: "For Developers", href: "/docs#sandbox-verify" },
  { id: "api-reference", title: "REST API reference", description: "Base URLs, endpoints, authentication headers for direct API calls.", section: "For Developers", href: "/docs#api-reference" },
  { id: "sdk-checklist", title: "SDK implementation checklist", description: "What every FluxChat SDK must implement to be compliant.", section: "For Developers", href: "/docs#sdk-checklist" },
  { id: "sdk-folder-structure", title: "SDK folder structure", description: "Monorepo layout for FluxChat SDK repositories.", section: "For Developers", href: "/docs#sdk-folder-structure" },
  { id: "sdk-test-coverage", title: "SDK test coverage", description: "Required test coverage for FluxChat SDK submissions.", section: "For Developers", href: "/docs#sdk-test-coverage" },
  { id: "sdk-examples", title: "SDK code examples", description: "Minimal ask() implementations in multiple languages.", section: "For Developers", href: "/docs#sdk-examples" },
  { id: "contributing", title: "How to contribute", description: "Contribution workflow for community SDK developers.", section: "For Developers", href: "/docs#contributing" },
  { id: "bot-pipeline", title: "Bot pipeline", description: "How a message becomes a reply — the full FluxChat pipeline.", section: "For Developers", href: "/docs#bot-pipeline" },
  { id: "priority-order", title: "Context priority order", description: "How context sources are ranked: per-request > session > KB > persona.", section: "For Developers", href: "/docs#priority-order" },
  { id: "zero-config-sdk", title: "Zero-config (mobile)", description: "Implementing autoCapture and autoContext in non-JS SDKs.", section: "For Developers", href: "/docs#zero-config-sdk" },
  { id: "contributing-js", title: "Contributing to JS SDK", description: "Source structure, build process, and PR guidelines for the JS SDK.", section: "Project", href: "/docs#contributing-js" },
  { id: "contributors", title: "Contributors", description: "People who have contributed to the FluxChat SDK project.", section: "Project", href: "/docs#contributors" },

  // ── SDK pages ────────────────────────────────────────────────────
  { id: "sdk-js", title: "JavaScript / TypeScript SDK", description: "Official SDK for browser and Node.js. Widget, ask(), knowledge base.", section: "SDKs", href: "/sdk/js" },
  { id: "sdk-js-install", title: "JS SDK — Installation", description: "npm install @fluxchat_sdk/sdk", section: "SDKs · JS", href: "/sdk/js#install" },
  { id: "sdk-js-widget", title: "JS SDK — Widget", description: "FluxChatWidget component for React apps and plain HTML.", section: "SDKs · JS", href: "/sdk/js#widget" },
  { id: "sdk-js-autocapture", title: "JS SDK — autoCapture", description: "Zero-config page, API, and localStorage capture.", section: "SDKs · JS", href: "/sdk/js#autocapture" },
  { id: "sdk-js-autokb", title: "JS SDK — Auto-KB learning", description: "Permanent knowledge extracted from captures automatically.", section: "SDKs · JS", href: "/sdk/js#autokb" },
  { id: "sdk-js-platform", title: "JS SDK — platformApi", description: "Intercept live app data and give it to the bot in real time.", section: "SDKs · JS", href: "/sdk/js#platformapi" },
  { id: "sdk-go", title: "Go SDK", description: "FluxChat Go client — ask(), IndexRoutes, knowledge base.", section: "SDKs", href: "/sdk/go" },
  { id: "sdk-dart", title: "Dart / Flutter SDK", description: "FluxChat Dart SDK with FluxChatOverlay, FluxChatFab, FluxChatPage widgets.", section: "SDKs", href: "/sdk/dart" },
  { id: "sdk-python", title: "Python SDK", description: "Community Python SDK for FluxChat.", section: "SDKs", href: "/sdk/python" },
  { id: "sdk-php", title: "PHP SDK", description: "Community PHP SDK for FluxChat.", section: "SDKs", href: "/sdk/php" },
  { id: "sdk-kotlin", title: "Kotlin SDK", description: "Community Kotlin / Android SDK for FluxChat.", section: "SDKs", href: "/sdk/kotlin" },
  { id: "sdk-swift", title: "Swift SDK", description: "Community Swift / iOS SDK for FluxChat.", section: "SDKs", href: "/sdk/swift" },
  { id: "sdk-dotnet", title: ".NET SDK", description: "Community .NET / C# SDK for FluxChat.", section: "SDKs", href: "/sdk/dotnet" },
  { id: "sdk-react-native", title: "React Native SDK", description: "Community React Native SDK for FluxChat.", section: "SDKs", href: "/sdk/react-native" },

  // ── Changelog ────────────────────────────────────────────────────
  { id: "changelog", title: "Changelog", description: "Release notes and version history for the FluxChat SDK.", section: "Changelog", href: "/changelog" },
];
