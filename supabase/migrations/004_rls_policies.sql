-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. ユーザーは誰でもプロフィールを閲覧できるようにします
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING ( true );

-- 2. ユーザーは自身のプロフィールを追加できるようにします
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

-- 3. ユーザーは自身のプロフィールを更新できるようにします
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );