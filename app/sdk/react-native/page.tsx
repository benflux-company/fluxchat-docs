import type { Metadata } from "next";
import { SDKCommunityPage } from "@/components/sdk-community-page";

export const metadata: Metadata = { title: "React Native SDK — FluxChat" };

export default function ReactNativeSDKPage() {
  return (
    <SDKCommunityPage spec={{
      lang: "react-native",
      label: "React Native SDK",
      issueUrl: "https://github.com/benflux-company/fluxchat-sdk/issues/8",
      issueNumber: 8,
      branch: "sdk/react-native",
      description: "Native widget component and hook for React Native. No DOM — uses React Context instead of window.fluxchatContext.",
      packageManager: "npm install",
      packageName: "@fluxchat_sdk/react-native",
      clientSnippet: `import { FluxChatWidget, FluxChatProvider } from '@fluxchat_sdk/react-native';

// Wrap your app
export default function App() {
  return (
    <FluxChatProvider apiKey={process.env.EXPO_PUBLIC_FLUXCHAT_KEY!}>
      <YourApp />
      <FluxChatWidget />
    </FluxChatProvider>
  );
}`,
      askSnippet: `// Headless — use the hook directly
import { useFluxChat } from '@fluxchat_sdk/react-native';

function SupportScreen() {
  const { ask, messages, loading } = useFluxChat();

  const handleSend = async (text: string) => {
    await ask({ message: text, context: 'User: Alice' });
  };
}`,
      fileStructure: `sdk/react-native/
├── README.md
├── package.json
├── src/
│   ├── FluxChatWidget.tsx   # floating chat bubble (native UI)
│   ├── FluxChatProvider.tsx # context provider
│   ├── useFluxChat.ts       # headless hook
│   └── types.ts             # AskResponse, Message, etc.
└── __tests__/
    └── useFluxChat.test.ts`,
    }} />
  );
}
