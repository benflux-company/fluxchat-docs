import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Footer } from "@/components/footer";
import { Github } from "lucide-react";
import { SdkSidebar } from "@/components/sdk-sidebar";

export const metadata: Metadata = { title: "Go SDK — FluxChat" };

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
  { id: "install",     label: "Installation" },
  { id: "quickstart",  label: "Quickstart" },
  { id: "auth",        label: "Authentication" },
  { id: "chat",        label: "Ask (chat)" },
  { id: "capture",     label: "CapturePage" },
  { id: "indexroutes", label: "IndexRoutes" },
  { id: "knowledge",   label: "Knowledge base" },
  { id: "errors",      label: "Error handling" },
  { id: "options",     label: "Options reference" },
  { id: "full",        label: "Full example" },
  { id: "types",       label: "Types" },
];

async function getGoContributor() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/benflux-company/fluxchat-sdk/commits?sha=sdk/go&per_page=100",
      { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const commits = await res.json() as { author: { login: string; avatar_url: string; html_url: string } | null }[];
    const skip = new Set(["benbaruka", "claude", "github-actions"]);
    const contributor = commits.find(c => c.author && !skip.has(c.author.login.toLowerCase()))?.author ?? null;
    return contributor;
  } catch {
    return null;
  }
}

export default async function GoSDKPage() {
  const contributor = await getGoContributor();
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
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Go SDK</h1>
            </div>
            <span className="mt-2 rounded-full bg-green-500/10 px-3 py-1 text-[12px] font-medium text-green-600 dark:text-green-400">
              v1.0.4 · Stable
            </span>
          </div>
          <P>
            Official Go SDK for FluxChat. Zero external dependencies (stdlib only) — works with any Go backend,
            CLI tool, or serverless function. Idiomatic functional-options API with full context propagation.
          </P>
          <div className="mt-6 flex gap-3">
            <a
              href="https://github.com/benflux-company/fluxchat-sdk/tree/sdk/go/sdk/go"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
            <a
              href="https://github.com/benflux-company/fluxchat-sdk/releases/tag/sdk/go/v1.0.4"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Changelog
            </a>
          </div>

          {/* ── Installation ── */}
          <H2 id="install">Installation</H2>
          <P>Requires Go 1.21+. No external dependencies — only the Go standard library.</P>
          <CodeBlock filename="terminal" code={`go get github.com/benflux-company/fluxchat-sdk/sdk/go@v1.0.4`} />
          <CodeBlock filename="go.mod" code={`module your-app

go 1.21

require github.com/benflux-company/fluxchat-sdk/sdk/go v1.0.4`} />

          {/* ── Quickstart ── */}
          <H2 id="quickstart">Quickstart</H2>
          <CodeBlock filename="main.go" code={`package main

import (
    "context"
    "fmt"
    "log"

    fluxchat "github.com/benflux-company/fluxchat-sdk/sdk/go"
)

func main() {
    client, err := fluxchat.NewClient(os.Getenv("FLUXCHAT_API_KEY"))
    if err != nil {
        log.Fatal(err) // *fluxchat.ConfigError if key is empty
    }

    resp, err := client.Ask(context.Background(), "What are your opening hours?")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(resp.Reply)
}`} />

          {/* ── Authentication ── */}
          <H2 id="auth">Authentication</H2>
          <P>
            The SDK uses two auth mechanisms: <Code>X-API-Key</Code> for public bot operations (Ask, CapturePage,
            Knowledge write) and <Code>Bearer JWT</Code> for admin-only operations (Knowledge list / get).
          </P>
          <H3>Verify your API key</H3>
          <P>
            Call <Code>TestKey()</Code> at startup to verify the key is valid. As a side effect it caches the
            <Code>OrganizationID</Code> on the client — required for Knowledge Base operations.
          </P>
          <CodeBlock filename="auth.go" code={`info, err := client.TestKey(ctx)
if err != nil {
    log.Fatal(err)
}
fmt.Println(info.OrganizationID) // "92c6e8ab-..."
fmt.Println(info.Scopes)         // ["bot:read", "bot:write"]`} />

          <H3>Login (JWT — required for Knowledge list/get)</H3>
          <P>
            Knowledge list and get require an admin JWT. Call <Code>Login()</Code> once at startup and the JWT
            is stored automatically on the client for all subsequent Knowledge read operations.
          </P>
          <CodeBlock filename="login.go" code={`// After NewClient + TestKey
loginResp, err := client.Login(ctx, "admin@example.com", "password")
if err != nil {
    log.Fatal(err)
}
// JWT is now cached — knowledge.List() and knowledge.Get() work automatically
fmt.Println(loginResp.ExpiresIn) // "24h"`} />

          {/* ── Ask ── */}
          <H2 id="chat">Ask (chat)</H2>
          <H3>Stateless message</H3>
          <P>Send a message without a conversation — the bot replies but does not retain session state.</P>
          <CodeBlock filename="ask.go" code={`resp, err := client.Ask(ctx, "What are your opening hours?")
if err != nil {
    log.Fatal(err)
}
fmt.Println(resp.Reply)
fmt.Println(resp.ConversationID) // "" for stateless`} />

          <H3>Continue a conversation</H3>
          <P>Pass the <Code>ConversationID</Code> from a previous reply to continue the same thread.</P>
          <CodeBlock filename="conversation.go" code={`// First message
resp, _ := client.Ask(ctx, "Hello!")

// Continue the thread
resp2, _ := client.Ask(ctx, "And what about weekends?",
    fluxchat.WithConversationID(resp.ConversationID),
)`} />

          <H3>Session ID and context</H3>
          <CodeBlock filename="session.go" code={`resp, err := client.Ask(ctx, "Show me the pricing",
    fluxchat.WithSessionID("user-alice-123"),       // ties multiple calls to one session
    fluxchat.WithContext("Plan: Pro, Locale: fr"),  // priority context for the bot
)`} />

          {/* ── CapturePage ── */}
          <H2 id="capture">CapturePage</H2>
          <P>
            Passively capture a page&apos;s content so the bot can reference it when answering questions. This is
            the Go equivalent of the JS SDK&apos;s <Code>autoCapture</Code>. Returns no error on a 204 No Content
            response.
          </P>
          <CodeBlock filename="capture.go" code={`err := client.CapturePage(
    ctx,
    "https://yoursite.com/pricing",       // canonical URL
    "Pricing — Your App",                 // human-readable title
    "Starter: $0/mo · Pro: $29/mo · ...", // visible text content
)
if err != nil {
    log.Printf("capture failed: %v", err)
}`} />
          <P>
            In a web server, call <Code>CapturePage</Code> after rendering each page — the content is indexed
            by FluxChat and used as a high-priority knowledge source for bot replies.
          </P>

          {/* ── IndexRoutes ── */}
          <H2 id="indexroutes">IndexRoutes</H2>
          <P>
            <Code>IndexRoutes</Code> registers your API surface as permanent Knowledge Base articles at startup —
            before any request is made. The bot immediately knows what each endpoint does, its parameters, and
            expected responses, without waiting for real traffic to populate the KB.
          </P>
          <P>
            Each <Code>RouteInfo</Code> becomes one KB article: title = <Code>METHOD /path</Code> (or your
            custom <Code>Title</Code>), content = description text.
          </P>
          <CodeBlock filename="indexroutes.go" code={`// At startup, after TestKey + Login
err := client.IndexRoutes(ctx, []fluxchat.RouteInfo{
    {
        Method:      "GET",
        Path:        "/api/products",
        Title:       "List products",
        Description: "Returns all active products with id, name, price, and stock. Sorted by name.",
    },
    {
        Method:      "POST",
        Path:        "/api/orders",
        Title:       "Create order",
        Description: "Creates a new order. Body: {productId string, quantity int, userId string}. Returns: {orderId, status, total}.",
    },
    {
        Method:      "GET",
        Path:        "/api/users/:id",
        Title:       "Get user by ID",
        Description: "Returns user profile: name, email, role, plan, createdAt. Requires admin JWT.",
    },
})
if err != nil {
    log.Printf("IndexRoutes: %v", err) // non-fatal — continue
}`} />
          <P>
            <Code>IndexRoutes</Code> calls <Code>CreateKnowledge</Code> once per route. It stops and returns the
            first error — partial indexing is normal if one route fails. Check and log the error but do not treat
            it as fatal, since the bot still works with the articles that were created.
          </P>

          {/* ── Knowledge ── */}
          <H2 id="knowledge">Knowledge base</H2>
          <P>
            Full CRUD for your organization&apos;s knowledge base. Write operations (create/update/delete) use
            the API key — no JWT needed. Read operations (list/get) require a JWT obtained via <Code>Login()</Code>.
          </P>
          <P>
            <Code>TestKey()</Code> must be called before any Knowledge operation (it caches the <Code>OrganizationID</Code>),
            or pass the org ID explicitly with <Code>WithOrgID(id)</Code>.
          </P>

          <H3>List all articles</H3>
          <CodeBlock filename="kb-list.go" code={`// Requires JWT (call Login first)
items, err := client.GetKnowledge(ctx)
if err != nil {
    log.Fatal(err)
}
for _, item := range items {
    fmt.Printf("%s: %s\n", item.ID, item.Title)
}`} />

          <H3>Create an article</H3>
          <CodeBlock filename="kb-create.go" code={`created, err := client.CreateKnowledge(ctx, fluxchat.KnowledgeItem{
    Title:   "Opening hours",
    Content: "We are open Mon–Fri 9am–6pm, Sat 10am–4pm.",
})
if err != nil {
    log.Fatal(err)
}
fmt.Println(created.ID)`} />

          <H3>Update an article</H3>
          <CodeBlock filename="kb-update.go" code={`updated, err := client.UpdateKnowledge(ctx, "article-id", fluxchat.KnowledgeItem{
    Content: "Updated content — now open until 7pm on Fridays.",
})
if err != nil {
    log.Fatal(err)
}`} />

          <H3>Get a single article</H3>
          <CodeBlock filename="kb-get.go" code={`// Requires JWT (call Login first)
item, err := client.GetKnowledgeItem(ctx, "article-id")
if err != nil {
    log.Fatal(err)
}
fmt.Println(item.Title, item.Content)`} />

          <H3>Delete an article</H3>
          <CodeBlock filename="kb-delete.go" code={`err := client.DeleteKnowledge(ctx, "article-id")
if err != nil {
    log.Fatal(err)
}`} />

          {/* ── Errors ── */}
          <H2 id="errors">Error handling</H2>
          <P>
            The SDK returns three typed errors. Use <Code>errors.As()</Code> to inspect them — never string-match
            on <Code>err.Error()</Code>.
          </P>
          <CodeBlock filename="errors.go" code={`import "errors"

_, err := client.Ask(ctx, "Hello")
if err != nil {
    var apiErr *fluxchat.APIError
    var netErr *fluxchat.NetworkError
    var cfgErr *fluxchat.ConfigError

    switch {
    case errors.As(err, &apiErr):
        // HTTP 4xx / 5xx from the FluxChat API
        fmt.Printf("API error %d: %s\n", apiErr.StatusCode, apiErr.Message)
    case errors.As(err, &netErr):
        // Connection refused, DNS failure, timeout, etc.
        fmt.Printf("network error: %v\n", netErr.Cause)
    case errors.As(err, &cfgErr):
        // Empty API key, missing orgID, etc.
        fmt.Printf("config error: %s\n", cfgErr.Message)
    }
}`} />
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Fields</th>
                  <th className="px-4 py-2 font-medium">When returned</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["*APIError", "StatusCode int, Message string", "HTTP 4xx/5xx from the API"],
                  ["*NetworkError", "Cause error (unwrappable)", "Connection refused, timeout, DNS failure"],
                  ["*ConfigError", "Message string", "Empty API key, missing orgID"],
                ].map(([t, fields, when]) => (
                  <tr key={t} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-[12px] text-primary">{t}</td>
                    <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">{fields}</td>
                    <td className="px-4 py-2 text-[13px] text-muted-foreground">{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Options ── */}
          <H2 id="options">Options reference</H2>
          <H3>Client options (passed to NewClient)</H3>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Option</th>
                  <th className="px-4 py-2 font-medium">Default</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["WithBaseURL(url string)", "api.fluxchat-corp.com/api/v2", "Override the API base URL"],
                  ["WithHTTPClient(hc *http.Client)", "30s timeout client", "Inject a custom HTTP client (testing, proxies)"],
                  ["WithJWT(token string)", "\"\"", "Pre-load a JWT instead of calling Login()"],
                  ["WithOrgID(id string)", "\"\"", "Pre-set orgID instead of calling TestKey()"],
                ].map(([opt, def, desc]) => (
                  <tr key={opt} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-[11.5px] text-primary">{opt}</td>
                    <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">{def}</td>
                    <td className="px-4 py-2 text-[13px] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H3>Ask options (passed to Ask)</H3>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Option</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["WithConversationID(id string)", "Continue an existing conversation thread"],
                  ["WithSessionID(id string)", "Tie multiple stateless calls to one session (analytics / context)"],
                  ["WithContext(ctx string)", "Free-text context injected with highest priority (user info, page data, etc.)"],
                ].map(([opt, desc]) => (
                  <tr key={opt} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-[11.5px] text-primary">{opt}</td>
                    <td className="px-4 py-2 text-[13px] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Full example ── */}
          <H2 id="full">Full example — Go HTTP server</H2>
          <P>
            A production-ready Go server with <Code>IndexRoutes</Code> at startup and the full Knowledge Base
            CRUD API. The bot learns your API surface immediately at startup.
          </P>
          <CodeBlock filename="main.go" code={`package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "strings"

    fluxchat "github.com/benflux-company/fluxchat-sdk/sdk/go"
)

var (
    fc  *fluxchat.Client
    ctx = context.Background()
)

func main() {
    var err error
    fc, err = fluxchat.NewClient(os.Getenv("FLUXCHAT_API_KEY"),
        fluxchat.WithBaseURL("https://api.fluxchat-corp.com/api/v2"),
    )
    if err != nil {
        log.Fatalf("init: %v", err)
    }

    fc.TestKey(ctx)                                                    // caches orgID
    fc.Login(ctx, os.Getenv("ADMIN_EMAIL"), os.Getenv("ADMIN_PASS")) // JWT for KB read

    // Register API surface in KB at startup
    fc.IndexRoutes(ctx, []fluxchat.RouteInfo{
        {Method: "GET",    Path: "/api/products",    Title: "List products",    Description: "Returns all active products with price and stock."},
        {Method: "POST",   Path: "/api/orders",      Title: "Create order",     Description: "Body: {productId, quantity, userId}. Returns: {orderId, status, total}."},
        {Method: "DELETE", Path: "/api/orders/:id",  Title: "Cancel order",     Description: "Cancels an order by ID. Requires admin."},
    })

    mux := http.NewServeMux()
    mux.HandleFunc("/api/chat",       handleChat)      // POST
    mux.HandleFunc("/api/capture",    handleCapture)   // POST
    mux.HandleFunc("/api/knowledge",  handleKnowledge) // GET / POST
    mux.HandleFunc("/api/knowledge/", handleKBItem)    // DELETE /{id}
    mux.Handle("/", http.FileServer(http.Dir("./static")))

    log.Fatal(http.ListenAndServe(":8080", mux))
}

// POST /api/chat  { message, conversationId? }
func handleChat(w http.ResponseWriter, r *http.Request) {
    var body struct {
        Message        string \`json:"message"\`
        ConversationID string \`json:"conversationId"\`
    }
    json.NewDecoder(r.Body).Decode(&body)

    opts := []fluxchat.AskOption{}
    if body.ConversationID != "" {
        opts = append(opts, fluxchat.WithConversationID(body.ConversationID))
    }

    resp, err := fc.Ask(r.Context(), body.Message, opts...)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadGateway)
        return
    }
    json.NewEncoder(w).Encode(map[string]any{
        "reply":          resp.Reply,
        "conversationId": resp.ConversationID,
    })
}

// POST /api/capture  { url, title, content }
func handleCapture(w http.ResponseWriter, r *http.Request) {
    var body struct{ URL, Title, Content string }
    json.NewDecoder(r.Body).Decode(&body)
    if err := fc.CapturePage(r.Context(), body.URL, body.Title, body.Content); err != nil {
        http.Error(w, err.Error(), http.StatusBadGateway)
        return
    }
    json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

// GET /api/knowledge       → list all
// POST /api/knowledge      → create { title, content }
func handleKnowledge(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        items, err := fc.GetKnowledge(r.Context())
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadGateway)
            return
        }
        json.NewEncoder(w).Encode(items)
    case http.MethodPost:
        var item fluxchat.KnowledgeItem
        json.NewDecoder(r.Body).Decode(&item)
        created, err := fc.CreateKnowledge(r.Context(), item)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadGateway)
            return
        }
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(created)
    }
}

// DELETE /api/knowledge/{id}
func handleKBItem(w http.ResponseWriter, r *http.Request) {
    id := strings.TrimPrefix(r.URL.Path, "/api/knowledge/")
    if err := fc.DeleteKnowledge(r.Context(), id); err != nil {
        http.Error(w, err.Error(), http.StatusBadGateway)
        return
    }
    json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}`} />

          {/* ── Types ── */}
          <H2 id="types">Types</H2>
          <CodeBlock filename="types.go" code={`// ── Client ───────────────────────────────────────────────────
type Client struct { /* opaque */ }

func NewClient(apiKey string, opts ...Option) (*Client, error)

// ── Ask ──────────────────────────────────────────────────────
type AskResponse struct {
    Reply          string \`json:"reply"\`
    ConversationID string \`json:"conversationId"\`
}

// ── TestKey ──────────────────────────────────────────────────
type KeyInfo struct {
    OrganizationID string   \`json:"organizationId"\`
    Scopes         []string \`json:"scopes"\`
}

// ── Login ────────────────────────────────────────────────────
type LoginResponse struct {
    AccessToken  string \`json:"accessToken"\`
    RefreshToken string \`json:"refreshToken"\`
    ExpiresIn    string \`json:"expiresIn"\`
}

// ── Knowledge ────────────────────────────────────────────────
type KnowledgeItem struct {
    ID        string   \`json:"id,omitempty"\`
    Title     string   \`json:"title,omitempty"\`
    Content   string   \`json:"content,omitempty"\`
    Category  string   \`json:"category,omitempty"\`
    Keywords  []string \`json:"keywords,omitempty"\`
    IsActive  *bool    \`json:"isActive,omitempty"\`
    CreatedAt string   \`json:"createdAt,omitempty"\`
}

// ── IndexRoutes ──────────────────────────────────────────────
type RouteInfo struct {
    Method      string // HTTP method (GET, POST, ...)
    Path        string // URL path pattern (e.g. "/api/products")
    Title       string // Human-readable name (optional — defaults to "METHOD /path")
    Description string // What this endpoint does, its parameters, example responses
}

func (c *Client) IndexRoutes(ctx context.Context, routes []RouteInfo) error

// ── Errors ───────────────────────────────────────────────────
type APIError struct {
    StatusCode int
    Message    string
}
type NetworkError struct {
    Cause error // unwrappable via errors.Unwrap
}
type ConfigError struct {
    Message string
}`} />

          {contributor && (
            <div className="mt-10 rounded-xl border border-border bg-muted/30 p-5">
              <p className="text-sm font-semibold">Contributor</p>
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-3 w-fit"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={contributor.avatar_url} alt={contributor.login} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="text-sm font-semibold">@{contributor.login}</p>
                  <p className="text-[12px] text-muted-foreground">Go SDK author</p>
                </div>
              </a>
              <a
                href="https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/go"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Github className="h-4 w-4" />
                View source on GitHub →
              </a>
            </div>
          )}

          <Footer />
        </article>
      </div>
    </div>
  );
}
