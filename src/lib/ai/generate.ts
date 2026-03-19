import Anthropic from "@anthropic-ai/sdk";
import { GENERATE_ARTICLE_PROMPT } from "./prompts";

function getClient() {
  return new Anthropic();
}

interface GenerateInput {
  theme: string;
  tickets: Array<{
    subject: string;
    messages: Array<{ role: string; body: string }>;
  }>;
}

export async function generateArticle(input: GenerateInput): Promise<string> {
  const ticketContext = input.tickets
    .map((t) => {
      const conversation = t.messages
        .slice(0, 4) // Keep first 4 messages max
        .map((m) => `${m.role === "customer" ? "Client" : "Agent"}: ${m.body.substring(0, 300)}`)
        .join("\n");
      return `Ticket: ${t.subject}\n${conversation}`;
    })
    .join("\n---\n");

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `${GENERATE_ARTICLE_PROMPT}\n\nSujet : ${input.theme}\n\nTickets associés :\n\n${ticketContext}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return text;
}
