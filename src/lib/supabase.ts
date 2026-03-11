import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// NOTE: Replace these with your actual Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Profile {
  id: string;
  username: string;
  email: string;
  name?: string;
  skills?: string;
  major?: string;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  project_title: string;
  project_data: any; // ProjectIdea JSON
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  last_major?: string;
  last_specialization?: string;
  updated_at: string;
}
