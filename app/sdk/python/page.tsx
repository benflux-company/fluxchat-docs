import type { Metadata } from "next";
import { SDKReferencePage } from "@/components/sdk-reference-page";

export const metadata: Metadata = { title: "Python SDK — FluxChat" };

export default function PythonSDKPage() {
  return (
    <SDKReferencePage
      spec={{
        lang: "python",
        label: "Python SDK",
        version: "v0.3.0 · Stable",
        description:
          "Official FluxChat SDK for Python. Works with Django, FastAPI, Flask, and plain scripts. Typed dataclasses, httpx under the hood.",
        author: { login: "benjaminmugangu", contribution: "Python SDK" },
        sourceUrl: "https://github.com/benflux-company/fluxchat-sdk/tree/main/sdk/python",
        install: { filename: "terminal", code: `pip install fluxchat` },
        client: {
          filename: "client.py",
          code: `import os
from fluxchat import FluxChat

client = FluxChat(api_key=os.environ["FLUXCHAT_API_KEY"])`,
        },
        ask: {
          filename: "ask.py",
          code: `response = client.ask(
    "Quels sont vos horaires ?",
    context="Utilisateur : Alice, Plan : Pro",
    session_id=my_session_id,
)
print(response.reply)
print(response.conversation_id)`,
        },
        handoff: {
          filename: "handoff.py",
          code: `# 1. Hand off. With the same session_id you pass to ask(), everything the
#    bot already said is copied into the ticket — the agent picks up mid-flow.
ticket = client.support.escalate(
    name="Jordan Mbeki",
    email="jordan@example.com",
    message="Mon virement est bloqué depuis hier.",
    session_id=my_session_id,
)

# 2. Follow the thread. Keep (ticket_id, email): the e-mail is what proves
#    the ticket is theirs — no account, no token.
thread = client.support.thread(ticket.ticket_id, "jordan@example.com")
for m in thread.messages:
    print(m.role, m.content)          # bot | visitor | agent
if thread.agent_connected:
    print(f"{thread.agent_name} is answering")

# 3. Let them reply into it.
client.support.reply(ticket.ticket_id, "jordan@example.com", "La référence est 4821.")`,
        },
        knowledge: {
          filename: "knowledge.py",
          code: `kb = client.knowledge

article = kb.create(
    title="Délais de livraison",
    content="Livraison sous 48 h en RDC.",
    keywords=["livraison", "délai"],
)
kb.update(article.id, content="Livraison sous 24 h à Kinshasa.")
kb.delete(article.id)`,
        },
        errors: {
          filename: "errors.py",
          code: `from fluxchat import FluxChatApiError, FluxChatNetworkError, FluxChatConfigError

try:
    client.support.thread(ticket_id, "someone@else.com")
except FluxChatApiError as err:
    # 404 both when the ticket does not exist and when the e-mail does not
    # own it — deliberately indistinguishable.
    print(err.status_code, err)
except FluxChatNetworkError as err:
    print("transport failure:", err)
except FluxChatConfigError as err:
    print("bad client configuration:", err)`,
        },
      }}
    />
  );
}
