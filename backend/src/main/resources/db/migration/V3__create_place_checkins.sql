-- Create place_checkins table for tracking user check-ins to places
CREATE TABLE IF NOT EXISTS place_checkins (
    id BIGSERIAL PRIMARY KEY,
    place_id BIGINT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(place_id, user_id, DATE(checked_in_at))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_place_checkins_place ON place_checkins(place_id);
CREATE INDEX IF NOT EXISTS idx_place_checkins_user ON place_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_place_checkins_date ON place_checkins(checked_in_at);
