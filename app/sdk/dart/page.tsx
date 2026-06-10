import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "Dart / Flutter SDK — FluxChat" };

export default function DartSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "dart",
      label: "Dart / Flutter SDK",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/3",
      issueNumber: 3,
      branch: "sdk/dart",
      description: "Official FluxChat SDK for Dart and Flutter. Enables AI assistant integration in mobile, desktop, and Dart server apps.",
      packageManager: "pub",
      packageName: "fluxchat",
      clientSnippet: `import 'package:fluxchat/fluxchat.dart';

final client = FluxChatClient(
  apiKey: Platform.environment['FLUXCHAT_API_KEY']!,
);`,
      askSnippet: `final response = await client.ask(
  message: 'What are your opening hours?',
  context: 'User: Alice, Plan: Pro',
);
print(response.reply);
print(response.conversationId);`,
      fileStructure: `sdk/dart/
├── README.md
├── pubspec.yaml
├── lib/
│   ├── fluxchat.dart        # main export
│   ├── src/
│   │   ├── client.dart      # FluxChatClient class
│   │   ├── models.dart      # AskResponse, KeyInfo, KBArticle
│   │   └── errors.dart      # FluxChatApiError, FluxChatNetworkError
└── test/
    └── fluxchat_test.dart`,
    }} />
  );
}
