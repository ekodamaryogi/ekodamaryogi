-- Supabase Schema for Portfolio

-- 1. Create tables
CREATE TABLE public.skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  level text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  "desc" text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  "desc" text NOT NULL,
  link text NOT NULL,
  links jsonb DEFAULT '[]'::jsonb,
  project_date text,
  category text,
  tools text,
  role text,
  project_type text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  issuer text NOT NULL,
  year text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Allow anonymous read/write access (Since this is a simple portfolio without a real auth backend, we use RLS policies to allow anon)
-- IMPORTANT: In a real production app with sensitive data, you would lock this down to authenticated users only.

-- Skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.skills FOR DELETE TO authenticated USING (true);

-- Experience
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.experience FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.experience FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.experience FOR DELETE TO authenticated USING (true);

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.projects FOR DELETE TO authenticated USING (true);

-- Certifications
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.certifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.certifications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.certifications FOR DELETE TO authenticated USING (true);

-- CV Settings
CREATE TABLE public.cv_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cv_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.cv_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.cv_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.cv_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.cv_settings FOR DELETE TO authenticated USING (true);

-- 3. Set up Storage Bucket for portfolio-images
-- Go to Storage in Supabase and create a public bucket named 'portfolio-images'
-- Then run these policies:

INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio-images' );

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id = 'portfolio-images' );

CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE TO authenticated
USING ( bucket_id = 'portfolio-images' );

CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE TO authenticated
USING ( bucket_id = 'portfolio-images' );
