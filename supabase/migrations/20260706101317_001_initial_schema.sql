/*
# LexMatch AI Initial Schema

This migration creates the foundational tables for the LexMatch AI legal platform.

## Tables Created:

1. **profiles** - User profiles extending Supabase auth
   - id (uuid, PK, references auth.users)
   - full_name (text)
   - phone (text)
   - city (text)
   - state (text)
   - avatar_url (text)
   - role (text: 'user', 'lawyer', 'admin')
   - created_at, updated_at (timestamps)

2. **lawyers** - Lawyer professional information
   - id (uuid, PK)
   - profile_id (uuid, FK to profiles)
   - bar_registration_number (text, unique)
   - specialization (text[])
   - years_experience (integer)
   - courts_served (text[])
   - languages_spoken (text[])
   - biography (text)
   - education (text[])
   - certification_urls (text[])
   - office_address (text)
   - consultation_fee (decimal)
   - average_case_fee_min (decimal)
   - average_case_fee_max (decimal)
   - success_rate (decimal)
   - is_verified (boolean)
   - verification_status (text: 'pending', 'verified', 'rejected')
   - availability (jsonb)
   - created_at, updated_at

3. **cases** - Legal case submissions
   - id (uuid, PK)
   - user_id (uuid, FK to profiles)
   - title (text)
   - description (text)
   - case_type (text)
   - court_type (text)
   - state (text)
   - city (text)
   - hearing_location (text)
   - budget_min (decimal)
   - budget_max (decimal)
   - budget_type (text)
   - preferences (jsonb)
   - document_urls (text[])
   - ai_analysis (jsonb)
   - status (text)
   - created_at, updated_at

4. **case_lawyer_recommendations** - AI recommendations for cases
   - id (uuid, PK)
   - case_id (uuid, FK to cases)
   - lawyer_id (uuid, FK to lawyers)
   - recommendation_score (decimal)
   - recommendation_reason (text)
   - estimated_fee (decimal)
   - created_at

5. **consultations** - Booked consultations
   - id (uuid, PK)
   - case_id (uuid, FK to cases)
   - user_id (uuid, FK to profiles)
   - lawyer_id (uuid, FK to lawyers)
   - scheduled_at (timestamp)
   - consultation_type (text: 'in-person', 'video', 'chat')
   - status (text: 'pending', 'confirmed', 'completed', 'cancelled')
   - notes (text)
   - meeting_url (text)
   - created_at, updated_at

6. **reviews** - Lawyer reviews
   - id (uuid, PK)
   - lawyer_id (uuid, FK to lawyers)
   - user_id (uuid, FK to profiles)
   - consultation_id (uuid, FK to consultations)
   - rating (integer, 1-5)
   - review_text (text)
   - created_at

7. **saved_lawyers** - User's saved lawyers
   - id (uuid, PK)
   - user_id (uuid, FK to profiles)
   - lawyer_id (uuid, FK to lawyers)
   - created_at

8. **messages** - Chat messages
   - id (uuid, PK)
   - consultation_id (uuid, FK to consultations)
   - sender_id (uuid, FK to profiles)
   - content (text)
   - read_at (timestamp)
   - created_at

9. **notifications** - User notifications
   - id (uuid, PK)
   - user_id (uuid, FK to profiles)
   - title (text)
   - message (text)
   - type (text)
   - read (boolean)
   - created_at

## Security:
- RLS enabled on all tables
- Owner-scoped policies for user data
- Public read access for verified lawyers
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  city text,
  state text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Lawyers table
CREATE TABLE IF NOT EXISTS lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bar_registration_number text UNIQUE,
  specialization text[] NOT NULL DEFAULT '{}',
  years_experience integer NOT NULL DEFAULT 0,
  courts_served text[] NOT NULL DEFAULT '{}',
  languages_spoken text[] NOT NULL DEFAULT '{}',
  biography text,
  education text[] NOT NULL DEFAULT '{}',
  certification_urls text[] NOT NULL DEFAULT '{}',
  office_address text,
  consultation_fee decimal DEFAULT 0,
  average_case_fee_min decimal DEFAULT 0,
  average_case_fee_max decimal DEFAULT 0,
  success_rate decimal DEFAULT 0,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  availability jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Lawyers can read all verified lawyers (for search)
DROP POLICY IF EXISTS "lawyers_public_read" ON lawyers;
CREATE POLICY "lawyers_public_read" ON lawyers FOR SELECT
  TO authenticated USING (true);

-- Lawyers can update their own profile
DROP POLICY IF EXISTS "lawyers_update_own" ON lawyers;
CREATE POLICY "lawyers_update_own" ON lawyers FOR UPDATE
  TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Lawyers can insert their own profile
DROP POLICY IF EXISTS "lawyers_insert_own" ON lawyers;
CREATE POLICY "lawyers_insert_own" ON lawyers FOR INSERT
  TO authenticated WITH CHECK (profile_id = auth.uid());

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  case_type text NOT NULL,
  court_type text,
  state text,
  city text,
  hearing_location text,
  budget_min decimal DEFAULT 0,
  budget_max decimal DEFAULT 0,
  budget_type text DEFAULT 'negotiable',
  preferences jsonb DEFAULT '{}',
  document_urls text[] DEFAULT '{}',
  ai_analysis jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'reviewed', 'in_progress', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cases_read_own" ON cases;
CREATE POLICY "cases_read_own" ON cases FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "cases_insert_own" ON cases;
CREATE POLICY "cases_insert_own" ON cases FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cases_update_own" ON cases;
CREATE POLICY "cases_update_own" ON cases FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cases_delete_own" ON cases;
CREATE POLICY "cases_delete_own" ON cases FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Case Lawyer Recommendations
CREATE TABLE IF NOT EXISTS case_lawyer_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  recommendation_score decimal DEFAULT 0,
  recommendation_reason text,
  estimated_fee decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(case_id, lawyer_id)
);

ALTER TABLE case_lawyer_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recommendations_read_own" ON case_lawyer_recommendations;
CREATE POLICY "recommendations_read_own" ON case_lawyer_recommendations FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_lawyer_recommendations.case_id AND cases.user_id = auth.uid()));

DROP POLICY IF EXISTS "recommendations_insert_own" ON case_lawyer_recommendations;
CREATE POLICY "recommendations_insert_own" ON case_lawyer_recommendations FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_lawyer_recommendations.case_id AND cases.user_id = auth.uid()));

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE SET NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  scheduled_at timestamptz,
  consultation_type text DEFAULT 'video' CHECK (consultation_type IN ('in-person', 'video', 'chat')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
  notes text,
  meeting_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consultations_read_own" ON consultations;
CREATE POLICY "consultations_read_own" ON consultations FOR SELECT
  TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM lawyers WHERE lawyers.profile_id = auth.uid() AND lawyers.id = consultations.lawyer_id));

DROP POLICY IF EXISTS "consultations_insert_own" ON consultations;
CREATE POLICY "consultations_insert_own" ON consultations FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "consultations_update_own" ON consultations;
CREATE POLICY "consultations_update_own" ON consultations FOR UPDATE
  TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM lawyers WHERE lawyers.profile_id = auth.uid() AND lawyers.id = consultations.lawyer_id)) WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM lawyers WHERE lawyers.profile_id = auth.uid() AND lawyers.id = consultations.lawyer_id));

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, consultation_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_read_all" ON reviews;
CREATE POLICY "reviews_read_all" ON reviews FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Saved Lawyers table
CREATE TABLE IF NOT EXISTS saved_lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lawyer_id)
);

ALTER TABLE saved_lawyers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_lawyers_read_own" ON saved_lawyers;
CREATE POLICY "saved_lawyers_read_own" ON saved_lawyers FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_lawyers_insert_own" ON saved_lawyers;
CREATE POLICY "saved_lawyers_insert_own" ON saved_lawyers FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_lawyers_delete_own" ON saved_lawyers;
CREATE POLICY "saved_lawyers_delete_own" ON saved_lawyers FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_read_own" ON messages;
CREATE POLICY "messages_read_own" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM consultations WHERE consultations.id = messages.consultation_id AND (consultations.user_id = auth.uid() OR EXISTS (SELECT 1 FROM lawyers WHERE lawyers.profile_id = auth.uid() AND lawyers.id = consultations.lawyer_id)))
  );

DROP POLICY IF EXISTS "messages_insert_own" ON messages;
CREATE POLICY "messages_insert_own" ON messages FOR INSERT
  TO authenticated WITH CHECK (sender_id = auth.uid());

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_read_own" ON notifications;
CREATE POLICY "notifications_read_own" ON notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_lawyers_specialization ON lawyers USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyers_verified ON lawyers(is_verified);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_reviews_lawyer_id ON reviews(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_saved_lawyers_user_id ON saved_lawyers(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_consultation_id ON messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();