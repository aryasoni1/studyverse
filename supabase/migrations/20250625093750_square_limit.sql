/*
  # SkillForge Database Schema

  This schema defines all tables, relationships, and security policies for the SkillForge learning platform.
  
  ## Features Covered:
  1. User Profiles & Authentication
  2. Dashboard & Statistics
  3. Tasks & Productivity
  4. Notes & Notebooks
  5. Learning Roadmaps
  6. Study Rooms & Collaboration
  7. Community & Social Features
  8. AI Assistant & Chat
  9. Notifications & Achievements
  10. SEO & Analytics
  11. Billing & Subscriptions

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure users can only access their own data
  - Public data accessible where appropriate
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE roadmap_status AS ENUM ('not_started', 'in_progress', 'completed', 'paused');
CREATE TYPE study_room_status AS ENUM ('active', 'paused', 'ended');
CREATE TYPE notification_type AS ENUM ('achievement', 'reminder', 'social', 'system', 'ai_suggestion');
CREATE TYPE achievement_type AS ENUM ('streak', 'skill_mastery', 'community', 'milestone', 'special');
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'enterprise');

-- ============================================================================
-- USER PROFILES & AUTHENTICATION
-- ============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  timezone TEXT DEFAULT 'UTC',
  learning_goals TEXT[],
  skills_interested TEXT[],
  experience_level difficulty_level DEFAULT 'beginner',
  preferred_language TEXT DEFAULT 'en',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User statistics for dashboard
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_hours_studied INTEGER DEFAULT 0,
  skills_mastered INTEGER DEFAULT 0,
  community_rank INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_streak_update DATE DEFAULT CURRENT_DATE,
  total_notes INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  total_roadmaps_completed INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  level_current INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- SKILLS & CATEGORIES
-- ============================================================================

-- Skills catalog
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty difficulty_level NOT NULL,
  estimated_hours INTEGER DEFAULT 0,
  prerequisites UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skill progress
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  mastered_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ============================================================================
-- TASKS & PRODUCTIVITY
-- ============================================================================

-- User tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  status task_status DEFAULT 'pending',
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  roadmap_id UUID, -- Will reference roadmaps table
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  tags TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTES & NOTEBOOKS
-- ============================================================================

-- Notebooks for organizing notes
CREATE TABLE notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notebook_id UUID REFERENCES notebooks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note sharing
CREATE TABLE note_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES profiles(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  can_edit BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEARNING ROADMAPS
-- ============================================================================

-- Learning roadmaps
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status roadmap_status DEFAULT 'not_started',
  difficulty difficulty_level NOT NULL,
  estimated_duration INTEGER, -- in hours
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  template_id UUID REFERENCES roadmaps(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmap skills junction table
CREATE TABLE roadmap_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(roadmap_id, skill_id)
);

-- Mindmap nodes for visual roadmaps
CREATE TABLE mindmap_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  node_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STUDY ROOMS & COLLABORATION
-- ============================================================================

-- Study rooms
CREATE TABLE study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  max_participants INTEGER DEFAULT 10,
  is_public BOOLEAN DEFAULT true,
  password_hash TEXT,
  status study_room_status DEFAULT 'active',
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  room_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study room participants
CREATE TABLE study_room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_moderator BOOLEAN DEFAULT false,
  UNIQUE(room_id, user_id)
);

-- Study room chat messages
CREATE TABLE study_room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, system, emoji
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pomodoro sessions
CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES study_rooms(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL DEFAULT 25, -- in minutes
  break_duration INTEGER DEFAULT 5, -- in minutes
  completed_cycles INTEGER DEFAULT 0,
  target_cycles INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY & SOCIAL FEATURES
-- ============================================================================

-- Community posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion', -- discussion, question, showcase, tip
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes for posts and comments
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- User follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================================
-- AI ASSISTANT & CHAT
-- ============================================================================

-- AI chat history
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  model_used TEXT,
  tokens_used INTEGER DEFAULT 0,
  response_time INTEGER, -- in milliseconds
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty difficulty_level DEFAULT 'beginner',
  last_reviewed TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  success_rate FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS & ACHIEVEMENTS
-- ============================================================================

-- User notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievement definitions
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  type achievement_type NOT NULL,
  icon_url TEXT,
  badge_color TEXT DEFAULT '#6366f1',
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- SEO & ANALYTICS
-- ============================================================================

-- SEO pages for dynamic content
CREATE TABLE seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[],
  content JSONB,
  page_type TEXT NOT NULL, -- skill, roadmap, category, etc.
  reference_id UUID, -- ID of the referenced entity
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BILLING & SUBSCRIPTIONS
-- ============================================================================

-- Subscription plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type plan_type NOT NULL,
  price_monthly INTEGER DEFAULT 0, -- in cents
  price_yearly INTEGER DEFAULT 0, -- in cents
  features TEXT[] DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User billing information
CREATE TABLE billing_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active', -- active, cancelled, past_due, etc.
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Usage tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- ai_queries, storage_mb, etc.
  amount INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_type, period_start)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User stats indexes
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_community_rank ON user_stats(community_rank);

-- Skills indexes
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_difficulty ON skills(difficulty);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

-- Tasks indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Notes indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_notebook_id ON notes(notebook_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);

-- Roadmaps indexes
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmaps_status ON roadmaps(status);
CREATE INDEX idx_roadmap_skills_roadmap_id ON roadmap_skills(roadmap_id);

-- Study rooms indexes
CREATE INDEX idx_study_rooms_host_id ON study_rooms(host_id);
CREATE INDEX idx_study_rooms_status ON study_rooms(status);
CREATE INDEX idx_study_room_participants_room_id ON study_room_participants(room_id);
CREATE INDEX idx_study_room_participants_user_id ON study_room_participants(user_id);

-- Community indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- AI chat indexes
CREATE INDEX idx_ai_chat_history_user_id ON ai_chat_history(user_id);
CREATE INDEX idx_ai_chat_history_session_id ON ai_chat_history(session_id);
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles" ON profiles FOR SELECT USING (is_public = true OR auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User stats policies
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Skills policies (public read)
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (is_active = true);

-- User skills policies
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Notebooks policies
CREATE POLICY "Users can manage own notebooks" ON notebooks FOR ALL USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view own notes and public notes" ON notes FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can manage own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Note shares policies
CREATE POLICY "Users can manage own note shares" ON note_shares FOR ALL USING (auth.uid() = shared_by);
CREATE POLICY "Users can view notes shared with them" ON note_shares FOR SELECT USING (auth.uid() = shared_with);

-- Roadmaps policies
CREATE POLICY "Users can view own roadmaps and public roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can manage own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roadmaps" ON roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roadmaps" ON roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Roadmap skills policies
CREATE POLICY "Users can manage roadmap skills for own roadmaps" ON roadmap_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_skills.roadmap_id AND roadmaps.user_id = auth.uid())
);

-- Mindmap nodes policies
CREATE POLICY "Users can manage mindmap nodes for own roadmaps" ON mindmap_nodes FOR ALL USING (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = mindmap_nodes.roadmap_id AND roadmaps.user_id = auth.uid())
);

-- Study rooms policies
CREATE POLICY "Users can view public study rooms" ON study_rooms FOR SELECT USING (is_public = true OR auth.uid() = host_id);
CREATE POLICY "Users can manage own study rooms" ON study_rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update own study rooms" ON study_rooms FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Users can delete own study rooms" ON study_rooms FOR DELETE USING (auth.uid() = host_id);

-- Study room participants policies
CREATE POLICY "Users can view participants in accessible rooms" ON study_room_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM study_rooms WHERE study_rooms.id = study_room_participants.room_id AND (study_rooms.is_public = true OR study_rooms.host_id = auth.uid()))
);
CREATE POLICY "Users can join study rooms" ON study_room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave study rooms" ON study_room_participants FOR UPDATE USING (auth.uid() = user_id);

-- Study room messages policies
CREATE POLICY "Users can view messages in joined rooms" ON study_room_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM study_room_participants WHERE study_room_participants.room_id = study_room_messages.room_id AND study_room_participants.user_id = auth.uid())
);
CREATE POLICY "Users can send messages in joined rooms" ON study_room_messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM study_room_participants WHERE study_room_participants.room_id = study_room_messages.room_id AND study_room_participants.user_id = auth.uid())
);

-- Pomodoro sessions policies
CREATE POLICY "Users can manage own pomodoro sessions" ON pomodoro_sessions FOR ALL USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can manage own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can manage own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view all follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- AI chat history policies
CREATE POLICY "Users can manage own AI chat history" ON ai_chat_history FOR ALL USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can manage own flashcards" ON flashcards FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (is_active = true);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert user achievements" ON user_achievements FOR INSERT WITH CHECK (true);

-- SEO pages policies (public read)
CREATE POLICY "Anyone can view published SEO pages" ON seo_pages FOR SELECT USING (is_published = true);

-- Analytics events policies
CREATE POLICY "Users can insert own analytics events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Plans policies (public read)
CREATE POLICY "Anyone can view active plans" ON plans FOR SELECT USING (is_active = true);

-- Billing info policies
CREATE POLICY "Users can manage own billing info" ON billing_info FOR ALL USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage tracking" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage usage tracking" ON usage_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update usage tracking" ON usage_tracking FOR UPDATE USING (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON notebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_rooms_updated_at BEFORE UPDATE ON study_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON seo_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_info_updated_at BEFORE UPDATE ON billing_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile and stats on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  
  -- Create default notebook
  INSERT INTO notebooks (user_id, name, description, is_default)
  VALUES (NEW.id, 'My Notes', 'Default notebook for your notes', true);
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for comment count
CREATE TRIGGER update_post_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.comment_id IS NOT NULL THEN
      UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
    ELSIF OLD.comment_id IS NOT NULL THEN
      UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for like counts
CREATE TRIGGER update_like_count_trigger
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default plans
INSERT INTO plans (name, description, type, price_monthly, price_yearly, features, limits) VALUES
('Free', 'Perfect for getting started with learning', 'free', 0, 0, 
 ARRAY['Basic AI assistance', 'Public roadmaps', 'Community access', 'Basic notes'],
 '{"ai_queries_per_month": 50, "storage_mb": 100, "private_roadmaps": 3}'::jsonb),
('Pro', 'Advanced features for serious learners', 'pro', 1999, 19999,
 ARRAY['Unlimited AI assistance', 'Private roadmaps', 'Advanced analytics', 'Priority support', 'Study rooms'],
 '{"ai_queries_per_month": -1, "storage_mb": 10000, "private_roadmaps": -1}'::jsonb),
('Enterprise', 'For teams and organizations', 'enterprise', 4999, 49999,
 ARRAY['Everything in Pro', 'Team management', 'Custom integrations', 'Dedicated support'],
 '{"ai_queries_per_month": -1, "storage_mb": 100000, "private_roadmaps": -1}'::jsonb);

-- Insert sample skills
INSERT INTO skills (name, description, category, difficulty, estimated_hours, tags) VALUES
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming', 'Frontend Development', 'beginner', 40, ARRAY['javascript', 'programming', 'web']),
('React', 'Build user interfaces with React', 'Frontend Development', 'intermediate', 60, ARRAY['react', 'javascript', 'ui']),
('Node.js', 'Server-side JavaScript development', 'Backend Development', 'intermediate', 50, ARRAY['nodejs', 'javascript', 'backend']),
('Python Basics', 'Introduction to Python programming', 'Programming', 'beginner', 35, ARRAY['python', 'programming']),
('Machine Learning', 'Introduction to ML concepts and algorithms', 'Data Science', 'advanced', 120, ARRAY['ml', 'ai', 'python']),
('UI/UX Design', 'User interface and experience design principles', 'Design', 'beginner', 45, ARRAY['design', 'ui', 'ux']),
('SQL Database Design', 'Relational database design and SQL', 'Backend Development', 'intermediate', 40, ARRAY['sql', 'database', 'backend']),
('TypeScript', 'Typed JavaScript for better development', 'Frontend Development', 'intermediate', 30, ARRAY['typescript', 'javascript']),
('Docker', 'Containerization with Docker', 'DevOps', 'intermediate', 25, ARRAY['docker', 'devops', 'containers']),
('Git Version Control', 'Version control with Git and GitHub', 'Development Tools', 'beginner', 20, ARRAY['git', 'github', 'version-control']);

-- Insert sample achievements
INSERT INTO achievements (name, description, type, points, criteria) VALUES
('First Steps', 'Complete your first task', 'milestone', 10, '{"tasks_completed": 1}'::jsonb),
('Note Taker', 'Create your first note', 'milestone', 10, '{"notes_created": 1}'::jsonb),
('Streak Starter', 'Maintain a 7-day learning streak', 'streak', 50, '{"streak_days": 7}'::jsonb),
('Skill Master', 'Master your first skill', 'skill_mastery', 100, '{"skills_mastered": 1}'::jsonb),
('Community Helper', 'Help others by answering 10 questions', 'community', 75, '{"answers_given": 10}'::jsonb),
('Dedicated Learner', 'Study for 100 hours total', 'milestone', 200, '{"total_hours": 100}'::jsonb),
('Social Butterfly', 'Follow 10 other learners', 'community', 25, '{"follows_made": 10}'::jsonb),
('AI Enthusiast', 'Have 50 conversations with the AI assistant', 'special', 50, '{"ai_conversations": 50}'::jsonb),
('Roadmap Creator', 'Create your first learning roadmap', 'milestone', 30, '{"roadmaps_created": 1}'::jsonb),
('Study Buddy', 'Join 5 study rooms', 'community', 40, '{"study_rooms_joined": 5}'::jsonb);

-- Insert sample SEO pages
INSERT INTO seo_pages (slug, title, description, keywords, page_type, is_published) VALUES
('learn-javascript', 'Learn JavaScript - Complete Guide', 'Master JavaScript from basics to advanced concepts', ARRAY['javascript', 'programming', 'web development'], 'skill', true),
('react-tutorial', 'React Tutorial - Build Modern UIs', 'Learn React and build amazing user interfaces', ARRAY['react', 'javascript', 'frontend'], 'skill', true),
('python-programming', 'Python Programming for Beginners', 'Start your programming journey with Python', ARRAY['python', 'programming', 'beginners'], 'skill', true),
('web-development-roadmap', 'Web Development Learning Path', 'Complete roadmap to become a web developer', ARRAY['web development', 'roadmap', 'career'], 'roadmap', true),
('data-science-guide', 'Data Science Career Guide', 'Everything you need to know about data science', ARRAY['data science', 'career', 'analytics'], 'category', true);

-- Create some sample data for development (optional)
-- Note: This would typically be done through the application, not directly in SQL
-- Uncomment the following if you want sample data for development

/*
-- Sample user (this would normally be created through Supabase Auth)
-- INSERT INTO auth.users (id, email, created_at, updated_at) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'demo@skillforge.com', NOW(), NOW());

-- Sample profile
INSERT INTO profiles (id, full_name, bio, is_public) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'Learning enthusiast exploring new technologies', true);

-- Sample tasks
INSERT INTO tasks (user_id, title, description, status, skill_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Learn JavaScript Variables', 'Understand how to declare and use variables in JavaScript', 'completed', (SELECT id FROM skills WHERE name = 'JavaScript Fundamentals')),
('550e8400-e29b-41d4-a716-446655440000', 'Build a React Component', 'Create your first React functional component', 'in_progress', (SELECT id FROM skills WHERE name = 'React')),
('550e8400-e29b-41d4-a716-446655440000', 'Practice SQL Queries', 'Write basic SELECT statements', 'pending', (SELECT id FROM skills WHERE name = 'SQL Database Design'));

-- Sample notes
INSERT INTO notes (user_id, title, content, tags, is_public) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'JavaScript Basics', 'Variables in JavaScript can be declared using var, let, or const...', ARRAY['javascript', 'variables'], true),
('550e8400-e29b-41d4-a716-446655440000', 'React Hooks', 'useState and useEffect are the most commonly used hooks...', ARRAY['react', 'hooks'], false);
*/

-- ============================================================================
-- FINAL SETUP
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for foreign key constraints to improve performance
CREATE INDEX IF NOT EXISTS idx_tasks_roadmap_id ON tasks(roadmap_id);

-- Add foreign key constraint for tasks.roadmap_id (was forward referenced)
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_roadmap_id FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE SET NULL;

-- Refresh the schema
NOTIFY pgrst, 'reload schema';