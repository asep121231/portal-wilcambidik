-- Create email_subscribers table (if not exists)
CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ
);

-- Create index for email lookup
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_verified ON email_subscribers(verified);

-- Enable RLS
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Allow public insert on email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Allow authenticated select on email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Allow authenticated update on email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Allow authenticated delete on email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Allow public verify on email_subscribers" ON email_subscribers;

-- Policy: Allow public to subscribe (insert)
CREATE POLICY "Allow public insert on email_subscribers" ON email_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow authenticated users to view all subscriptions
CREATE POLICY "Allow authenticated select on email_subscribers" ON email_subscribers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update subscriptions
CREATE POLICY "Allow authenticated update on email_subscribers" ON email_subscribers
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete subscriptions
CREATE POLICY "Allow authenticated delete on email_subscribers" ON email_subscribers
    FOR DELETE
    USING (auth.role() = 'authenticated');
