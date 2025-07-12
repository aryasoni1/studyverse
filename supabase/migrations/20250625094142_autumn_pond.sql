-- Sample data migration for development
-- This adds sample skills, achievements, and plans for testing

-- Insert additional sample skills
INSERT INTO skills (name, description, category, difficulty, estimated_hours, tags) VALUES
('Advanced React Patterns', 'Learn advanced React patterns like render props, HOCs, and compound components', 'Frontend Development', 'advanced', 80, ARRAY['react', 'javascript', 'patterns']),
('GraphQL', 'Learn to build and consume GraphQL APIs', 'Backend Development', 'intermediate', 45, ARRAY['graphql', 'api', 'backend']),
('AWS Fundamentals', 'Introduction to Amazon Web Services', 'Cloud Computing', 'beginner', 60, ARRAY['aws', 'cloud', 'infrastructure']),
('Data Visualization', 'Create compelling data visualizations', 'Data Science', 'intermediate', 35, ARRAY['visualization', 'charts', 'data']),
('Cybersecurity Basics', 'Fundamentals of cybersecurity', 'Security', 'beginner', 50, ARRAY['security', 'cybersecurity', 'safety']);

-- Insert additional achievements
INSERT INTO achievements (name, description, type, points, criteria) VALUES
('Speed Learner', 'Complete 5 skills in one month', 'milestone', 150, '{"skills_completed_in_month": 5}'::jsonb),
('Night Owl', 'Study for 10 hours after 10 PM', 'special', 75, '{"late_night_hours": 10}'::jsonb),
('Early Bird', 'Study for 10 hours before 8 AM', 'special', 75, '{"early_morning_hours": 10}'::jsonb),
('Mentor', 'Help 25 community members', 'community', 200, '{"help_count": 25}'::jsonb),
('Perfectionist', 'Achieve 100% completion on 10 roadmaps', 'milestone', 300, '{"perfect_roadmaps": 10}'::jsonb);

-- Insert sample SEO pages for different skill categories
INSERT INTO seo_pages (slug, title, description, keywords, page_type, is_published) VALUES
('frontend-development', 'Frontend Development Learning Path', 'Master frontend development with our comprehensive guide', ARRAY['frontend', 'web development', 'javascript', 'react'], 'category', true),
('backend-development', 'Backend Development Guide', 'Learn backend development from basics to advanced', ARRAY['backend', 'server', 'api', 'database'], 'category', true),
('data-science-path', 'Data Science Learning Journey', 'Complete guide to becoming a data scientist', ARRAY['data science', 'python', 'machine learning', 'analytics'], 'category', true),
('devops-guide', 'DevOps Engineering Path', 'Learn DevOps practices and tools', ARRAY['devops', 'docker', 'kubernetes', 'ci/cd'], 'category', true),
('mobile-development', 'Mobile App Development', 'Build mobile apps for iOS and Android', ARRAY['mobile', 'ios', 'android', 'react native'], 'category', true);