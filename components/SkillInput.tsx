import React, { useState, useEffect, useRef } from 'react';
import { Major } from '../types';
import { COMMON_SKILLS, ALL_SKILLS } from '../data/skillDatabase';

interface SkillInputProps {
  skills: string | string[];
  onChange: (skills: string[]) => void;
  major?: Major | '';
  placeholder?: string;
}

const SkillInput: React.FC<SkillInputProps> = ({
  skills: inputSkills,
  onChange,
  major = '',
  placeholder = 'Type a skill...'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedInput, setDebouncedInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert input skills to array for internal state
  const skillsArray = Array.isArray(inputSkills) ? inputSkills : inputSkills ? inputSkills.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Debounce input for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Update suggestions based on debounced input
  useEffect(() => {
    if (debouncedInput.length > 0) {
      const majorSkills = major ? COMMON_SKILLS[major as Major] || [] : [];
      const allRelevantSkills = [...new Set([...majorSkills, ...ALL_SKILLS])];

      const filtered = allRelevantSkills
        .filter(skill =>
          skill.toLowerCase().includes(debouncedInput.toLowerCase()) &&
          !skillsArray.some(existing => existing.toLowerCase() === skill.toLowerCase())
        )
        .slice(0, 8);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedInput, major, skillsArray]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skillsArray.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      const newSkills = [...skillsArray, trimmedSkill];
      onChange(newSkills);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = skillsArray.filter((_, i) => i !== index);
    onChange(newSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    // Small delay to allow clicking suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {skillsArray.map((skill, index) => (
          <span
            key={index}
            className="bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-sky-500/30"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="hover:text-white transition"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-slate-700 border border-slate-600 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
            {suggestions.map((skill, index) => (
              <li
                key={index}
                onClick={() => addSkill(skill)}
                className="px-3 py-2 hover:bg-sky-500/20 cursor-pointer text-slate-300 transition flex items-center justify-between"
              >
                <span>{skill}</span>
                <span className="text-xs text-slate-500">+ Add</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {skillsArray.length === 0 && !inputValue && (
        <p className="text-xs text-slate-500 mt-1">
          Start typing to add skills, or try: {major ? COMMON_SKILLS[major as Major]?.slice(0, 3).join(', ') || 'Python, Java, SQL' : 'Python, Java, SQL'}
        </p>
      )}
    </div>
  );
};

export default SkillInput;