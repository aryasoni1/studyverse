# Environment Setup Guide

## Current Environment Status

Your current environment has the following services configured:

### ✅ Configured Services

1. **Supabase** - ✅ Configured
   - URL: `https://zbnlbqfrcxykdrvurz.supabase.co`
   - Anon Key: ✅ Present

2. **LiveKit** - ✅ Configured
   - URL: `wss://skillforge-3t0y5vrx.livekit.cloud`
   - API Key: ✅ Present
   - API Secret: ✅ Present

3. **Tavus** - ✅ Configured
   - API Key: ✅ Present

4. **Gemini** - ✅ Configured
   - API Key: ✅ Present

### ⚠️ Missing Services

1. **OpenAI** - ❌ Not Configured
   - Add `VITE_OPENAI_API_KEY=your_openai_api_key_here` to your `.env` file

2. **Supabase Service Role Key** - ❌ Not Configured
   - Add `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here` to your `.env` file

## Complete Environment Variables

Add these to your `.env` file:

```bash
# Application Configuration
VITE_APP_NAME=SkillForge
VITE_APP_URL=http://localhost:5173

# Supabase Configuration
VITE_SUPABASE_URL=https://zbnlbqfrcxykdrvurz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibmxicWZyY3h5a2Rydnp2dXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDMwMTYsImV4cCI6MjA2NjQxOTAxNn0.RBP0zSLdLjxwIahHcHB5Qk_EjGBq-YRbrnzOej-jw8I

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# LiveKit Configuration
VITE_LIVEKIT_URL=wss://skillforge-3t0y5vrx.livekit.cloud
VITE_LIVEKIT_API_KEY=APIgnVqMJHqYuhE
VITE_LIVEKIT_API_SECRET=gkq9fhX8BPFhA4xl7waZOO4dGREZbYpxrLLQP9AQp2G

# Tavus Configuration
VITE_TAVUS_API_KEY=0a86c50d8d464474a6b4036b5545c69e

# Gemini Configuration
VITE_GEMINI_API_KEY=AIzaSyB4eUtTIEDjeV8xYJ7RVlwHhvJlkIWx0iI

# OpenAI Configuration (Optional - for AI chat features)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Google Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here

# Development Configuration
NODE_ENV=development
```

## Service Setup Instructions

### 1. Supabase Setup

Your Supabase project is already configured. To get the service role key:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `zbnlbqfrcxykdrvurz`
3. Go to Settings → API
4. Copy the "service_role" key (not the anon key)
5. Add it to your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`

### 2. LiveKit Setup

Your LiveKit configuration is complete. The service should work for:

- Study rooms
- Watch together rooms
- Video conferencing features

### 3. Tavus Setup

Your Tavus API key is configured. This enables:

- AI avatar video generation
- Personalized video responses

### 4. Gemini Setup

Your Gemini API key is configured. This enables:

- AI chat responses
- Educational content generation
- Code explanations

### 5. OpenAI Setup (Optional)

To enable OpenAI features:

1. Get an API key from: https://platform.openai.com/api-keys
2. Add `VITE_OPENAI_API_KEY=your_key_here` to your `.env` file

## Testing Connections

Use the `ConnectionStatus` component to test all your connections:

```tsx
import { ConnectionStatus } from "@/components/shared/ConnectionStatus";

// In your component
<ConnectionStatus showDetails={true} />;
```

## Supabase Database Schema

Your Supabase project includes the following tables:

### Core Tables

- `profiles` - User profiles
- `skills` - User skills and expertise
- `tasks` - Learning tasks and goals
- `notes` - User notes and documentation
- `roadmaps` - Learning roadmaps
- `study_rooms` - Virtual study rooms
- `ai_chat_history` - AI conversation history

### Community Features

- `community_posts` - Community posts
- `comments` - Post comments
- `likes` - Post likes
- `followers` - User following relationships

### Analytics & Billing

- `usage_tracking` - API usage tracking
- `billing_subscriptions` - Subscription management
- `notifications` - User notifications

## Edge Functions

Your Supabase project includes these edge functions:

1. **ai-chat** - AI chat functionality
2. **livekit-token** - LiveKit token generation
3. **ask-ai-note** - AI note assistance
4. **generate-flashcards** - Flashcard generation

## Security Policies

Your database has Row Level Security (RLS) enabled with policies for:

- User data isolation
- Public/private content access
- Moderator permissions
- Subscription-based access control

## Next Steps

1. Add the missing environment variables to your `.env` file
2. Test all connections using the ConnectionStatus component
3. Deploy your edge functions if not already deployed
4. Set up your Supabase service role key for server-side operations
