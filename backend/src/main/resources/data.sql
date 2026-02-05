-- Insert test users for development
-- Password for all users: "password123" (BCrypt encoded)
INSERT INTO users (email, password, full_name, is_active, avatar_url, created_at, updated_at) 
VALUES 
    ('dao@mapic.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dao', true, 'https://i.pravatar.cc/150?img=1', NOW(), NOW()),
    ('test2@mapic.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Minh', true, 'https://i.pravatar.cc/150?img=2', NOW(), NOW()),
    ('test3@mapic.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hoa', true, 'https://i.pravatar.cc/150?img=3', NOW(), NOW()),
    ('test4@mapic.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nam', true, 'https://i.pravatar.cc/150?img=4', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
