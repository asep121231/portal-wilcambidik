-- Create secure RPC function to increment download count
-- This uses SECURITY DEFINER to bypass RLS

-- Drop existing function if any
DROP FUNCTION IF EXISTS increment_download_count(UUID);

-- Create the function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION increment_download_count(doc_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE documents 
    SET download_count = COALESCE(download_count, 0) + 1
    WHERE id = doc_id;
END;
$$;

-- Grant execute permission to public (anonymous users)
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO authenticated;
