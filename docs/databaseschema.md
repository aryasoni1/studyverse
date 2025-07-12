-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievements (
id uuid NOT NULL DEFAULT gen_random_uuid(),
name text NOT NULL UNIQUE,
description text NOT NULL,
type USER-DEFINED NOT NULL,
icon_url text,
badge_color text DEFAULT '#6366f1'::text,
criteria jsonb NOT NULL,
points integer DEFAULT 0,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ai_chat_history (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
session_id uuid NOT NULL,
message text NOT NULL,
response text NOT NULL,
context jsonb DEFAULT '{}'::jsonb,
model_used text,
tokens_used integer DEFAULT 0,
response_time integer,
rating integer CHECK (rating >= 1 AND rating <= 5),
feedback text,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT ai_chat_history_pkey PRIMARY KEY (id),
CONSTRAINT ai_chat_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.analytics_events (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid,
session_id text,
event_name text NOT NULL,
event_data jsonb DEFAULT '{}'::jsonb,
page_url text,
user_agent text,
ip_address inet,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.billing_info (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL UNIQUE,
plan_id uuid NOT NULL,
stripe_customer_id text,
stripe_subscription_id text,
status text DEFAULT 'active'::text,
current_period_start timestamp with time zone,
current_period_end timestamp with time zone,
cancel_at_period_end boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT billing_info_pkey PRIMARY KEY (id),
CONSTRAINT billing_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT billing_info_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id)
);
CREATE TABLE public.comments (
id uuid NOT NULL DEFAULT gen_random_uuid(),
post_id uuid NOT NULL,
user_id uuid NOT NULL,
parent_id uuid,
content text NOT NULL,
like_count integer DEFAULT 0 CHECK (like_count >= 0),
is_solution boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT comments_pkey PRIMARY KEY (id),
CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id)
);
CREATE TABLE public.flashcards (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
skill_id uuid,
note_id uuid,
question text NOT NULL,
answer text NOT NULL,
difficulty USER-DEFINED DEFAULT 'beginner'::difficulty_level,
last_reviewed timestamp with time zone,
next_review timestamp with time zone,
review_count integer DEFAULT 0,
success_rate double precision DEFAULT 0 CHECK (success_rate >= 0::double precision AND success_rate <= 1::double precision),
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT flashcards_pkey PRIMARY KEY (id),
CONSTRAINT flashcards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT flashcards_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id),
CONSTRAINT flashcards_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id)
);
CREATE TABLE public.follows (
id uuid NOT NULL DEFAULT gen_random_uuid(),
follower_id uuid NOT NULL,
following_id uuid NOT NULL,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT follows_pkey PRIMARY KEY (id),
CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.profiles(id),
CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.likes (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
post_id uuid,
comment_id uuid,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT likes_pkey PRIMARY KEY (id),
CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
CONSTRAINT likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id)
);
CREATE TABLE public.mindmap_nodes (
id uuid NOT NULL DEFAULT gen_random_uuid(),
roadmap_id uuid NOT NULL,
node_data jsonb NOT NULL,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT mindmap_nodes_pkey PRIMARY KEY (id),
CONSTRAINT mindmap_nodes_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id)
);
CREATE TABLE public.note_shares (
id uuid NOT NULL DEFAULT gen_random_uuid(),
note_id uuid NOT NULL,
shared_by uuid NOT NULL,
shared_with uuid,
share_token text UNIQUE,
expires_at timestamp with time zone,
can_edit boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT note_shares_pkey PRIMARY KEY (id),
CONSTRAINT note_shares_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id),
CONSTRAINT note_shares_shared_by_fkey FOREIGN KEY (shared_by) REFERENCES public.profiles(id),
CONSTRAINT note_shares_shared_with_fkey FOREIGN KEY (shared_with) REFERENCES public.profiles(id)
);
CREATE TABLE public.notebooks (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
name text NOT NULL,
description text,
color text DEFAULT '#6366f1'::text,
is_default boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT notebooks_pkey PRIMARY KEY (id),
CONSTRAINT notebooks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notes (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
notebook_id uuid,
title text NOT NULL,
content text NOT NULL,
tags ARRAY DEFAULT '{}'::text[],
skill_id uuid,
is_public boolean DEFAULT false,
is_favorite boolean DEFAULT false,
word_count integer DEFAULT 0,
reading_time integer DEFAULT 0,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
ai_enabled boolean NOT NULL DEFAULT false,
CONSTRAINT notes_pkey PRIMARY KEY (id),
CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT notes_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebooks(id),
CONSTRAINT notes_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.notifications (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
type USER-DEFINED NOT NULL,
title text NOT NULL,
message text NOT NULL,
data jsonb DEFAULT '{}'::jsonb,
is_read boolean DEFAULT false,
action_url text,
expires_at timestamp with time zone,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT notifications_pkey PRIMARY KEY (id),
CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.plans (
id uuid NOT NULL DEFAULT gen_random_uuid(),
name text NOT NULL,
description text,
type USER-DEFINED NOT NULL,
price_monthly integer DEFAULT 0,
price_yearly integer DEFAULT 0,
features ARRAY DEFAULT '{}'::text[],
limits jsonb DEFAULT '{}'::jsonb,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT plans_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pomodoro_sessions (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
room_id uuid,
task_id uuid,
duration integer NOT NULL DEFAULT 25,
break_duration integer DEFAULT 5,
completed_cycles integer DEFAULT 0,
target_cycles integer DEFAULT 1,
started_at timestamp with time zone DEFAULT now(),
completed_at timestamp with time zone,
notes text,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT pomodoro_sessions_pkey PRIMARY KEY (id),
CONSTRAINT pomodoro_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT pomodoro_sessions_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.study_rooms(id),
CONSTRAINT pomodoro_sessions_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.posts (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
title text NOT NULL,
content text NOT NULL,
post_type text DEFAULT 'discussion'::text,
skill_id uuid,
tags ARRAY DEFAULT '{}'::text[],
is_pinned boolean DEFAULT false,
is_locked boolean DEFAULT false,
view_count integer DEFAULT 0,
like_count integer DEFAULT 0,
comment_count integer DEFAULT 0,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT posts_pkey PRIMARY KEY (id),
CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT posts_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.profiles (
id uuid NOT NULL,
full_name text,
avatar_url text,
bio text,
website text,
location text,
timezone text DEFAULT 'UTC'::text,
learning_goals ARRAY,
skills_interested ARRAY,
experience_level USER-DEFINED DEFAULT 'beginner'::difficulty_level,
preferred_language text DEFAULT 'en'::text,
is_public boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT profiles_pkey PRIMARY KEY (id),
CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.roadmap_skills (
id uuid NOT NULL DEFAULT gen_random_uuid(),
roadmap_id uuid NOT NULL,
skill_id uuid NOT NULL,
order_index integer NOT NULL,
progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
completed_at timestamp with time zone,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT roadmap_skills_pkey PRIMARY KEY (id),
CONSTRAINT roadmap_skills_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id),
CONSTRAINT roadmap_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.roadmaps (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
title text NOT NULL,
description text,
status USER-DEFINED DEFAULT 'not_started'::roadmap_status,
difficulty USER-DEFINED NOT NULL,
estimated_duration integer,
progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
is_template boolean DEFAULT false,
is_public boolean DEFAULT false,
template_id uuid,
started_at timestamp with time zone,
completed_at timestamp with time zone,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT roadmaps_pkey PRIMARY KEY (id),
CONSTRAINT roadmaps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT roadmaps_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.roadmaps(id)
);
CREATE TABLE public.seo_pages (
id uuid NOT NULL DEFAULT gen_random_uuid(),
slug text NOT NULL UNIQUE,
title text NOT NULL,
description text,
keywords ARRAY,
content jsonb,
page_type text NOT NULL,
reference_id uuid,
is_published boolean DEFAULT false,
view_count integer DEFAULT 0,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT seo_pages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.skills (
id uuid NOT NULL DEFAULT gen_random_uuid(),
name text NOT NULL,
description text,
category text NOT NULL,
difficulty USER-DEFINED NOT NULL,
estimated_hours integer DEFAULT 0,
prerequisites ARRAY DEFAULT '{}'::uuid[],
tags ARRAY DEFAULT '{}'::text[],
icon_url text,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.study_room_messages (
id uuid NOT NULL DEFAULT gen_random_uuid(),
room_id uuid NOT NULL,
user_id uuid NOT NULL,
message text NOT NULL,
message_type text DEFAULT 'text'::text,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT study_room_messages_pkey PRIMARY KEY (id),
CONSTRAINT study_room_messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.study_rooms(id),
CONSTRAINT study_room_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.study_room_participants (
id uuid NOT NULL DEFAULT gen_random_uuid(),
room_id uuid NOT NULL,
user_id uuid NOT NULL,
joined_at timestamp with time zone DEFAULT now(),
left_at timestamp with time zone,
is_moderator boolean DEFAULT false,
CONSTRAINT study_room_participants_pkey PRIMARY KEY (id),
CONSTRAINT study_room_participants_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.study_rooms(id),
CONSTRAINT study_room_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.study_rooms (
id uuid NOT NULL DEFAULT gen_random_uuid(),
host_id uuid NOT NULL,
name text NOT NULL,
description text,
topic text,
max_participants integer DEFAULT 10,
is_public boolean DEFAULT true,
password_hash text,
status USER-DEFINED DEFAULT 'active'::study_room_status,
scheduled_start timestamp with time zone,
scheduled_end timestamp with time zone,
actual_start timestamp with time zone,
actual_end timestamp with time zone,
room_settings jsonb DEFAULT '{}'::jsonb,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
study_room_id uuid DEFAULT gen_random_uuid(),
CONSTRAINT study_rooms_pkey PRIMARY KEY (id),
CONSTRAINT study_rooms_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.tasks (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
title text NOT NULL,
description text,
due_date timestamp with time zone,
priority integer DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
status USER-DEFINED DEFAULT 'pending'::task_status,
skill_id uuid,
roadmap_id uuid,
estimated_duration integer,
actual_duration integer,
tags ARRAY DEFAULT '{}'::text[],
completed_at timestamp with time zone,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT tasks_pkey PRIMARY KEY (id),
CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT tasks_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id),
CONSTRAINT fk_tasks_roadmap_id FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id)
);
CREATE TABLE public.usage_tracking (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
resource_type text NOT NULL,
amount integer NOT NULL,
period_start date NOT NULL,
period_end date NOT NULL,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT usage_tracking_pkey PRIMARY KEY (id),
CONSTRAINT usage_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.user_achievements (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
achievement_id uuid NOT NULL,
unlocked_at timestamp with time zone DEFAULT now(),
progress jsonb DEFAULT '{}'::jsonb,
CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id)
);
CREATE TABLE public.user_skills (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
skill_id uuid NOT NULL,
progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
mastered_at timestamp with time zone,
started_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT user_skills_pkey PRIMARY KEY (id),
CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.user_stats (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL UNIQUE,
total_hours_studied integer DEFAULT 0,
skills_mastered integer DEFAULT 0,
community_rank integer DEFAULT 0,
current_streak integer DEFAULT 0,
longest_streak integer DEFAULT 0,
last_streak_update date DEFAULT CURRENT_DATE,
total_notes integer DEFAULT 0,
total_tasks_completed integer DEFAULT 0,
total_roadmaps_completed integer DEFAULT 0,
points_earned integer DEFAULT 0,
level_current integer DEFAULT 1,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT user_stats_pkey PRIMARY KEY (id),
CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.watch_room_messages (
id uuid NOT NULL DEFAULT gen_random_uuid(),
room_id uuid NOT NULL,
user_id uuid NOT NULL,
message text NOT NULL,
message_type text DEFAULT 'text'::text,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT watch_room_messages_pkey PRIMARY KEY (id),
CONSTRAINT watch_room_messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.watch_rooms(id),
CONSTRAINT watch_room_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.watch_room_participants (
id uuid NOT NULL DEFAULT gen_random_uuid(),
room_id uuid NOT NULL,
user_id uuid NOT NULL,
joined_at timestamp with time zone DEFAULT now(),
left_at timestamp with time zone,
is_moderator boolean DEFAULT false,
status text DEFAULT 'online'::text,
CONSTRAINT watch_room_participants_pkey PRIMARY KEY (id),
CONSTRAINT watch_room_participants_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.watch_rooms(id),
CONSTRAINT watch_room_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.watch_rooms (
id uuid NOT NULL DEFAULT gen_random_uuid(),
host_id uuid NOT NULL,
name text NOT NULL,
description text,
is_public boolean DEFAULT true,
password_hash text,
status USER-DEFINED DEFAULT 'waiting'::watch_room_status,
video_url text,
video_title text,
video_duration integer,
current_time integer DEFAULT 0,
max_participants integer DEFAULT 10,
room_settings jsonb DEFAULT '{}'::jsonb,
scheduled_start timestamp with time zone,
actual_start timestamp with time zone,
actual_end timestamp with time zone,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT watch_rooms_pkey PRIMARY KEY (id),
CONSTRAINT watch_rooms_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.profiles(id)
);
