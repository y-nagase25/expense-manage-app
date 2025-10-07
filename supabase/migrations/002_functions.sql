-- 新規ユーザーに対応するプロフィールを自動で作成する関数とトリガー

-- public.handle_new_user という関数を定義します
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.raw_user_meta_data->>'email');
  RETURN new;
END;
$$;