import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "Python SDK — FluxChat" };

export default function PythonSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "python",
      label: "Python SDK",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/1",
      issueNumber: 1,
      branch: "sdk/python",
      description: "Official FluxChat SDK for Python. Works with Django, FastAPI, Flask, and plain scripts.",
      packageManager: "pip",
      packageName: "fluxchat-sdk",
      clientSnippet: `from fluxchat import FluxChat
import os

client = FluxChat(api_key=os.environ["FLUXCHAT_API_KEY"])`,
      askSnippet: `response = await client.ask(
    message="What are your opening hours?",
    context="User: Alice, Plan: Pro",
)
print(response.reply)
print(response.conversation_id)`,
      fileStructure: `sdk/python/
├── README.md
├── pyproject.toml
├── fluxchat/
│   ├── __init__.py          # exports FluxChat, errors
│   ├── client.py            # FluxChat class
│   ├── models.py            # AskResponse, KeyInfo, KBArticle
│   └── errors.py            # FluxChatApiError, FluxChatNetworkError
└── tests/
    └── test_client.py`,
    }} />
  );
}
