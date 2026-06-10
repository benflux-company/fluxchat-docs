import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "Swift SDK — FluxChat" };

export default function SwiftSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "swift",
      label: "Swift SDK (iOS / macOS)",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/6",
      issueNumber: 6,
      branch: "sdk/swift",
      description: "Native Swift SDK with async/await for iOS and macOS applications.",
      packageManager: "swift package",
      packageName: "FluxChatSDK",
      clientSnippet: `import FluxChatSDK

let client = FluxChatClient(
    apiKey: ProcessInfo.processInfo.environment["FLUXCHAT_API_KEY"]!
)`,
      askSnippet: `let response = try await client.ask(
    message: "What are your opening hours?",
    context: "User: Alice, Plan: Pro"
)
print(response.reply)
print(response.conversationId)`,
      fileStructure: `sdk/swift/
├── README.md
├── Package.swift
├── Sources/FluxChatSDK/
│   ├── FluxChatClient.swift
│   ├── Models.swift         # AskResponse, KBArticle, KeyInfo
│   └── Errors.swift         # FluxChatError, APIError
└── Tests/FluxChatSDKTests/
    └── FluxChatClientTests.swift`,
    }} />
  );
}
