-- Portal Informasi Kedinasan Wilcambidik Bruno
-- Migration: Expand urgency field to status_label with more options

-- First, drop the existing constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_urgency_check;

-- Update column to support new values (keeping backward compatibility)
-- 'urgent' -> 'urgent' (unchanged)
-- 'normal' -> 'general' (updated)
UPDATE posts SET urgency = 'general' WHERE urgency = 'normal';

-- Add new constraint with expanded options
ALTER TABLE posts ADD CONSTRAINT posts_urgency_check 
  CHECK (urgency IN ('urgent', 'deadline', 'general', 'archive'));

-- Set default to 'general'
ALTER TABLE posts ALTER COLUMN urgency SET DEFAULT 'general';

-- Update the search_posts function to handle new statuses
DROP FUNCTION IF EXISTS search_posts;

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
  IF sort_order = 'asc' THEN
    RETURN QUERY
    SELECT DISTINCT 
      p.id, p.title, p.content, p.category_id, p.status, p.urgency,
      p.created_at, p.updated_at, c.name as category_name,
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
    ORDER BY 
      CASE p.urgency 
        WHEN 'urgent' THEN 1 
        WHEN 'deadline' THEN 2 
        WHEN 'general' THEN 3 
        WHEN 'archive' THEN 4 
      END,
      p.created_at ASC
    LIMIT page_limit OFFSET page_offset;
  ELSE
    RETURN QUERY
    SELECT DISTINCT 
      p.id, p.title, p.content, p.category_id, p.status, p.urgency,
      p.created_at, p.updated_at, c.name as category_name,
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
    ORDER BY 
      CASE p.urgency 
        WHEN 'urgent' THEN 1 
        WHEN 'deadline' THEN 2 
        WHEN 'general' THEN 3 
        WHEN 'archive' THEN 4 
      END,
      p.created_at DESC
    LIMIT page_limit OFFSET page_offset;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION search_posts TO anon;
GRANT EXECUTE ON FUNCTION search_posts TO authenticated;
