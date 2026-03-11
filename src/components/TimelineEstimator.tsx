import React, { useState } from 'react';
import { TimelineEstimate } from '../types';
import TimelineChart from './TimelineChart';
import ProgressBar from './ProgressBar';

interface TimelineEstimatorProps {
  estimate: TimelineEstimate;
  onClose: () => void;
}

const TimelineEstimator: React.FC<TimelineEstimatorProps> = ({
  estimate,
  onClose
}) => {
  const [teamSize, setTeamSize] = useState(estimate.teamSize);

  const getConfidenceColor = (level: 'Low' | 'Medium' | 'High'): string => {
    switch (level) {
      case 'Low':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'High':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getWeekRange = (): string => {
    const buffer = 1;
    const min = Math.max(2, estimate.adjustedWeeks - buffer);
    const max = estimate.adjustedWeeks + buffer;
    return min === max ? `${min} weeks` : `${min}-${max} weeks`;
  };

  const handleTeamSizeChange = (newSize: number) => {
    setTeamSize(newSize);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0l-6-6m-6 6 2-2-4 4m6 2a9 9 0 11-18 0 9 9 0 0118 0l-6-6" />
            </svg>
            Project Timeline
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

        {/* Summary Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-sky-900/30 to-indigo-900/30 rounded-lg border border-sky-700/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Est. Duration</p>
              <p className="text-2xl font-bold text-white">{getWeekRange()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Team Size</p>
              <p className="text-2xl font-bold text-white">{teamSize} {teamSize === 1 ? 'person' : 'people'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Confidence</p>
              <p className={`text-lg font-semibold px-3 py-1 rounded-full ${getConfidenceColor(estimate.confidenceLevel)}`}>
                {estimate.confidenceLevel}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Base Estimate</p>
              <p className="text-lg font-semibold text-white">{estimate.baseWeeks} weeks</p>
            </div>
          </div>
        </div>

        {/* Team Size Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Adjust Team Size to see impact
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="6"
              value={teamSize}
              onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <span className="text-white font-semibold w-12 text-center">{teamSize}</span>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Project Milestones</h4>
          <TimelineChart milestones={estimate.breakdown} totalWeeks={estimate.adjustedWeeks} />
        </div>

        {/* Factors */}
        {estimate.factors.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Timeline Factors</h4>
            <div className="space-y-2">
              {estimate.factors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">{factor.factor}</p>
                    <p className="text-sm text-slate-400">{factor.reason}</p>
                  </div>
                  <div className={`text-sm font-bold ${
                    factor.impact > 0 ? 'text-red-400' :
                    factor.impact < 0 ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    {factor.impact > 0 ? '+' : ''}{factor.impact} weeks
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30">
          <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.932 3H20c1.54 0 2.502-1.667 1.932-3l-1.712 6c-.77 1.333-2.694-1.333-3.464 0l-1.712 6z" />
            </svg>
            Tips for Success
          </h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Add buffer time for unexpected challenges</li>
            <li>• Schedule regular team check-ins</li>
            <li>• Break large milestones into smaller tasks</li>
            <li>• Document progress throughout the project</li>
          </ul>
        </div>

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

export default TimelineEstimator;
