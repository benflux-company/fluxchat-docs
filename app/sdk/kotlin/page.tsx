import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "Kotlin SDK — FluxChat" };

export default function KotlinSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "kotlin",
      label: "Kotlin SDK (Android / JVM)",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/7",
      issueNumber: 7,
      branch: "sdk/kotlin",
      description: "Kotlin SDK with coroutines for Android and JVM applications.",
      packageManager: "gradle",
      packageName: "com.benflux:fluxchat-sdk",
      clientSnippet: `import com.benflux.fluxchat.FluxChatClient

val client = FluxChatClient(
    apiKey = System.getenv("FLUXCHAT_API_KEY")
)`,
      askSnippet: `val response = client.ask(
    message = "What are your opening hours?",
    context = "User: Alice, Plan: Pro"
)
println(response.reply)
println(response.conversationId)`,
      fileStructure: `sdk/kotlin/
├── README.md
├── build.gradle.kts
├── src/main/kotlin/com/benflux/fluxchat/
│   ├── FluxChatClient.kt
│   ├── Models.kt            # AskResponse, KBArticle, KeyInfo
│   └── Errors.kt            # FluxChatApiException, NetworkException
└── src/test/kotlin/
    └── FluxChatClientTest.kt`,
    }} />
  );
}
