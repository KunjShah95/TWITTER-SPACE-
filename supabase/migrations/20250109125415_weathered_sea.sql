/*
  # Create Spaces Management Schema

  1. New Tables
    - `spaces`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `scheduled_for` (timestamp with time zone, required)
      - `host_id` (uuid, references auth.users)
      - `share_link` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on spaces table
    - Add policies for:
      - Anyone can read spaces
      - Authenticated users can create spaces
      - Hosts can update their own spaces
*/

CREATE TABLE spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  scheduled_for timestamptz NOT NULL,
  host_id uuid REFERENCES auth.users NOT NULL,
  share_link text UNIQUE DEFAULT gen_random_uuid()::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read spaces
CREATE POLICY "Anyone can view spaces"
  ON spaces
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create spaces
CREATE POLICY "Authenticated users can create spaces"
  ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow hosts to update their own spaces
CREATE POLICY "Hosts can update their own spaces"
  ON spaces
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);