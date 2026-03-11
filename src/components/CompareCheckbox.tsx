import React from 'react';

interface CompareCheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  count: number;
  max: number;
}

const CompareCheckbox: React.FC<CompareCheckboxProps> = ({
  isChecked,
  onToggle,
  count,
  max
}) => {
  const isDisabled = count >= max;

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`relative w-6 h-6 rounded-md border-2 transition-all duration-200 hover-scale-up ${
        isChecked
          ? 'bg-sky-500 border-sky-400'
          : isDisabled
          ? 'border-slate-600 opacity-50 cursor-not-allowed'
          : 'border-slate-600 hover:border-sky-400'
      }`}
      aria-label={isChecked ? 'Remove from comparison' : `Add to comparison (${count}/${max})`}
      title={isDisabled ? `Maximum ${max} projects` : isChecked ? 'Remove' : 'Add to comparison'}
    >
      {isChecked && (
        <svg
          className="absolute inset-0 w-full h-full p-0.5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 0 0 0-5-17l2 2v4l1.41-1.41L13 12h5V8h-2" />
        </svg>
      )}
    </button>
  );
};

export default CompareCheckbox;
