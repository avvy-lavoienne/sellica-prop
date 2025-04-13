import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key dari Supabase Dashboard
const supabaseUrl = 'https://yrssspoimsxpibcbeaca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyc3NzcG9pbXN4cGliY2JlYWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTA0NzIsImV4cCI6MjA2MDAyNjQ3Mn0.IAHcNQgy86F7DihpFKjPJ19SgLgzQgal-VhejfdycMU';

export const supabase = createClient(supabaseUrl, supabaseKey);