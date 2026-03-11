import React, { useState } from 'react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggle();
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-200 ${className}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={isBookmarked ? 'Remove bookmark' : 'Save for later'}
    >
      <svg
        className={`w-5 h-5 ${
          isBookmarked
            ? 'text-pink-500 fill-pink-500 animate-glow'
            : 'text-slate-400 hover:text-pink-400'
        } ${isAnimating ? 'animate-bounce-click' : ''}`}
        fill={isBookmarked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78l-1.06-1.06L12 5.67Z"
        />
      </svg>
    </button>
  );
};

export default BookmarkButton;
