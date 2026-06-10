import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "PHP SDK — FluxChat" };

export default function PHPSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "php",
      label: "PHP SDK",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/2",
      issueNumber: 2,
      branch: "sdk/php",
      description: "Official FluxChat SDK for PHP. Works with Laravel, Symfony, and plain PHP applications.",
      packageManager: "composer",
      packageName: "benflux/fluxchat-sdk",
      clientSnippet: `use Benflux\\FluxChat\\FluxChatClient;

$client = new FluxChatClient(
    apiKey: $_ENV['FLUXCHAT_API_KEY']
);`,
      askSnippet: `$response = $client->ask(
    message: 'What are your opening hours?',
    context: 'User: Alice, Plan: Pro',
);
echo $response->reply;
echo $response->conversationId;`,
      fileStructure: `sdk/php/
├── README.md
├── composer.json
├── src/
│   ├── FluxChatClient.php   # main client class
│   ├── Models/
│   │   ├── AskResponse.php
│   │   └── KBArticle.php
│   └── Exceptions/
│       ├── ApiException.php
│       └── NetworkException.php
└── tests/
    └── FluxChatClientTest.php`,
    }} />
  );
}
