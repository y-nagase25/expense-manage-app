-- auth.users テーブルへの挿入後に関数を実行するトリガーを設定します
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();