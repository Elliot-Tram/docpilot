import type { TicketProvider, TicketProviderCredentials } from "./types";
import { ZendeskProvider } from "./zendesk";
import { IntercomProvider } from "./intercom";
import { FreshdeskProvider } from "./freshdesk";

export function createProvider(
  type: "zendesk" | "intercom" | "freshdesk",
  credentials: TicketProviderCredentials
): TicketProvider {
  switch (type) {
    case "zendesk":
      return new ZendeskProvider(credentials);
    case "intercom":
      return new IntercomProvider(credentials);
    case "freshdesk":
      return new FreshdeskProvider(credentials);
  }
}

export type { TicketProvider, TicketProviderCredentials, NormalizedTicket, NormalizedMessage, FetchResult } from "./types";
