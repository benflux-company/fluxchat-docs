import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "C# / .NET SDK — FluxChat" };

export default function DotNetSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "dotnet",
      label: "C# / .NET SDK",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/5",
      issueNumber: 5,
      branch: "sdk/dotnet",
      description: "Official FluxChat SDK for C# and .NET. Works with ASP.NET Core, Blazor, and console applications.",
      packageManager: "dotnet add package",
      packageName: "Benflux.FluxChat",
      clientSnippet: `using Benflux.FluxChat;

var client = new FluxChatClient(
    apiKey: Environment.GetEnvironmentVariable("FLUXCHAT_API_KEY")!
);`,
      askSnippet: `var response = await client.AskAsync(
    message: "What are your opening hours?",
    context: "User: Alice, Plan: Pro"
);
Console.WriteLine(response.Reply);
Console.WriteLine(response.ConversationId);`,
      fileStructure: `sdk/dotnet/
├── README.md
├── Benflux.FluxChat/
│   ├── Benflux.FluxChat.csproj
│   ├── FluxChatClient.cs
│   ├── Models/
│   │   ├── AskResponse.cs
│   │   └── KBArticle.cs
│   └── Exceptions/
│       └── FluxChatApiException.cs
└── Tests/
    └── FluxChatClientTests.cs`,
    }} />
  );
}
