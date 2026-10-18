import type { Metadata } from "next";
import { SDKReferencePage } from "@/components/sdk-reference-page";

export const metadata: Metadata = { title: "PHP SDK — FluxChat" };

export default function PhpSDKPage() {
  return (
    <SDKReferencePage
      spec={{
        lang: "php",
        label: "PHP SDK",
        version: "v0.3.0 · Stable",
        description:
          "Official FluxChat SDK for PHP 8.1+. Works with Laravel, Symfony, WordPress, and plain PHP. cURL under the hood, typed exceptions, no framework dependency.",
        author: { login: "benjaminmugangu", contribution: "PHP SDK" },
        sourceUrl: "https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/php",
        install: { filename: "terminal", code: `composer require fluxchat/sdk` },
        client: {
          filename: "client.php",
          code: `<?php
use FluxChat\\FluxChat;

$client = new FluxChat(getenv('FLUXCHAT_API_KEY'));`,
        },
        ask: {
          filename: "ask.php",
          code: `$response = $client->ask(
    'Quels sont vos horaires ?',
    context: 'Utilisateur : Alice, Plan : Pro',
    sessionId: $sessionId,
);

echo $response['reply'];`,
        },
        handoff: {
          filename: "handoff.php",
          code: `$support = $client->support();

// 1. Hand off — with the same $sessionId you pass to ask(), the bot's side
//    of the conversation is copied into the ticket.
$ticket = $support->escalate(
    'Jordan Mbeki',
    'jordan@example.com',
    'Mon virement est bloqué depuis hier.',
    $sessionId,
);

// 2. Follow the thread: the e-mail proves the ticket is theirs.
$thread = $support->thread($ticket['ticketId'], 'jordan@example.com');
foreach ($thread['messages'] as $m) {
    echo $m['role'] . ' : ' . $m['content'] . PHP_EOL;  // bot | visitor | agent
}

// 3. Let them reply into it.
$support->reply($ticket['ticketId'], 'jordan@example.com', 'La référence est 4821.');`,
        },
        knowledge: {
          filename: "knowledge.php",
          code: `$kb = $client->knowledge($jwtToken);

$article = $kb->create('Délais de livraison', 'Livraison sous 48 h en RDC.');
$kb->update($article['id'], ['content' => 'Livraison sous 24 h à Kinshasa.']);
$kb->delete($article['id']);`,
        },
        errors: {
          filename: "errors.php",
          code: `use FluxChat\\Exceptions\\FluxChatApiException;
use FluxChat\\Exceptions\\FluxChatNetworkException;

try {
    $support->thread($ticketId, 'someone@else.com');
} catch (FluxChatApiException $e) {
    // 404 both when the ticket does not exist and when the e-mail does not
    // own it — deliberately indistinguishable.
    echo $e->getStatusCode() . ' ' . $e->getMessage();
} catch (FluxChatNetworkException $e) {
    echo 'transport failure: ' . $e->getMessage();
}`,
        },
      }}
    />
  );
}
