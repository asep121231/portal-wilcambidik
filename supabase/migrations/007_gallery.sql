-- Portal Informasi Kedinasan Wilcambidik Bruno
-- Gallery/Kegiatan Feature Migration

-- Activity categories table
CREATE TABLE IF NOT EXISTS activity_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📷',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES activity_categories(id) ON DELETE SET NULL,
  activity_date DATE DEFAULT CURRENT_DATE,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity photos table (multiple photos per activity)
CREATE TABLE IF NOT EXISTS activity_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apply updated_at trigger to activities table
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_category_id ON activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_photos_activity_id ON activity_photos(activity_id);

-- Row Level Security (RLS)
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_photos ENABLE ROW LEVEL SECURITY;

-- Public read access for activity categories
CREATE POLICY "Activity categories are viewable by everyone"
  ON activity_categories FOR SELECT
  USING (true);

-- Admin can manage activity categories
CREATE POLICY "Admins can manage activity categories"
  ON activity_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for published activities
CREATE POLICY "Published activities are viewable by everyone"
  ON activities FOR SELECT
  USING (status = 'published');

-- Admin can view all activities
CREATE POLICY "Admins can view all activities"
  ON activities FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can manage activities
CREATE POLICY "Admins can manage activities"
  ON activities FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for photos of published activities
CREATE POLICY "Photos of published activities are viewable by everyone"
  ON activity_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = activity_photos.activity_id 
      AND activities.status = 'published'
    )
  );

-- Admin can manage activity photos
CREATE POLICY "Admins can manage activity photos"
  ON activity_photos FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default activity categories
INSERT INTO activity_categories (name, icon) VALUES
  ('Rapat', '🤝'),
  ('Pelatihan', '📚'),
  ('Kunjungan', '🚗'),
  ('Lomba', '🏆'),
  ('Upacara', '🎖️'),
  ('Sosialisasi', '📢'),
  ('Lainnya', '📷')
ON CONFLICT (name) DO NOTHING;
