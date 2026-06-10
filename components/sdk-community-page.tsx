import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Footer } from "@/components/footer";
import { Github, ArrowLeft, Circle } from "lucide-react";

export interface SDKSpec {
  lang: string;
  label: string;
  issueUrl: string;
  issueNumber: number;
  branch: string;
  description: string;
  packageManager: string;      // e.g. "pub", "pip", "composer", "go get", etc.
  packageName: string;         // e.g. "fluxchat", "fluxchat-sdk"
  clientSnippet: string;       // language-specific client init code
  askSnippet: string;          // language-specific ask() code
  fileStructure: string;       // expected sdk/<lang>/ structure
}

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

const FEATURES = [
  { fn: "ask(message, context?, conversationId?)", auth: "API key", desc: "Send a message, return reply + conversationId" },
  { fn: "testKey()", auth: "API key", desc: "Verify the key, return organizationId + scopes" },
  { fn: "knowledge.create(title, content, ...)", auth: "API key (bot:write)", desc: "Add a knowledge base article" },
  { fn: "knowledge.update(id, patch)", auth: "API key (bot:write)", desc: "Update a KB article" },
  { fn: "knowledge.delete(id)", auth: "API key (bot:write)", desc: "Delete a KB article" },
  { fn: "knowledge.list()", auth: "JWT (admin)", desc: "List all KB articles" },
  { fn: "knowledge.get(id)", auth: "JWT (admin)", desc: "Get one KB article" },
  { fn: "Error types", auth: "—", desc: "ApiError, NetworkError, ConfigError with status code" },
];

export function SDKCommunityPage({ spec }: { spec: SDKSpec }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside className="py-8 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-border lg:pr-4">
          <Link href="/sdk" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> All SDKs
          </Link>
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview" },
              { id: "api-reference", label: "API reference" },
              { id: "checklist", label: "Implementation checklist" },
              { id: "structure", label: "File structure" },
              { id: "contribute", label: "How to contribute" },
            ].map((item) => (
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
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">For Developers · SDK</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight">{spec.label}</h1>
            </div>
            <span className="mt-2 flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
              <Circle className="h-3 w-3" /> Open for contribution
            </span>
          </div>
          <P>{spec.description}</P>
          <div className="mt-6 flex gap-3">
            <a
              href={spec.issueUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Github className="h-4 w-4" />
              Claim issue #{spec.issueNumber}
            </a>
            <a
              href="https://github.com/benflux-company/fluxchat-sdk/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              CONTRIBUTING.md
            </a>
          </div>

          <H2 id="overview">Overview</H2>
          <P>
            This SDK does not exist yet — you can build it. Use the{" "}
            <Link href="/sdk/js" className="text-primary hover:underline">JS/TypeScript SDK</Link>{" "}
            as the reference implementation. The API is identical for all languages — only the syntax changes.
          </P>

          <H2 id="api-reference">API reference</H2>
          <H3>Ask endpoint</H3>
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
          <H3>Test key</H3>
          <CodeBlock filename="test-key.http" code={`GET https://dev-api.fluxchat-corp.com/api/v2/public/bot/test
X-API-Key: fc_prod_your_key

// Response
{ "success": true, "data": { "organizationId": "org-uuid", "scopes": ["bot:read"] } }`} />
          <H3>Knowledge base</H3>
          <CodeBlock filename="kb.http" code={`// Create (requires bot:write scope)
POST /api/v2/organizations/{orgId}/knowledge-base
Authorization: X-API-Key fc_prod_your_key
{ "title": "FAQ", "content": "...", "category": "general", "keywords": ["faq"] }

// Update
PATCH /api/v2/organizations/{orgId}/knowledge-base/{id}
{ "content": "Updated content" }

// Delete
DELETE /api/v2/organizations/{orgId}/knowledge-base/{id}

// List / Get (requires JWT admin token)
GET /api/v2/organizations/{orgId}/knowledge-base
GET /api/v2/organizations/{orgId}/knowledge-base/{id}`} />

          <H3>Usage example — what the SDK should look like</H3>
          <CodeBlock filename={`example.${spec.lang === "react-native" ? "tsx" : spec.lang}`} code={spec.clientSnippet} />
          <CodeBlock filename={`ask.${spec.lang === "react-native" ? "tsx" : spec.lang}`} code={spec.askSnippet} />

          <H2 id="checklist">Implementation checklist</H2>
          <P>Every SDK must implement these features at minimum. Use the TypeScript types in <Code>src/types.ts</Code> as the reference.</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Method</th>
                  <th className="px-4 py-2 font-medium">Auth</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map(({ fn, auth, desc }) => (
                  <tr key={fn} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-[12px]">{fn}</td>
                    <td className="px-4 py-2 text-[12px] text-muted-foreground">{auth}</td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="structure">Expected file structure</H2>
          <CodeBlock filename="structure" code={spec.fileStructure} />

          <H2 id="contribute">How to contribute</H2>
          <P>Comment on the GitHub issue to claim it, then follow these steps:</P>
          <CodeBlock filename="terminal" code={`# 1. Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/fluxchat-sdk.git
cd fluxchat-sdk

# 2. Create your branch
git checkout -b ${spec.branch}

# 3. Add your SDK under sdk/${spec.lang}/
mkdir -p sdk/${spec.lang}

# 4. Implement the checklist, add tests, write a README

# 5. Push and open a PR against main
git push origin ${spec.branch}`} />
          <div className="mt-6 flex gap-3">
            <a
              href={spec.issueUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Github className="h-4 w-4" />
              View issue #{spec.issueNumber} on GitHub
            </a>
          </div>

          <Footer />
        </article>
      </div>
    </div>
  );
}
