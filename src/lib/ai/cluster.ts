import Anthropic from "@anthropic-ai/sdk";
import { CLUSTER_PROMPT } from "./prompts";

function getClient() {
  return new Anthropic();
}

interface ClusterResult {
  theme: string;
  summary: string;
  ticket_ids: string[];
  confidence: number;
}

export async function clusterTickets(
  tickets: Array<{ id: string; subject: string; firstMessage: string }>
): Promise<ClusterResult[]> {
  const ticketList = tickets
    .map(
      (t) =>
        `[${t.id}] ${t.subject}\n> ${t.firstMessage.substring(0, 200)}`
    )
    .join("\n\n");

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${CLUSTER_PROMPT}\n\nVoici les tickets :\n\n${ticketList}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    return JSON.parse(text) as ClusterResult[];
  } catch {
    // Try to extract JSON from the response if it has extra text
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]) as ClusterResult[];
    }
    throw new Error("Impossible de parser la réponse de clustering");
  }
}
