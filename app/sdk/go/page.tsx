import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "Go SDK — FluxChat" };

export default function GoSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "go",
      label: "Go SDK",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/4",
      issueNumber: 4,
      branch: "sdk/go",
      description: "Idiomatic Go SDK with context support for Go backends and CLI tools.",
      packageManager: "go get",
      packageName: "github.com/benflux-company/fluxchat-sdk/sdk/go",
      clientSnippet: `import "github.com/benflux-company/fluxchat-sdk/sdk/go/fluxchat"

client := fluxchat.NewClient(os.Getenv("FLUXCHAT_API_KEY"))`,
      askSnippet: `resp, err := client.Ask(ctx, fluxchat.AskRequest{
    Message: "What are your opening hours?",
    Context: "User: Alice, Plan: Pro",
})
if err != nil { log.Fatal(err) }
fmt.Println(resp.Reply)`,
      fileStructure: `sdk/go/
├── README.md
├── go.mod
├── fluxchat/
│   ├── client.go       # NewClient, Ask, TestKey
│   ├── knowledge.go    # Create, Update, Delete, List, Get
│   ├── models.go       # AskRequest, AskResponse, KBArticle
│   └── errors.go       # APIError, NetworkError
└── fluxchat_test.go`,
    }} />
  );
}
