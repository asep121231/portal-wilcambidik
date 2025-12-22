-- Portal Informasi Kedinasan Wilcambidik Bruno
-- Documents Feature Migration

-- Document Categories table
CREATE TABLE IF NOT EXISTS document_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📄',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES document_categories(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apply updated_at trigger to documents table
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public read access for document categories
CREATE POLICY "Document categories are viewable by everyone"
  ON document_categories FOR SELECT
  USING (true);

-- Admin can manage document categories
CREATE POLICY "Admins can manage document categories"
  ON document_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for published documents
CREATE POLICY "Published documents are viewable by everyone"
  ON documents FOR SELECT
  USING (status = 'published');

-- Admin can view all documents
CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can manage documents
CREATE POLICY "Admins can manage documents"
  ON documents FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default document categories
INSERT INTO document_categories (name, icon) VALUES
  ('Template Surat Dinas', '📋'),
  ('Format Laporan', '📊'),
  ('Peraturan & Kebijakan', '📜'),
  ('Panduan Administrasi', '📖')
ON CONFLICT (name) DO NOTHING;
