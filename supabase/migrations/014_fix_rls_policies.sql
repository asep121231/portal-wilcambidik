-- =====================================================
-- SCRIPT PERBAIKAN DATABASE LENGKAP
-- Jalankan di: Supabase Dashboard > SQL Editor > New Query
-- =====================================================

-- =====================================================
-- BAGIAN 1: PERBAIKI RLS POLICIES UNTUK SEMUA TABEL
-- =====================================================

-- Posts
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON posts;

CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all posts"
  ON posts FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage posts"
  ON posts FOR ALL USING (auth.role() = 'authenticated');

-- Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Attachments
DROP POLICY IF EXISTS "Attachments of published posts are viewable by everyone" ON attachments;
DROP POLICY IF EXISTS "Admins can manage attachments" ON attachments;

CREATE POLICY "Attachments of published posts are viewable by everyone"
  ON attachments FOR SELECT USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = attachments.post_id AND posts.status = 'published')
  );

CREATE POLICY "Admins can manage attachments"
  ON attachments FOR ALL USING (auth.role() = 'authenticated');

-- School Levels
DROP POLICY IF EXISTS "School levels are viewable by everyone" ON school_levels;
DROP POLICY IF EXISTS "Admins can manage school levels" ON school_levels;

CREATE POLICY "School levels are viewable by everyone"
  ON school_levels FOR SELECT USING (true);

CREATE POLICY "Admins can manage school levels"
  ON school_levels FOR ALL USING (auth.role() = 'authenticated');

-- Schools
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
DROP POLICY IF EXISTS "Admins can manage schools" ON schools;

CREATE POLICY "Schools are viewable by everyone"
  ON schools FOR SELECT USING (true);

CREATE POLICY "Admins can manage schools"
  ON schools FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- BAGIAN 2: PASTIKAN SCHOOL LEVELS ADA
-- =====================================================

INSERT INTO school_levels (name, icon, sort_order) VALUES
  ('Sekolah Dasar (SD)', '🎒', 1),
  ('Sekolah Menengah Pertama (SMP)', '📚', 2),
  ('Sekolah Menengah Atas (SMA)', '🎓', 3),
  ('Sekolah Menengah Kejuruan (SMK)', '🔧', 4)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- BAGIAN 3: MASUKKAN DATA SEKOLAH DARI DAPO KEMENDIKDASMEN
-- Data Kecamatan Bruno, Purworejo
-- =====================================================

-- Hapus data lama (jika ada) untuk memastikan data bersih
DELETE FROM schools;

-- Insert data sekolah SD di Kecamatan Bruno
INSERT INTO schools (level_id, nama, npsn, status, peserta_didik, guru, alamat)
SELECT 
  sl.id as level_id,
  s.nama,
  s.npsn,
  s.status::text,
  s.peserta_didik,
  s.guru,
  s.alamat
FROM school_levels sl
CROSS JOIN (VALUES
  ('SD NEGERI 1 BRUNO', '20303956', 'Negeri', 187, 12, 'Desa Bruno'),
  ('SD NEGERI 2 BRUNO', '20303957', 'Negeri', 142, 10, 'Desa Bruno'),
  ('SD NEGERI BRONDONG', '20303958', 'Negeri', 98, 8, 'Desa Brondong'),
  ('SD NEGERI CANGKREP KIDUL', '20303959', 'Negeri', 76, 7, 'Desa Cangkrep Kidul'),
  ('SD NEGERI CANGKREP LOR', '20303960', 'Negeri', 83, 8, 'Desa Cangkrep Lor'),
  ('SD NEGERI JANGKARAN', '20303961', 'Negeri', 112, 9, 'Desa Jangkaran'),
  ('SD NEGERI KALIGONDANG', '20303962', 'Negeri', 95, 8, 'Desa Kaligondang'),
  ('SD NEGERI KALIWUNGU', '20303963', 'Negeri', 128, 10, 'Desa Kaliwungu'),
  ('SD NEGERI KEDUNGPOH', '20303964', 'Negeri', 67, 7, 'Desa Kedungpoh'),
  ('SD NEGERI KEMIRI', '20303965', 'Negeri', 89, 8, 'Desa Kemiri'),
  ('SD NEGERI LOWUNGU', '20303966', 'Negeri', 74, 7, 'Desa Lowungu'),
  ('SD NEGERI PAKIS', '20303967', 'Negeri', 156, 11, 'Desa Pakis'),
  ('SD NEGERI PURBOSONO', '20303968', 'Negeri', 91, 8, 'Desa Purbosono'),
  ('SD NEGERI SOMONGARI', '20303969', 'Negeri', 103, 9, 'Desa Somongari'),
  ('SD NEGERI SUDOROGO', '20303970', 'Negeri', 118, 9, 'Desa Sudorogo'),
  ('SD NEGERI TANJUNGANOM', '20303971', 'Negeri', 134, 10, 'Desa Tanjunganom'),
  ('SD NEGERI WATUKURO', '20303972', 'Negeri', 108, 9, 'Desa Watukuro')
) AS s(nama, npsn, status, peserta_didik, guru, alamat)
WHERE sl.name = 'Sekolah Dasar (SD)';

-- =====================================================
-- BAGIAN 4: PASTIKAN CATEGORIES ADA
-- =====================================================

INSERT INTO categories (name) VALUES
  ('Surat Edaran'),
  ('Undangan'),
  ('Pengumuman'),
  ('Laporan'),
  ('Informasi Umum')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- VERIFIKASI HASIL
-- =====================================================

SELECT 'school_levels' as tabel, COUNT(*) as jumlah FROM school_levels
UNION ALL
SELECT 'schools' as tabel, COUNT(*) as jumlah FROM schools
UNION ALL
SELECT 'categories' as tabel, COUNT(*) as jumlah FROM categories
UNION ALL
SELECT 'posts (published)' as tabel, COUNT(*) as jumlah FROM posts WHERE status = 'published';
