import type { Metadata } from "next";
import { SDKReferencePage } from "@/components/sdk-reference-page";

export const metadata: Metadata = { title: "Swift SDK — FluxChat" };

export default function SwiftSDKPage() {
  return (
    <SDKReferencePage
      spec={{
        lang: "swift",
        label: "Swift SDK",
        version: "v0.3.0 · Stable",
        description:
          "Official FluxChat SDK for Swift. iOS, macOS and server-side Swift, built on async/await and URLSession with Codable models.",
        author: { login: "benjaminmugangu", contribution: "Swift SDK" },
        sourceUrl: "https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/swift",
        install: {
          filename: "Package.swift",
          code: `dependencies: [
    .package(url: "https://github.com/benflux-company/fluxchat-sdk.git", from: "0.3.0"),
]`,
        },
        client: {
          filename: "Client.swift",
          code: `import FluxChat

let client = FluxChatClient(apiKey: ProcessInfo.processInfo.environment["FLUXCHAT_API_KEY"]!)`,
        },
        ask: {
          filename: "Ask.swift",
          code: `let response = try await client.ask(
    message: "Quels sont vos horaires ?",
    context: "Utilisateur : Alice, Plan : Pro",
    sessionId: mySessionId
)

print(response.reply)`,
        },
        handoff: {
          filename: "Handoff.swift",
          code: `let support = client.support()

// 1. Hand off — with the same sessionId you pass to ask, the bot's side of
//    the conversation is copied into the ticket.
let ticket = try await support.escalate(
    name: "Jordan Mbeki",
    email: "jordan@example.com",
    message: "Mon virement est bloqué depuis hier.",
    sessionId: mySessionId
)

// 2. Follow the thread: the e-mail proves the ticket is theirs.
let thread = try await support.thread(ticketId: ticket.ticketId, email: "jordan@example.com")
for m in thread.messages {
    print(m.role, m.content)       // .bot | .visitor | .agent
}
if thread.agentConnected { print("\\(thread.agentName ?? "An agent") is answering") }

// 3. Let them reply into it.
try await support.reply(
    ticketId: ticket.ticketId,
    email: "jordan@example.com",
    content: "La référence est 4821."
)`,
        },
        knowledge: {
          filename: "Knowledge.swift",
          code: `let kb = client.knowledge(jwtToken: jwt)

let article = try await kb.create(title: "Délais de livraison",
                                  content: "Livraison sous 48 h en RDC.")
try await kb.delete(id: article.id)`,
        },
        errors: {
          filename: "Errors.swift",
          code: `do {
    _ = try await support.thread(ticketId: ticketId, email: "someone@else.com")
} catch let error as FluxChatError {
    // 404 both when the ticket does not exist and when the e-mail does not
    // own it — deliberately indistinguishable.
    print(error)
}`,
        },
      }}
    />
  );
}
