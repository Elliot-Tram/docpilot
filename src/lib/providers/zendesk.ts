import type {
  TicketProvider,
  TicketProviderCredentials,
  FetchResult,
  NormalizedTicket,
  NormalizedMessage,
} from "./types";

export class ZendeskProvider implements TicketProvider {
  private baseUrl: string;
  private authHeader: string;

  constructor(credentials: TicketProviderCredentials) {
    this.baseUrl = `https://${credentials.subdomain}.zendesk.com`;
    this.authHeader =
      "Basic " +
      Buffer.from(`${credentials.email}/token:${credentials.apiKey}`).toString(
        "base64"
      );
  }

  private async request(path: string) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Zendesk API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.request("/api/v2/users/me.json");
      return true;
    } catch {
      return false;
    }
  }

  async fetchResolvedTickets(cursor?: string): Promise<FetchResult> {
    // Use search API to find solved/closed tickets
    let path: string;
    if (cursor) {
      // cursor is the full next_page URL from Zendesk, extract the path
      const url = new URL(cursor);
      path = url.pathname + url.search;
    } else {
      path =
        "/api/v2/search.json?query=" +
        encodeURIComponent("type:ticket status:solved status:closed") +
        "&sort_by=updated_at&sort_order=desc&per_page=100";
    }

    const data = await this.request(path);
    const tickets: NormalizedTicket[] = [];

    for (const ticket of data.results || []) {
      const messages = await this.fetchTicketComments(ticket.id);
      tickets.push({
        externalId: String(ticket.id),
        subject: ticket.subject || "(sans objet)",
        customer: ticket.via?.source?.from?.name || "Client",
        status: ticket.status,
        resolvedAt: ticket.updated_at,
        messages,
      });
    }

    return {
      tickets,
      nextCursor: data.next_page || null,
      total: data.count || 0,
    };
  }

  private async fetchTicketComments(
    ticketId: number
  ): Promise<NormalizedMessage[]> {
    const data = await this.request(
      `/api/v2/tickets/${ticketId}/comments.json`
    );
    const comments = data.comments || [];

    // Get requester info to distinguish customer from agent
    // The first comment's author_id is typically the requester
    const requesterId = comments[0]?.author_id;

    return comments
      .filter((c: { public: boolean }) => c.public)
      .map(
        (c: {
          author_id: number;
          body: string;
          created_at: string;
        }) => ({
          role:
            c.author_id === requesterId
              ? ("customer" as const)
              : ("agent" as const),
          body: c.body || "",
          date: c.created_at,
        })
      );
  }
}
