-- Portal Informasi Kedinasan Wilcambidik Bruno
-- Schools Data Feature Migration

-- School levels table
CREATE TABLE IF NOT EXISTS school_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '🏫',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID REFERENCES school_levels(id) ON DELETE SET NULL,
  nama TEXT NOT NULL,
  npsn TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Negeri' CHECK (status IN ('Negeri', 'Swasta')),
  peserta_didik INTEGER DEFAULT 0,
  guru INTEGER DEFAULT 0,
  alamat TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apply updated_at trigger to schools table
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schools_level_id ON schools(level_id);
CREATE INDEX IF NOT EXISTS idx_schools_npsn ON schools(npsn);

-- Row Level Security (RLS)
ALTER TABLE school_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Public read access for school levels
CREATE POLICY "School levels are viewable by everyone"
  ON school_levels FOR SELECT
  USING (true);

-- Admin can manage school levels
CREATE POLICY "Admins can manage school levels"
  ON school_levels FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for schools
CREATE POLICY "Schools are viewable by everyone"
  ON schools FOR SELECT
  USING (true);

-- Admin can manage schools
CREATE POLICY "Admins can manage schools"
  ON schools FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default school levels
INSERT INTO school_levels (name, icon, sort_order) VALUES
  ('Sekolah Dasar (SD)', '🎒', 1),
  ('Sekolah Menengah Pertama (SMP)', '📚', 2),
  ('Sekolah Menengah Atas (SMA)', '🎓', 3),
  ('Sekolah Menengah Kejuruan (SMK)', '🔧', 4)
ON CONFLICT (name) DO NOTHING;
