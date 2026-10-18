import type { Metadata } from "next";
import { SDKReferencePage } from "@/components/sdk-reference-page";

export const metadata: Metadata = { title: ".NET SDK — FluxChat" };

export default function DotnetSDKPage() {
  return (
    <SDKReferencePage
      spec={{
        lang: "dotnet",
        label: ".NET / C# SDK",
        version: "v0.3.0 · Stable",
        description:
          "Official FluxChat SDK for .NET. ASP.NET Core, Blazor, MAUI and console apps — async throughout, HttpClient under the hood, System.Text.Json models.",
        author: { login: "benjaminmugangu", contribution: ".NET SDK" },
        sourceUrl: "https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/dotnet",
        install: { filename: "terminal", code: `dotnet add package FluxChat` },
        client: {
          filename: "Client.cs",
          code: `using FluxChat;

var client = new FluxChatClient(Environment.GetEnvironmentVariable("FLUXCHAT_API_KEY")!);`,
        },
        ask: {
          filename: "Ask.cs",
          code: `var response = await client.AskAsync(
    "Quels sont vos horaires ?",
    context: "Utilisateur : Alice, Plan : Pro",
    sessionId: mySessionId);

Console.WriteLine(response.Reply);`,
        },
        handoff: {
          filename: "Handoff.cs",
          code: `var support = client.Support();

// 1. Hand off — with the same sessionId you pass to AskAsync, the bot's side
//    of the conversation is copied into the ticket.
var ticket = await support.EscalateAsync(
    "Jordan Mbeki",
    "jordan@example.com",
    "Mon virement est bloqué depuis hier.",
    mySessionId);

// 2. Follow the thread: the e-mail proves the ticket is theirs.
var thread = await support.ThreadAsync(ticket.TicketId, "jordan@example.com");
foreach (var m in thread.Messages)
    Console.WriteLine($"{m.Role}: {m.Content}");      // bot | visitor | agent
if (thread.AgentConnected)
    Console.WriteLine($"{thread.AgentName} is answering");

// 3. Let them reply into it.
await support.ReplyAsync(ticket.TicketId, "jordan@example.com", "La référence est 4821.");`,
        },
        knowledge: {
          filename: "Knowledge.cs",
          code: `var kb = client.Knowledge(jwtToken);

var article = await kb.CreateAsync("Délais de livraison", "Livraison sous 48 h en RDC.");
await kb.DeleteAsync(article.Id);`,
        },
        errors: {
          filename: "Errors.cs",
          code: `try
{
    await support.ThreadAsync(ticketId, "someone@else.com");
}
catch (FluxChatApiException ex)
{
    // 404 both when the ticket does not exist and when the e-mail does not
    // own it — deliberately indistinguishable.
    Console.WriteLine($"{ex.StatusCode} {ex.Message}");
}
catch (FluxChatNetworkException ex)
{
    Console.WriteLine($"transport failure: {ex.Message}");
}`,
        },
      }}
    />
  );
}
