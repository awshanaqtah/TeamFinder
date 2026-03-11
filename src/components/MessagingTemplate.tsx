import React, { useState } from 'react';
import { ContactTemplate } from '../types';

interface MessagingTemplateProps {
  template: ContactTemplate;
  onCopy: () => void;
  onEdit: (template: ContactTemplate) => void;
}

const MessagingTemplate: React.FC<MessagingTemplateProps> = ({
  template,
  onCopy,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(template.message);

  const handleSave = () => {
    onEdit({ ...template, message: editedMessage });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMessage(template.message);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in">
        <div className="p-4 bg-slate-700/30 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-400 mb-3">Edit Message Template</h4>
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
            placeholder="Edit the message template..."
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-semibold text-slate-400">
            {template.subject}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-sky-400 transition-colors"
              title="Edit template"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-2a2 2 0 002-2h2a2 2 0 001-2 2H9z" />
              </svg>
            </button>
            <button
              onClick={onCopy}
              className="text-slate-400 hover:text-sky-400 transition-colors"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002 2v-2a2 2 0 002-2h2a2 2 0 001-2 2H9z" />
              </svg>
            </button>
          </div>
        </div>
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
          {template.message}
        </pre>
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>Characters: {template.message.length}</span>
        <span>Recommended: Keep under 500 chars</span>
      </div>
    </div>
  );
};

export default MessagingTemplate;
