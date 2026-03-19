export interface NormalizedMessage {
  role: "customer" | "agent";
  body: string;
  date: string;
}

export interface NormalizedTicket {
  externalId: string;
  subject: string;
  customer: string;
  status: string;
  resolvedAt: string | null;
  messages: NormalizedMessage[];
}

export interface FetchResult {
  tickets: NormalizedTicket[];
  nextCursor: string | null;
  total: number;
}

export interface TicketProviderCredentials {
  apiKey: string;
  subdomain?: string; // Zendesk & Freshdesk
  email?: string; // Zendesk requires email
}

export interface TicketProvider {
  validateCredentials(): Promise<boolean>;
  fetchResolvedTickets(cursor?: string): Promise<FetchResult>;
}
