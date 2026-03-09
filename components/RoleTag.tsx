import React, { useState } from 'react';
import { TeamRole } from '../types';

interface RoleTagProps {
  role: TeamRole;
  customRole?: string;
  onRoleChange: (role: TeamRole, customRole?: string) => void;
  readonly?: boolean;
}

const RoleTag: React.FC<RoleTagProps> = ({ role, customRole, onRoleChange, readonly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCustomRole, setTempCustomRole] = useState(customRole || '');

  const predefinedRoles: TeamRole[] = ['Lead', 'Frontend', 'Backend', 'ML', 'DevOps', 'UI/UX', 'QA', 'Other'];

  const getRoleColor = (role: TeamRole): string => {
    const colors: Record<TeamRole, string> = {
      Lead: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Frontend: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      Backend: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      ML: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      DevOps: 'bg-green-500/20 text-green-400 border-green-500/30',
      'UI/UX': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      QA: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Other: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[role];
  };

  const handleRoleSelect = (selectedRole: TeamRole) => {
    if (readonly) return;
    setIsEditing(false);
    if (selectedRole === 'Other' && tempCustomRole.trim()) {
      onRoleChange(selectedRole, tempCustomRole.trim());
    } else {
      onRoleChange(selectedRole);
    }
  };

  const displayText = role === 'Other' && customRole ? customRole : role;

  return (
    <div className="relative inline-block">
      {!isEditing ? (
        <button
          onClick={() => !readonly && setIsEditing(true)}
          className={`text-xs px-3 py-1 rounded-full border ${getRoleColor(role)} hover:opacity-80 transition cursor-pointer ${readonly ? 'cursor-default hover:opacity-100' : ''}`}
        >
          {displayText}
        </button>
      ) : (
        <div className="absolute top-full left-0 mt-1 z-10">
          <div className="bg-slate-700 border border-slate-600 rounded-md shadow-lg p-2 min-w-32">
            <div className="grid grid-cols-2 gap-1">
              {predefinedRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className={`text-xs px-2 py-1 rounded hover:bg-slate-600 text-left transition ${role === r ? 'bg-slate-600' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>
            {role === 'Other' && (
              <input
                type="text"
                value={tempCustomRole}
                onChange={(e) => setTempCustomRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRoleSelect('Other');
                  }
                }}
                placeholder="Custom role..."
                className="w-full mt-2 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white placeholder-slate-400 focus:ring-1 focus:ring-sky-500"
              />
            )}
            <button
              onClick={() => setIsEditing(false)}
              className="w-full mt-2 text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleTag;