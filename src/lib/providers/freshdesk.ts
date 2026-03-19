import type {
  TicketProvider,
  TicketProviderCredentials,
  FetchResult,
  NormalizedTicket,
  NormalizedMessage,
} from "./types";

export class FreshdeskProvider implements TicketProvider {
  private baseUrl: string;
  private authHeader: string;

  constructor(credentials: TicketProviderCredentials) {
    this.baseUrl = `https://${credentials.subdomain}.freshdesk.com`;
    this.authHeader =
      "Basic " +
      Buffer.from(`${credentials.apiKey}:X`).toString("base64");
  }

  private async request(path: string) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Freshdesk API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.request("/api/v2/agents/me");
      return true;
    } catch {
      return false;
    }
  }

  async fetchResolvedTickets(cursor?: string): Promise<FetchResult> {
    const page = cursor ? parseInt(cursor) : 1;
    const query = encodeURIComponent('"status:4 OR status:5"');
    const data = await this.request(
      `/api/v2/search/tickets?query=${query}&page=${page}`
    );

    const results = data.results || [];
    const tickets: NormalizedTicket[] = [];

    for (const ticket of results) {
      const messages = await this.fetchTicketConversations(ticket.id);
      tickets.push({
        externalId: String(ticket.id),
        subject: ticket.subject || "(sans objet)",
        customer: ticket.requester?.name || ticket.email || "Client",
        status: this.mapStatus(ticket.status),
        resolvedAt: ticket.updated_at,
        messages,
      });
    }

    // Freshdesk returns max 30 results per page
    const hasMore = results.length >= 30;

    return {
      tickets,
      nextCursor: hasMore ? String(page + 1) : null,
      total: data.total || 0,
    };
  }

  private async fetchTicketConversations(
    ticketId: number
  ): Promise<NormalizedMessage[]> {
    const data = await this.request(
      `/api/v2/tickets/${ticketId}/conversations`
    );

    return (data || []).map(
      (c: {
        incoming: boolean;
        body_text: string;
        body: string;
        created_at: string;
      }) => ({
        role: c.incoming ? ("customer" as const) : ("agent" as const),
        body: c.body_text || c.body?.replace(/<[^>]*>/g, "") || "",
        date: c.created_at,
      })
    );
  }

  private mapStatus(status: number): string {
    const map: Record<number, string> = {
      2: "open",
      3: "pending",
      4: "resolved",
      5: "closed",
    };
    return map[status] || "unknown";
  }
}
