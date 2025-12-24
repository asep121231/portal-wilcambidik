-- Fix missing foreign key relationship between posts and attachments
-- This is required for PostgREST to recognize the join relationship

-- First, check if the foreign key already exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'attachments'
        AND ccu.table_name = 'posts'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE attachments
        ADD CONSTRAINT attachments_post_id_fkey
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint added successfully';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$;

-- Notify PostgREST to reload its schema cache
-- This is crucial for the relationship to be recognized
NOTIFY pgrst, 'reload schema';

-- Verify the constraint exists
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'attachments';
