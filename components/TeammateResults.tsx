import React, { useState } from 'react';
import { ProjectIdea, Profile } from '../types';
import TeammateCard from './TeammateCard';
import { searchTeammatesByName } from '../services/teammateService';

interface TeammateResultsProps {
  project: ProjectIdea;
  suggestedTeammates: Profile[];
  onClear: () => void;
  currentUser: Profile;
  team: Profile[];
  onAddTeammate: (teammate: Profile) => void;
  onRemoveTeammate: (teammateName: string) => void;
}

const TeammateResults: React.FC<TeammateResultsProps> = ({ 
  project, 
  suggestedTeammates, 
  onClear,
  currentUser,
  team,
  onAddTeammate,
  onRemoveTeammate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    const results = searchTeammatesByName(searchQuery, currentUser);
    setSearchResults(results);
    setIsSearching(false);
  };

  const teamMemberNames = new Set(team.map(m => m.name));
  const suggestedAndNotOnTeam = suggestedTeammates.filter(t => !teamMemberNames.has(t.name));

  return (
    <div className="animate-fade-in space-y-8">
      {/* Section 1: Selected Project */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Project Selected!</h2>
        <div className="bg-slate-700/50 p-4 rounded-lg border border-sky-500">
          <h3 className="font-bold text-sky-400 text-lg">{project.title}</h3>
          <p className="text-slate-300 mt-1">{project.description}</p>
        </div>
      </div>

      {/* Section 2: Your Team */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Your Team ({team.length})</h3>
        {team.length > 0 ? (
          <div className="space-y-4">
            {team.map((member, index) => (
              <TeammateCard 
                key={member.name} 
                teammate={member} 
                index={index} 
                action="remove"
                onAction={onRemoveTeammate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-400 bg-slate-800/50 rounded-lg">
            <p>Add teammates from suggestions or search below.</p>
          </div>
        )}
      </div>

      {/* Section 3: Teammate Search */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Search for Teammates</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name..."
            className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
          <button onClick={handleSearch} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 disabled:opacity-50 transition">
            Search
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-4">
            {searchResults.map((teammate, index) => (
              <TeammateCard 
                key={teammate.name} 
                teammate={teammate} 
                index={index}
                action="add"
                onAction={onAddTeammate}
                disabled={teamMemberNames.has(teammate.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Suggested Teammates */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Suggested Teammates</h3>
        {suggestedAndNotOnTeam.length > 0 ? (
          <div className="space-y-4">
            {suggestedAndNotOnTeam.map((teammate, index) => (
              <TeammateCard 
                key={teammate.name} 
                teammate={teammate} 
                index={index} 
                action="add"
                onAction={onAddTeammate}
                disabled={teamMemberNames.has(teammate.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 bg-slate-800/50 rounded-lg">
            <p>No new suggestions at the moment.</p>
            <p className="text-sm">Try searching for specific students.</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onClear}
        className="mt-6 w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition duration-300"
      >
        Choose a Different Project
      </button>
    </div>
  );
};

export default TeammateResults;