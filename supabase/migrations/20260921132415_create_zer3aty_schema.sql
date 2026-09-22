/*
# Zer3aty Platform Schema

## Overview
Complete schema for the Zer3aty natural farming platform including:
- User profiles (extends Supabase auth)
- Plant catalog with categories
- Product store with categories
- Articles and educational content
- Courses and lessons (academy)
- Orders and order items
- User wishlist
- Course progress tracking

## Tables
1. profiles - User profile data (extends auth.users)
2. plant_categories - Categories for plants (vegetable, herb, fruit, etc.)
3. plants - Plant catalog with growing information
4. product_categories - Store categories (seeds, tools, soil, etc.)
5. products - Store products with pricing and stock
6. articles - Educational articles
7. courses - Academy courses
8. lessons - Lessons within courses
9. orders - User orders
10. order_items - Items within orders
11. wishlist - User saved products
12. course_progress - User progress through courses

## Security
- Public content (plants, products, articles, courses, lessons, categories): readable by anon + authenticated
- User-specific data (orders, order_items, wishlist, course_progress, profiles): owner-scoped to authenticated users
- All writes to public content restricted to authenticated users (admin management)
*/

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  city text,
  country text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================
-- PLANT CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS plant_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plant_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_plant_categories" ON plant_categories;
CREATE POLICY "read_plant_categories" ON plant_categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================
-- PLANTS
-- ============================================
CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  category_id uuid REFERENCES plant_categories(id) ON DELETE SET NULL,
  description_en text,
  description_ar text,
  difficulty text NOT NULL DEFAULT 'beginner',
  sunlight_en text,
  sunlight_ar text,
  water_en text,
  water_ar text,
  soil_en text,
  soil_ar text,
  growing_period_en text,
  growing_period_ar text,
  suitable_location_en text,
  suitable_location_ar text,
  planting_season_en text,
  planting_season_ar text,
  care_instructions_en text,
  care_instructions_ar text,
  harvest_info_en text,
  harvest_info_ar text,
  image_url text,
  is_indoor boolean DEFAULT false,
  is_outdoor boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_plants" ON plants;
CREATE POLICY "read_plants" ON plants FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_plants_category ON plants(category_id);
CREATE INDEX IF NOT EXISTS idx_plants_slug ON plants(slug);

-- ============================================
-- PRODUCT CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_product_categories" ON product_categories;
CREATE POLICY "read_product_categories" ON product_categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  description_en text,
  description_ar text,
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  old_price numeric(10,2),
  stock integer NOT NULL DEFAULT 0,
  rating numeric(2,1) DEFAULT 5.0,
  sku text UNIQUE NOT NULL,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_products" ON products;
CREATE POLICY "read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============================================
-- ARTICLES
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  excerpt_en text,
  excerpt_ar text,
  content_en text,
  content_ar text,
  category_en text,
  category_ar text,
  author text NOT NULL DEFAULT 'Zer3aty Team',
  image_url text,
  reading_time_min integer DEFAULT 5,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_articles" ON articles;
CREATE POLICY "read_articles" ON articles FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text,
  description_ar text,
  difficulty text NOT NULL DEFAULT 'beginner',
  duration_en text,
  duration_ar text,
  lessons_count integer DEFAULT 0,
  image_url text,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_courses" ON courses;
CREATE POLICY "read_courses" ON courses FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- ============================================
-- LESSONS
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  content_en text,
  content_ar text,
  duration_min integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_lessons" ON lessons;
CREATE POLICY "read_lessons" ON lessons FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  country text,
  notes text,
  payment_method text NOT NULL DEFAULT 'cod',
  status text NOT NULL DEFAULT 'pending',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  shipping numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name_en text,
  product_name_ar text,
  product_image text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================
-- WISHLIST
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlist;
CREATE POLICY "select_own_wishlist" ON wishlist FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlist;
CREATE POLICY "insert_own_wishlist" ON wishlist FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlist;
CREATE POLICY "delete_own_wishlist" ON wishlist FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);

-- ============================================
-- COURSE PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON course_progress;
CREATE POLICY "select_own_progress" ON course_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON course_progress;
CREATE POLICY "insert_own_progress" ON course_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON course_progress;
CREATE POLICY "update_own_progress" ON course_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_progress_user_course ON course_progress(user_id, course_id);