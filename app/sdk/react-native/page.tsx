import type { Metadata } from "next";
import { SDKReferencePage } from "@/components/sdk-reference-page";

export const metadata: Metadata = { title: "React Native SDK — FluxChat" };

export default function ReactNativeSDKPage() {
  return (
    <SDKReferencePage
      spec={{
        lang: "react-native",
        label: "React Native SDK",
        version: "v0.3.0 · Stable",
        description:
          "Official FluxChat SDK for React Native and Expo. A drop-in FluxChatWidget component, a useFluxChat hook for your own UI, and the full typed client.",
        author: { login: "benjaminmugangu", contribution: "React Native SDK" },
        sourceUrl: "https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/react-native",
        install: { filename: "terminal", code: `npm install @fluxchat/react-native` },
        client: {
          filename: "App.tsx",
          code: `import { FluxChatWidget, FluxChatClient } from '@fluxchat/react-native';

// Drop-in floating bubble + chat modal
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* your app */}
      <FluxChatWidget apiKey={process.env.EXPO_PUBLIC_FLUXCHAT_KEY!} />
    </View>
  );
}

// …or drive it yourself
const client = new FluxChatClient({ apiKey: process.env.EXPO_PUBLIC_FLUXCHAT_KEY! });`,
        },
        ask: {
          filename: "ask.ts",
          code: `const { reply, conversationId } = await client.ask('Quels sont vos horaires ?', {
  context: 'Utilisateur : Alice, Plan : Pro',
  sessionId: mySessionId,
});`,
        },
        handoff: {
          filename: "handoff.ts",
          code: `const support = client.support();

// 1. Hand off — with the same sessionId you pass to ask, the bot's side of
//    the conversation is copied into the ticket.
const { ticketId } = await support.escalate({
  name: 'Jordan Mbeki',
  email: 'jordan@example.com',
  message: 'Mon virement est bloqué depuis hier.',
  sessionId: mySessionId,
});

// 2. Follow the thread: the e-mail proves the ticket is theirs. Store
//    { ticketId, email } in AsyncStorage so it survives an app restart.
const thread = await support.thread(ticketId, 'jordan@example.com');
thread.messages.forEach((m) => console.log(m.role, m.content)); // bot | visitor | agent

// 3. Let them reply into it.
await support.reply(ticketId, 'jordan@example.com', 'La référence est 4821.');`,
        },
        knowledge: {
          filename: "knowledge.ts",
          code: `const kb = client.knowledge(jwtToken);

const article = await kb.create('Délais de livraison', 'Livraison sous 48 h en RDC.');
await kb.delete(article.id);`,
        },
        errors: {
          filename: "errors.ts",
          code: `import { FluxChatError, FluxChatNetworkError } from '@fluxchat/react-native';

try {
  await support.thread(ticketId, 'someone@else.com');
} catch (err) {
  if (err instanceof FluxChatError) {
    // 404 both when the ticket does not exist and when the e-mail does not
    // own it — deliberately indistinguishable.
    console.log(err.message);
  } else if (err instanceof FluxChatNetworkError) {
    console.log('transport failure', err);
  }
}`,
        },
      }}
    />
  );
}
