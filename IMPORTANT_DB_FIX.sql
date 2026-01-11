-- WARNING: Run this in your Supabase SQL Editor to fix the missing column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';

-- Optional: Update existing AI projects to 'IA' if they were created before
UPDATE projects 
SET category = 'IA' 
WHERE title ILIKE '%Poker%' OR title ILIKE '%GPT%' OR title ILIKE '%IA%';
