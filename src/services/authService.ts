import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

/**
 * Register a new user with Supabase Auth
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }> => {
  try {
    // Validate inputs
    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();

    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Registration failed' };
    }

    // Create profile in database
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Auth user created but profile failed - still return success
    }

    // If session exists, email confirmation is disabled — user is logged in immediately
    // If session is null, Supabase sent a confirmation email
    const needsConfirmation = !data.session;
    return { success: true, needsConfirmation };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: error.message || 'Registration failed' };
  }
};

/**
 * Login user with Supabase Auth
 */
export const loginUser = async (
  usernameOrEmail: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    if (!usernameOrEmail || !password) {
      return { success: false, error: 'Please enter username/email and password' };
    }

    let email = usernameOrEmail;

    // If username provided, look up email
    if (!usernameOrEmail.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', usernameOrEmail.toLowerCase())
        .single();

      if (!profile) {
        return { success: false, error: 'User not found' };
      }
      email = profile.email;
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Login failed' };
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    const user: User = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      createdAt: profile.created_at,
    };

    return { success: true, user };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'Login failed' };
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Get current logged-in user from Supabase session
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    // Get user profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      createdAt: profile.created_at,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

/**
 * Get user-specific storage key (for backward compatibility)
 * With Supabase, this is less needed but kept for migration
 */
export const getUserStorageKey = async (key: string): Promise<string> => {
  const user = await getCurrentUser();
  if (!user) return key;
  return `${user.username}_${key}`;
};

/**
 * Save user settings to Supabase
 */
export const saveUserSettings = async (
  lastMajor?: string,
  lastSpecialization?: string
): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase
      .from('user_settings')
      .upsert({
        user_id: session.user.id,
        last_major: lastMajor,
        last_specialization: lastSpecialization,
        updated_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Save settings error:', error);
  }
};

/**
 * Load user settings from Supabase
 */
export const loadUserSettings = async (): Promise<{
  lastMajor?: string;
  lastSpecialization?: string;
}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return {};

    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!data) return {};

    return {
      lastMajor: data.last_major,
      lastSpecialization: data.last_specialization,
    };
  } catch (error) {
    console.error('Load settings error:', error);
    return {};
  }
};
