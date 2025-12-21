-- Email subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_verified ON email_subscribers(verified);

-- Enable RLS
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert for subscribing
CREATE POLICY "Allow public insert on email_subscribers" ON email_subscribers
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Allow public update for verification
CREATE POLICY "Allow public update on email_subscribers" ON email_subscribers
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated select
CREATE POLICY "Allow authenticated select on email_subscribers" ON email_subscribers
    FOR SELECT TO authenticated
    USING (true);

-- Allow authenticated delete
CREATE POLICY "Allow authenticated delete on email_subscribers" ON email_subscribers
    FOR DELETE TO authenticated
    USING (true);
