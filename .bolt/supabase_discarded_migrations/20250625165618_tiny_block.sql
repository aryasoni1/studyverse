/*
  # Add ai_enabled column to notes table

  1. Changes
    - Add ai_enabled column to notes table
    - Set default value to false
    - Make column NOT NULL with default

  2. Purpose
    - Enable AI features for individual notes
    - Allow users to toggle AI assistance per note
    - Fix schema mismatch error in frontend
*/

-- Add ai_enabled column to notes table
ALTER TABLE notes ADD COLUMN ai_enabled BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN notes.ai_enabled IS 'Whether AI assistance is enabled for this note';