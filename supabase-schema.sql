-- Docpilot MVP++ Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Sources: Zendesk/Intercom/Freshdesk connections
CREATE TABLE sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('zendesk', 'intercom', 'freshdesk')),
  status      TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'syncing', 'disconnected', 'error')),
  credentials JSONB NOT NULL,
  config      JSONB DEFAULT '{}',
  tickets_imported INTEGER DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Tickets: imported support tickets
CREATE TABLE tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  subject     TEXT NOT NULL,
  customer    TEXT,
  status      TEXT,
  messages    JSONB NOT NULL DEFAULT '[]',
  resolved_at TIMESTAMPTZ,
  imported_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_id, external_id)
);

-- Clusters: groups of related tickets
CREATE TABLE clusters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme       TEXT NOT NULL,
  summary     TEXT,
  ticket_count INTEGER DEFAULT 0,
  confidence  REAL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Cluster-Ticket junction
CREATE TABLE cluster_tickets (
  cluster_id  UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  ticket_id   UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  PRIMARY KEY (cluster_id, ticket_id)
);

-- Articles: generated help center articles
CREATE TABLE articles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id  UUID REFERENCES clusters(id) ON DELETE SET NULL,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  summary     TEXT,
  content     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'rejected')),
  category    TEXT,
  ticket_count INTEGER DEFAULT 0,
  confidence  REAL DEFAULT 0,
  external_id TEXT,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Sync logs: track import progress
CREATE TABLE sync_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  tickets_fetched INTEGER DEFAULT 0,
  error       TEXT,
  started_at  TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Policies: users see only their own data
CREATE POLICY "Users manage own sources" ON sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own tickets" ON tickets FOR ALL USING (
  source_id IN (SELECT id FROM sources WHERE user_id = auth.uid())
);
CREATE POLICY "Users manage own clusters" ON clusters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own cluster_tickets" ON cluster_tickets FOR ALL USING (
  cluster_id IN (SELECT id FROM clusters WHERE user_id = auth.uid())
);
CREATE POLICY "Users manage own articles" ON articles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own sync_logs" ON sync_logs FOR ALL USING (
  source_id IN (SELECT id FROM sources WHERE user_id = auth.uid())
);

-- Indexes
CREATE INDEX idx_tickets_source ON tickets(source_id);
CREATE INDEX idx_articles_user ON articles(user_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_clusters_user ON clusters(user_id);
CREATE INDEX idx_sync_logs_source ON sync_logs(source_id);
