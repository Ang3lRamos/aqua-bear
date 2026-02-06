-- Aqua Bear Swim Club - Supabase Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  reservation_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  participants INTEGER DEFAULT 1 CHECK (participants > 0),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_email ON public.reservations(email);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert reservations (public booking form)
CREATE POLICY "Anyone can insert reservations"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Only authenticated users (admins) can view all reservations
CREATE POLICY "Authenticated users can view all reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users (admins) can update reservations
CREATE POLICY "Authenticated users can update reservations"
ON public.reservations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users (admins) can delete reservations
CREATE POLICY "Authenticated users can delete reservations"
ON public.reservations
FOR DELETE
TO authenticated
USING (true);

-- Insert sample data for testing (optional)
INSERT INTO public.reservations (full_name, email, phone, reservation_date, time_slot, service_type, participants, notes, status)
VALUES 
  ('Juan Pérez', 'juan@example.com', '+52 1 123 456 7890', CURRENT_DATE + INTERVAL '3 days', '10:00 AM - 11:00 AM', 'Clases Infantiles', 1, 'Primera clase de prueba', 'pending'),
  ('María García', 'maria@example.com', '+52 1 987 654 3210', CURRENT_DATE + INTERVAL '5 days', '3:00 PM - 4:00 PM', 'Clases para Adultos', 1, 'Nivel principiante', 'confirmed'),
  ('Carlos López', 'carlos@example.com', '+52 1 555 123 4567', CURRENT_DATE + INTERVAL '7 days', '8:00 AM - 9:00 AM', 'Entrenamiento Competitivo', 2, 'Dos hermanos', 'pending');

-- Create admin user (update email and password)
-- Note: You should create admin users through Supabase Dashboard or Auth API
-- This is just a reference

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Comments for documentation
COMMENT ON TABLE public.reservations IS 'Stores all swimming class reservations';
COMMENT ON COLUMN public.reservations.id IS 'Unique identifier for each reservation';
COMMENT ON COLUMN public.reservations.status IS 'Current status: pending, confirmed, cancelled, or completed';
COMMENT ON COLUMN public.reservations.service_type IS 'Type of swimming service booked';
COMMENT ON COLUMN public.reservations.time_slot IS 'Preferred time slot for the class';