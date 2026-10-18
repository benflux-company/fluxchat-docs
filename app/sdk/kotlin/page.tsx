import type { Metadata } from "next";
import { SDKReferencePage } from "@/components/sdk-reference-page";

export const metadata: Metadata = { title: "Kotlin SDK — FluxChat" };

export default function KotlinSDKPage() {
  return (
    <SDKReferencePage
      spec={{
        lang: "kotlin",
        label: "Kotlin / JVM SDK",
        version: "v0.3.0 · Stable",
        description:
          "Official FluxChat SDK for Kotlin and the JVM. Android, Spring Boot and Ktor servers — coroutines throughout, Ktor client, kotlinx.serialization models.",
        author: { login: "benjaminmugangu", contribution: "Kotlin SDK" },
        sourceUrl: "https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/kotlin",
        install: {
          filename: "build.gradle.kts",
          code: `dependencies {
    implementation("com.fluxchat:sdk:0.3.0")
}`,
        },
        client: {
          filename: "Client.kt",
          code: `import com.fluxchat.FluxChatClient

val client = FluxChatClient(apiKey = System.getenv("FLUXCHAT_API_KEY"))`,
        },
        ask: {
          filename: "Ask.kt",
          code: `val response = client.ask(
    message = "Quels sont vos horaires ?",
    context = "Utilisateur : Alice, Plan : Pro",
    sessionId = mySessionId,
)

println(response.reply)`,
        },
        handoff: {
          filename: "Handoff.kt",
          code: `val support = client.support()

// 1. Hand off — with the same sessionId you pass to ask, the bot's side of
//    the conversation is copied into the ticket.
val ticket = support.escalate(
    name = "Jordan Mbeki",
    email = "jordan@example.com",
    message = "Mon virement est bloqué depuis hier.",
    sessionId = mySessionId,
)

// 2. Follow the thread: the e-mail proves the ticket is theirs.
val thread = support.thread(ticket.ticketId, "jordan@example.com")
thread.messages.forEach { println("\${it.role}: \${it.content}") }  // bot | visitor | agent
if (thread.agentConnected) println("\${thread.agentName} is answering")

// 3. Let them reply into it.
support.reply(ticket.ticketId, "jordan@example.com", "La référence est 4821.")`,
        },
        knowledge: {
          filename: "Knowledge.kt",
          code: `val kb = client.knowledge(jwtToken)

val article = kb.create(title = "Délais de livraison", content = "Livraison sous 48 h en RDC.")
kb.delete(article.id)`,
        },
        errors: {
          filename: "Errors.kt",
          code: `try {
    support.thread(ticketId, "someone@else.com")
} catch (e: FluxChatApiException) {
    // 404 both when the ticket does not exist and when the e-mail does not
    // own it — deliberately indistinguishable.
    println("\${e.statusCode} \${e.message}")
} catch (e: FluxChatNetworkException) {
    println("transport failure: \${e.message}")
}`,
        },
      }}
    />
  );
}
