import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'from-sky-500 to-sky-400',
  showLabel = true
}) => {
  const percentage = Math.min(100, Math.max(0, value));
  const widthPercentage = max > 0 ? (percentage / max) * 100 : percentage;

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">{Math.round(percentage)}%</span>
          {max !== 100 && (
            <span className="text-slate-400">{max}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} animate-fill`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
