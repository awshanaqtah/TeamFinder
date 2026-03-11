import React, { useState } from 'react';
import { SkillProficiency } from '../types';
import { getProficiencyColor, getProficiencyIcon } from '../services/proficiencyService';

interface SkillProficiencyEditorProps {
  skills: string[];
  proficiencies: SkillProficiency[];
  onSave: (proficiencies: SkillProficiency[]) => void;
  onClose: () => void;
}

const SkillProficiencyEditor: React.FC<SkillProficiencyEditorProps> = ({
  skills,
  proficiencies,
  onSave,
  onClose
}) => {
  const [localProficiencies, setLocalProficiencies] = useState<SkillProficiency[]>(proficiencies);

  // Create a map for easy lookup
  const profMap = new Map<string, 'Beginner' | 'Intermediate' | 'Advanced'>();
  localProficiencies.forEach(p => {
    profMap.set(p.skill.toLowerCase(), p.level);
  });

  const handleLevelChange = (skill: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    const updated = localProficiencies.filter(p => p.skill !== skill);
    updated.push({ skill, level });
    setLocalProficiencies(updated);
  };

  const handleSave = () => {
    onSave(localProficiencies);
    onClose();
  };

  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0l-6-6m-6 6 2-2-4 4" />
            </svg>
            Set Skill Levels
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div className="mb-6 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-300 mb-2 font-semibold">Proficiency Levels:</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span>🌱</span>
              <span className="text-gray-400">Beginner</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📖</span>
              <span className="text-blue-400">Intermediate</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span className="text-green-400">Advanced</span>
            </div>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {skills.map((skill, index) => {
            const currentLevel = profMap.get(skill.toLowerCase()) || 'Beginner';
            return (
              <div
                key={skill}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span className="text-white font-medium">{skill}</span>
                <div className="flex gap-1">
                  {levels.map(level => {
                    const isSelected = currentLevel === level;
                    const colorClass = getProficiencyColor(level);
                    return (
                      <button
                        key={level}
                        onClick={() => handleLevelChange(skill, level)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all hover-scale-up ${
                          isSelected
                            ? colorClass + ' border-transparent shadow-lg'
                            : 'border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {getProficiencyIcon(level)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={handleSave}
            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Save Proficiency Levels
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillProficiencyEditor;
