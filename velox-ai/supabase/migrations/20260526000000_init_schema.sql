-- Create users table that maps to Supabase auth or custom profiles
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Can be UUID from auth.users or arbitrary text identifier
    display_name TEXT NOT NULL DEFAULT 'User',
    email TEXT,
    photo_url TEXT,
    selected_plan TEXT DEFAULT 'free',
    credits INTEGER DEFAULT 3,
    max_credits INTEGER DEFAULT 3,
    credits_used INTEGER DEFAULT 0,
    total_responses_generated INTEGER DEFAULT 0,
    total_pickups_created INTEGER DEFAULT 0,
    quiz_answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security (RLS) on users table as it is only accessed via the secure backend proxy server.ts
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;


-- Create chronological logs sub-table
CREATE TABLE IF NOT EXISTS public.logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'cantada' (pickup) or 'resposta' (response)
    context TEXT,
    style TEXT DEFAULT 'Ousado',
    recommendation TEXT,
    level_text TEXT,
    percentage INTEGER DEFAULT 75,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user activity queries
CREATE INDEX IF NOT EXISTS logs_user_id_created_at_idx ON public.logs(user_id, created_at DESC);

-- Disable RLS on logs as they are only accessed via the secure backend proxy server.ts
ALTER TABLE public.logs DISABLE ROW LEVEL SECURITY;


-- Automated function to sync auth.users to public.users on sign-up (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, display_name, email, photo_url)
    VALUES (
        new.id::text,
        COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger executing handle_new_user when an auth user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
