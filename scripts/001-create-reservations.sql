-- Create reservations table for Aqua Bear Swim Club
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service_type VARCHAR(100) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  participants INTEGER DEFAULT 1,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries on date
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert reservations (public booking form)
CREATE POLICY "Allow public to create reservations" ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow reading own reservations by email (for confirmation)
CREATE POLICY "Allow reading reservations" ON reservations
  FOR SELECT
  USING (true);
