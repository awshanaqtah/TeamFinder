import React from 'react';
import { Profile } from '../types';

interface TeammateCardProps {
  teammate: Profile;
  index: number;
  action: 'add' | 'remove';
  onAction: (profileOrName: Profile | string) => void;
  disabled?: boolean;
}

const TeammateCard: React.FC<TeammateCardProps> = ({ teammate, index, action, onAction, disabled = false }) => {
  const handleAction = () => {
    if (action === 'add') {
      onAction(teammate);
    } else {
      onAction(teammate.name);
    }
  };

  const buttonText = action === 'add' ? 'Add to Team' : 'Remove';
  const buttonColor = action === 'add' 
    ? "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:text-slate-400"
    : "bg-red-600 hover:bg-red-500 focus:ring-red-500";

  return (
    <div 
      className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg border border-slate-600 animate-slide-in-up"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div>
        <h4 className="font-bold text-white">{teammate.name}</h4>
        <p className="text-sm text-slate-400">{teammate.major}</p>
        <p className="text-slate-300 mt-2 text-sm">
          <span className="font-semibold">Skills:</span> {teammate.skills}
        </p>
      </div>
      <button 
        onClick={handleAction}
        disabled={disabled}
        className={`text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition duration-300 ${buttonColor}`}
      >
        {disabled ? 'On Team' : buttonText}
      </button>
    </div>
  );
};

export default TeammateCard;