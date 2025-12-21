-- Post views tracking
CREATE TABLE IF NOT EXISTS post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT -- Hashed IP for privacy
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at);

-- Attachment downloads tracking
CREATE TABLE IF NOT EXISTS attachment_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_attachment_downloads_attachment_id ON attachment_downloads(attachment_id);
CREATE INDEX IF NOT EXISTS idx_attachment_downloads_downloaded_at ON attachment_downloads(downloaded_at);

-- Enable RLS
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachment_downloads ENABLE ROW LEVEL SECURITY;

-- Allow public insert for tracking
CREATE POLICY "Allow public insert on post_views" ON post_views
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public insert on attachment_downloads" ON attachment_downloads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated select for analytics
CREATE POLICY "Allow authenticated select on post_views" ON post_views
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated select on attachment_downloads" ON attachment_downloads
    FOR SELECT TO authenticated
    USING (true);

-- Function to get post view counts
CREATE OR REPLACE FUNCTION get_post_view_stats(days_back INT DEFAULT 30)
RETURNS TABLE (
    post_id UUID,
    title TEXT,
    view_count BIGINT,
    unique_views BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as post_id,
        p.title,
        COUNT(pv.id) as view_count,
        COUNT(DISTINCT pv.ip_hash) as unique_views
    FROM posts p
    LEFT JOIN post_views pv ON p.id = pv.post_id 
        AND pv.viewed_at >= NOW() - (days_back || ' days')::INTERVAL
    GROUP BY p.id, p.title
    ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily view stats
CREATE OR REPLACE FUNCTION get_daily_view_stats(days_back INT DEFAULT 7)
RETURNS TABLE (
    view_date DATE,
    view_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(viewed_at) as view_date,
        COUNT(*) as view_count
    FROM post_views
    WHERE viewed_at >= NOW() - (days_back || ' days')::INTERVAL
    GROUP BY DATE(viewed_at)
    ORDER BY view_date DESC;
END;
$$ LANGUAGE plpgsql;
