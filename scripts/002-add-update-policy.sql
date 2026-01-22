-- Add policy to allow updating reservations (for admin to change status)
CREATE POLICY "Allow updating reservations" ON reservations
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add policy to allow deleting reservations
CREATE POLICY "Allow deleting reservations" ON reservations
  FOR DELETE
  USING (true);
