import React, { useState } from 'react';
import { ProjectIdea, TeamMember, ContactTemplate } from '../types';
import MessagingTemplate from './MessagingTemplate';
import { copyToClipboard } from '../services/exportService';
import { generateContactTemplate, generateShareableLink } from '../services/contactService';

interface TeamContactModalProps {
  project: ProjectIdea;
  team: TeamMember[];
  onGenerateTemplate: () => void;
  onCopyLink: () => void;
  onClose: () => void;
}

const TeamContactModal: React.FC<TeamContactModalProps> = ({
  project,
  team,
  onGenerateTemplate,
  onCopyLink,
  onClose
}) => {
  const [template, setTemplate] = useState<ContactTemplate | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const templateStyleOptions = [
    { value: 'formal', label: 'Formal', icon: '📧' },
    { value: 'casual', label: 'Casual', icon: '💬' }
  ];

  const handleGenerateTemplate = (style: 'formal' | 'casual' = 'formal') => {
    setTemplate(generateContactTemplate(project, team, style));
  };

  const handleCopyTemplate = async () => {
    if (!template) return;

    setIsCopying(true);
    const success = await copyToClipboard(template.message);
    setIsCopying(false);

    if (success) {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    }
  };

  const handleCopyShareableLink = async () => {
    setIsCopying(true);
    const link = generateShareableLink(project, team);
    const success = await copyToClipboard(link.url);
    setIsCopying(false);

    if (success) {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Share Team
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

        {/* Team Summary */}
        <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">Your Team ({team.length})</h4>
          <div className="flex flex-wrap gap-2">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.customRole || member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Generation */}
        {!template ? (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-400 mb-3">
              Generate Contact Template
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {templateStyleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleGenerateTemplate(option.value as 'formal' | 'casual')}
                  className="p-4 rounded-lg border-2 border-slate-600 hover:border-sky-500 hover:bg-slate-700/50 transition-all hover-scale-up"
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <p className="text-white font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessagingTemplate
            template={template}
            onCopy={handleCopyTemplate}
            onEdit={setTemplate}
          />
        )}

        {/* Shareable Link */}
        <div className="mb-6 p-4 bg-sky-900/20 rounded-lg border border-sky-700/30">
          <h4 className="text-sm font-semibold text-sky-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Shareable Team Link
          </h4>
          <p className="text-sm text-slate-400 mb-3">
            Generate a link to share your team details with members. The link includes project info, team composition, and expires in 7 days.
          </p>
          <button
            onClick={handleCopyShareableLink}
            disabled={isCopying}
            className={`w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors ${
              isCopying ? 'opacity-70' : ''
            }`}
          >
            {isCopying ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Copying...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link to Clipboard
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {showCopySuccess && (
          <div className="animate-slide-in-up bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">✓</div>
            <p className="text-green-400">Copied to clipboard!</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamContactModal;
