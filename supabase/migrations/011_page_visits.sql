-- Create page_visits table for tracking website visitors
CREATE TABLE IF NOT EXISTS page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    referrer VARCHAR(500),
    user_agent TEXT,
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    ip_hash VARCHAR(64), -- Hashed IP for privacy
    session_id VARCHAR(64), -- To track unique sessions
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_page_visits_path ON page_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_session ON page_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_device ON page_visits(device_type);

-- Enable RLS
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Allow public insert on page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated select on page_visits" ON page_visits;

-- Policy: Allow public to insert page visits
CREATE POLICY "Allow public insert on page_visits" ON page_visits
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow authenticated users to view analytics
CREATE POLICY "Allow authenticated select on page_visits" ON page_visits
    FOR SELECT
    USING (auth.role() = 'authenticated');
