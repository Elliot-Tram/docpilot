import type {
  TicketProvider,
  TicketProviderCredentials,
  FetchResult,
  NormalizedTicket,
  NormalizedMessage,
} from "./types";

export class IntercomProvider implements TicketProvider {
  private baseUrl = "https://api.intercom.io";
  private authHeader: string;

  constructor(credentials: TicketProviderCredentials) {
    this.authHeader = `Bearer ${credentials.apiKey}`;
  }

  private async request(path: string, options?: RequestInit) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`Intercom API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.request("/me");
      return true;
    } catch {
      return false;
    }
  }

  async fetchResolvedTickets(cursor?: string): Promise<FetchResult> {
    const body: Record<string, unknown> = {
      query: {
        field: "state",
        operator: "=",
        value: "closed",
      },
      pagination: {
        per_page: 50,
        ...(cursor ? { starting_after: cursor } : {}),
      },
    };

    const data = await this.request("/conversations/search", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const tickets: NormalizedTicket[] = [];

    for (const conv of data.conversations || []) {
      const full = await this.request(`/conversations/${conv.id}`);
      const messages = this.extractMessages(full);

      tickets.push({
        externalId: String(conv.id),
        subject:
          conv.title ||
          conv.source?.subject ||
          full.source?.body?.substring(0, 80) ||
          "(sans objet)",
        customer: conv.contacts?.contacts?.[0]?.name || "Client",
        status: conv.state,
        resolvedAt: conv.statistics?.last_close_at
          ? new Date(conv.statistics.last_close_at * 1000).toISOString()
          : null,
        messages,
      });
    }

    const nextCursor = data.pages?.next?.starting_after || null;

    return {
      tickets,
      nextCursor,
      total: data.total_count || 0,
    };
  }

  private extractMessages(conversation: {
    source?: { body?: string; author?: { type?: string }; delivered_as?: string };
    conversation_parts?: {
      conversation_parts?: Array<{
        part_type?: string;
        body?: string;
        author?: { type?: string };
        created_at?: number;
      }>;
    };
  }): NormalizedMessage[] {
    const messages: NormalizedMessage[] = [];

    // First message from source
    if (conversation.source?.body) {
      messages.push({
        role:
          conversation.source.author?.type === "admin" ? "agent" : "customer",
        body: conversation.source.body.replace(/<[^>]*>/g, ""),
        date: "",
      });
    }

    // Conversation parts
    const parts =
      conversation.conversation_parts?.conversation_parts || [];
    for (const part of parts) {
      if (part.part_type === "comment" && part.body) {
        messages.push({
          role: part.author?.type === "admin" ? "agent" : "customer",
          body: part.body.replace(/<[^>]*>/g, ""),
          date: part.created_at
            ? new Date(part.created_at * 1000).toISOString()
            : "",
        });
      }
    }

    return messages;
  }
}
