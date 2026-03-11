import { supabase } from '../lib/supabase';
import { ProjectIdea } from '../types';

/**
 * Get all bookmarks for the current user from Supabase
 */
export const getBookmarks = async (): Promise<ProjectIdea[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get bookmarks error:', error);
      return [];
    }

    return data?.map((bookmark) => bookmark.project_data as ProjectIdea) || [];
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return [];
  }
};

/**
 * Check if a project is bookmarked
 */
export const isBookmarked = async (projectTitle: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('project_title', projectTitle)
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
};

/**
 * Toggle bookmark status (add/remove)
 */
export const toggleBookmark = async (project: ProjectIdea): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('project_title', project.title)
      .single();

    if (existing) {
      // Remove bookmark
      await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existing.id);
      return false;
    } else {
      // Add bookmark
      await supabase.from('bookmarks').insert({
        user_id: session.user.id,
        project_title: project.title,
        project_data: project,
      });
      return true;
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    return false;
  }
};

/**
 * Remove a bookmark by project title
 */
export const removeBookmark = async (projectTitle: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', session.user.id)
      .eq('project_title', projectTitle);
  } catch (error) {
    console.error('Remove bookmark error:', error);
  }
};

/**
 * Subscribe to real-time bookmark updates
 */
export const subscribeToBookmarks = (
  onUpdate: (bookmarks: ProjectIdea[]) => void
) => {
  const channel = supabase
    .channel('bookmarks_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
      },
      async () => {
        // Reload bookmarks when changes occur
        const bookmarks = await getBookmarks();
        onUpdate(bookmarks);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
