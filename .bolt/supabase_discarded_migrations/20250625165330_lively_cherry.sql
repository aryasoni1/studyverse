/*
  # Add ai_enabled column to notes table

  1. Changes
    - Add `ai_enabled` boolean column to notes table
    - Set default value to false
    - Make column NOT NULL with default

  2. Security
    - No changes to RLS policies needed
    - Column inherits existing table permissions
*/

-- Add ai_enabled column to notes table
ALTER TABLE notes ADD COLUMN ai_enabled BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN notes.ai_enabled IS 'Indicates whether AI assistance is enabled for this note';