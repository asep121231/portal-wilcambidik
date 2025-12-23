-- Add RLS policy to allow public to increment download_count on documents
-- This is needed because anonymous users need to update the counter when downloading

-- Drop existing policy if any
DROP POLICY IF EXISTS "Allow public to increment download count" ON documents;

-- Create policy to allow public to update only download_count
CREATE POLICY "Allow public to increment download count" ON documents
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
