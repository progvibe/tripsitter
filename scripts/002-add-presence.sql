-- Create presence table for tracking online users
CREATE TABLE IF NOT EXISTS presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_presence_trip_id ON presence(trip_id);
CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON presence(last_seen_at);
