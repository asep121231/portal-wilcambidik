-- Portal Informasi Kedinasan Wilcambidik Bruno
-- Migration: Add Search Features

-- Add urgency field to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'normal' 
  CHECK (urgency IN ('urgent', 'normal'));

-- Create index on urgency
CREATE INDEX IF NOT EXISTS idx_posts_urgency ON posts(urgency);

-- Create search function for advanced filtering
CREATE OR REPLACE FUNCTION search_posts(
  keyword TEXT DEFAULT NULL,
  cat_id UUID DEFAULT NULL,
  start_date TIMESTAMPTZ DEFAULT NULL,
  end_date TIMESTAMPTZ DEFAULT NULL,
  urgency_filter TEXT DEFAULT NULL,
  file_types TEXT[] DEFAULT NULL,
  sort_order TEXT DEFAULT 'desc',
  page_limit INT DEFAULT 20,
  page_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category_id UUID,
  status TEXT,
  urgency TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category_name TEXT,
  attachment_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    p.id,
    p.title,
    p.content,
    p.category_id,
    p.status,
    p.urgency,
    p.created_at,
    p.updated_at,
    c.name as category_name,
    (SELECT COUNT(*) FROM attachments att WHERE att.post_id = p.id) as attachment_count
  FROM posts p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN attachments a ON a.post_id = p.id
  WHERE p.status = 'published'
    AND (keyword IS NULL OR keyword = '' OR 
         p.title ILIKE '%' || keyword || '%' OR 
         p.content ILIKE '%' || keyword || '%' OR
         a.file_name ILIKE '%' || keyword || '%')
    AND (cat_id IS NULL OR p.category_id = cat_id)
    AND (start_date IS NULL OR p.created_at >= start_date)
    AND (end_date IS NULL OR p.created_at <= end_date + INTERVAL '1 day')
    AND (urgency_filter IS NULL OR urgency_filter = '' OR p.urgency = urgency_filter)
    AND (file_types IS NULL OR array_length(file_types, 1) IS NULL OR EXISTS (
      SELECT 1 FROM attachments att WHERE att.post_id = p.id
      AND (
        att.file_name ILIKE '%.pdf' AND 'pdf' = ANY(file_types) OR
        att.file_name ILIKE '%.doc' AND 'doc' = ANY(file_types) OR
        att.file_name ILIKE '%.docx' AND 'docx' = ANY(file_types) OR
        att.file_name ILIKE '%.xls' AND 'xls' = ANY(file_types) OR
        att.file_name ILIKE '%.xlsx' AND 'xlsx' = ANY(file_types) OR
        att.file_name ILIKE '%.jpg' AND 'jpg' = ANY(file_types) OR
        att.file_name ILIKE '%.jpeg' AND 'jpeg' = ANY(file_types) OR
        att.file_name ILIKE '%.png' AND 'png' = ANY(file_types)
      )
    ))
  ORDER BY 
    CASE WHEN sort_order = 'asc' THEN p.created_at END ASC,
    CASE WHEN sort_order = 'desc' THEN p.created_at END DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION search_posts TO anon;
GRANT EXECUTE ON FUNCTION search_posts TO authenticated;
