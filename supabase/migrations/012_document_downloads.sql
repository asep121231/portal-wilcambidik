-- Create document_downloads table for tracking document download analytics
CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_document_downloads_doc ON document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_time ON document_downloads(downloaded_at);

-- Enable RLS
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Allow public insert on document_downloads" ON document_downloads;
DROP POLICY IF EXISTS "Allow authenticated select on document_downloads" ON document_downloads;

-- Policy: Allow public to track downloads
CREATE POLICY "Allow public insert on document_downloads" ON document_downloads
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow authenticated users to view download analytics
CREATE POLICY "Allow authenticated select on document_downloads" ON document_downloads
    FOR SELECT
    USING (auth.role() = 'authenticated');
