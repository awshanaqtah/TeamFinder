import { ProjectIdea } from '../types';

const BOOKMARKS_STORAGE_KEY = 'teamfinder-bookmarks';

export const addBookmark = (project: ProjectIdea): void => {
  const bookmarks = getBookmarks();

  // Check if already bookmarked
  if (bookmarks.some(b => b.title === project.title)) {
    return;
  }

  // Add new bookmark with timestamp
  const bookmarkWithTimestamp = {
    ...project,
    bookmarkedAt: new Date().toISOString()
  };

  bookmarks.push(bookmarkWithTimestamp);
  saveBookmarks(bookmarks);
};

export const removeBookmark = (projectTitle: string): void => {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.title !== projectTitle);
  saveBookmarks(filtered);
};

export const isBookmarked = (projectTitle: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.title === projectTitle);
};

export const getBookmarks = (): ProjectIdea[] => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!stored) return [];

    const bookmarks = JSON.parse(stored);

    // Sort by bookmarkedAt date (newest first)
    return bookmarks.sort((a: any, b: any) =>
      new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
    );
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

export const clearBookmarks = (): void => {
  localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
};

const saveBookmarks = (bookmarks: ProjectIdea[]): void => {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
};

export const toggleBookmark = (project: ProjectIdea): boolean => {
  if (isBookmarked(project.title)) {
    removeBookmark(project.title);
    return false;
  } else {
    addBookmark(project);
    return true;
  }
};
