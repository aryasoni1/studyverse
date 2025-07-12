# SkillForge API Documentation

## Overview

The SkillForge API provides endpoints for managing users, skills, learning paths, notes, and AI-powered features.

## Authentication

All API endpoints (except public ones) require authentication using Supabase Auth.

### Headers
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

#### POST /auth/login
Sign in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Users

#### GET /users/profile
Get the current user's profile.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /users/profile
Update the current user's profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### Skills

#### GET /skills
Get a list of available skills.

**Query Parameters:**
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty level
- `limit` (number): Number of results (default: 20)
- `page` (number): Page number (default: 1)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "React",
      "description": "A JavaScript library for building user interfaces",
      "category": "Frontend Development",
      "difficulty": "intermediate",
      "estimated_hours": 40
    }
  ],
  "count": 1,
  "page": 1,
  "total_pages": 1
}
```

### Notes

#### GET /notes
Get user's notes.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "React Hooks",
      "content": "Notes about React hooks...",
      "tags": ["react", "hooks"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /notes
Create a new note.

**Request Body:**
```json
{
  "title": "React Hooks",
  "content": "Notes about React hooks...",
  "tags": ["react", "hooks"],
  "skill_id": "uuid"
}
```

### AI Assistant

#### POST /ai/chat
Send a message to the AI assistant.

**Request Body:**
```json
{
  "message": "Explain React hooks",
  "context": {
    "skill": "React",
    "topic": "Hooks",
    "user_level": "beginner"
  }
}
```

**Response:**
```json
{
  "response": "React hooks are functions that let you use state and other React features...",
  "suggestions": [
    "Tell me about useState",
    "Show me an example of useEffect"
  ],
  "resources": [
    {
      "title": "React Hooks Documentation",
      "url": "https://reactjs.org/docs/hooks-intro.html",
      "type": "article"
    }
  ]
}
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- AI assistant: 20 requests per minute

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit` - Number of items per page (max 100, default 20)
- `page` - Page number (starts at 1)

**Response includes:**
- `count` - Total number of items
- `page` - Current page number
- `total_pages` - Total number of pages