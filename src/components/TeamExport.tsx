import React, { useState } from 'react';
import { ProjectIdea, TeamMember } from '../types';
import { copyToClipboard, downloadAsText, generateFilename, generateTeamSummary } from '../services/exportService';

interface TeamExportProps {
  project: ProjectIdea;
  team: TeamMember[];
}

const TeamExport: React.FC<TeamExportProps> = ({ project, team }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyToClipboard = async () => {
    setIsCopying(true);
    const summary = generateTeamSummary(project, team);
    const success = await copyToClipboard(summary);
    setIsCopying(false);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const summary = generateTeamSummary(project, team);
    const filename = generateFilename(project.title);
    downloadAsText(summary, filename);
    setIsDownloading(false);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex gap-2">
        <button
          onClick={handleCopyToClipboard}
          disabled={isCopying || team.length === 0}
          className="flex items-center gap-2 bg-slate-600 text-white text-sm py-2 px-4 rounded-md hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isCopying ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Copying...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Summary
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading || team.length === 0}
          className="flex items-center gap-2 bg-slate-600 text-white text-sm py-2 px-4 rounded-md hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </>
          )}
        </button>
      </div>

      {showSuccess && (
        <div className="bg-green-500/20 text-green-400 text-sm px-3 py-2 rounded-md border border-green-500/30 animate-fade-in">
          ✓ Summary copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default TeamExport;