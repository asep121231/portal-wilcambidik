-- Push notification subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL UNIQUE,
    keys JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated users (admin) and public (for subscribing)
CREATE POLICY "Allow public insert on push_subscriptions" ON push_subscriptions
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Allow deletes for authenticated users
CREATE POLICY "Allow authenticated delete on push_subscriptions" ON push_subscriptions
    FOR DELETE TO authenticated
    USING (true);

-- Allow select for authenticated users
CREATE POLICY "Allow authenticated select on push_subscriptions" ON push_subscriptions
    FOR SELECT TO authenticated
    USING (true);
