/*
# Regulars Coffee Bar — Core Schema (menu, gallery, reviews, contact info)

1. New Tables
- `menu_items` — café menu: name, description, price, image_url, category, availability, sort order, favorite flag.
- `gallery_images` — gallery photos: image_url, alt text, grid size variant, sort order.
- `reviews` — customer testimonials: quote text, source label, featured flag, sort order.
- `contact_info` — single-row editable business info: address, instagram, hours, map query, phone (nullable).

2. Security
- RLS enabled on all tables.
- SELECT granted to `anon, authenticated` (public-facing website reads its own data).
- INSERT/UPDATE/DELETE granted to `authenticated` only (admin operations).
- SELECT policies use `USING (true)` because the content is intentionally public/shared.
- Write policies scope to `authenticated` (admin signs in to manage content).

3. Notes
- No user_id columns: content is shared business data, not per-user.
- Admin auth handled via Supabase email/password (built in the admin dashboard).
- `contact_info` is a singleton — convention enforced by a unique index on id (fixed value).
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price text,
  image_url text,
  category text NOT NULL DEFAULT 'coffee',
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON menu_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON menu_items TO authenticated;

DROP POLICY IF EXISTS "public_read_menu" ON menu_items;
CREATE POLICY "public_read_menu" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_menu" ON menu_items;
CREATE POLICY "auth_insert_menu" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_menu" ON menu_items;
CREATE POLICY "auth_update_menu" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_menu" ON menu_items;
CREATE POLICY "auth_delete_menu" ON menu_items FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON menu_items(sort_order);

-- ---- Gallery ----
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text,
  size text NOT NULL DEFAULT 'standard',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON gallery_images TO authenticated;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery_images;
CREATE POLICY "public_read_gallery" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery_images;
CREATE POLICY "auth_insert_gallery" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery_images;
CREATE POLICY "auth_update_gallery" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery_images;
CREATE POLICY "auth_delete_gallery" ON gallery_images FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery_images(sort_order);

-- ---- Reviews ----
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  source text NOT NULL DEFAULT 'Google Review',
  is_featured boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON reviews TO authenticated;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

-- ---- Contact Info (singleton) ----
CREATE TABLE IF NOT EXISTS contact_info (
  id integer PRIMARY KEY DEFAULT 1,
  address_line1 text NOT NULL DEFAULT 'Regulars Coffee Bar',
  address_line2 text NOT NULL DEFAULT 'HRBR Layout, Kalyan Nagar,',
  address_line3 text NOT NULL DEFAULT 'Bengaluru, Karnataka, India.',
  instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/regularscoffeebar/',
  google_maps_query text NOT NULL DEFAULT 'HRBR Layout Kalyan Nagar Bengaluru Karnataka',
  hours_line1 text NOT NULL DEFAULT 'Hours to be confirmed by the owner.',
  hours_line2 text DEFAULT '',
  phone text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT contact_info_single CHECK (id = 1)
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON contact_info TO anon, authenticated;
GRANT UPDATE ON contact_info TO authenticated;

DROP POLICY IF EXISTS "public_read_contact" ON contact_info;
CREATE POLICY "public_read_contact" ON contact_info FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact" ON contact_info;
CREATE POLICY "auth_update_contact" ON contact_info FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
