import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠️ Supabase環境変数が設定されていません。\n' +
    '.envファイルを作成し、VITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください。\n' +
    '詳細は SETUP_GUIDE.md を参照してください。'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
