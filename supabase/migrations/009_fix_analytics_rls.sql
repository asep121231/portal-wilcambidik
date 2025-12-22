-- Recreate post_views table with proper permissions
-- Run this in Supabase SQL Editor

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public insert on post_views" ON post_views;
DROP POLICY IF EXISTS "Allow authenticated select on post_views" ON post_views;
DROP POLICY IF EXISTS "Allow anon read post_views" ON post_views;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at);

-- Enable RLS
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Allow ALL users (anon + authenticated) to INSERT views
CREATE POLICY "Anyone can insert views" ON post_views
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to SELECT views (for admin dashboard)
CREATE POLICY "Authenticated can select views" ON post_views
    FOR SELECT TO authenticated
    USING (true);

-- Also allow anon to select (optional, for public stats)
CREATE POLICY "Anon can select views" ON post_views
    FOR SELECT TO anon
    USING (true);
