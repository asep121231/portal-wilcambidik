-- Portal Informasi Kedinasan Wilcambidik Bruno
-- Database Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to posts table
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attachments_post_id ON attachments(post_id);

-- Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Admin can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for published posts
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (status = 'published');

-- Admin can view all posts (including drafts)
CREATE POLICY "Admins can view all posts"
  ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can manage posts
CREATE POLICY "Admins can manage posts"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for attachments of published posts
CREATE POLICY "Attachments of published posts are viewable by everyone"
  ON attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = attachments.post_id 
      AND posts.status = 'published'
    )
  );

-- Admin can manage attachments
CREATE POLICY "Admins can manage attachments"
  ON attachments FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Surat Edaran'),
  ('Undangan'),
  ('Pengumuman'),
  ('Laporan'),
  ('Informasi Umum')
ON CONFLICT (name) DO NOTHING;

-- Storage bucket setup (run this separately in Supabase Dashboard > Storage)
-- 1. Create a new bucket called "attachments"
-- 2. Set it as public bucket
-- 3. Add the following policies:

-- Policy: Allow public to read files
-- Operation: SELECT
-- Policy: true

-- Policy: Allow authenticated users to upload files
-- Operation: INSERT
-- Policy: auth.role() = 'authenticated'

-- Policy: Allow authenticated users to delete files
-- Operation: DELETE
-- Policy: auth.role() = 'authenticated'
