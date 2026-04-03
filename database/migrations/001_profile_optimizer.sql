-- Profile Optimizer Tables
-- This migration runs against the shared Turso instance used by
-- health-check, application-assessment, and client-dashboard.
-- It does NOT redefine tables owned by other pipeline projects
-- (clients, prospects, applications, etc.).

CREATE TABLE IF NOT EXISTS gbp_leads (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  business_type TEXT NOT NULL,
  city_region TEXT NOT NULL,
  business_description TEXT,
  has_gbp INTEGER NOT NULL DEFAULT 0,
  gbp_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  stripe_session_id TEXT
);

CREATE TABLE IF NOT EXISTS gbp_deliverables (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  lead_id TEXT,
  prospect_id TEXT,
  client_id TEXT,
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_type TEXT NOT NULL,
  city_region TEXT NOT NULL,
  track TEXT NOT NULL DEFAULT 'A',
  gbp_place_id TEXT,
  gbp_data TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  expires_at INTEGER,
  published_at INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0
);
