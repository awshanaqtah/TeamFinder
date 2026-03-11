import React from 'react';
import { TimelineMilestone } from '../types';

interface TimelineChartProps {
  milestones: TimelineMilestone[];
  totalWeeks: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ milestones, totalWeeks }) => {
  const getMilestoneWidth = (weeks: number): number => {
    return totalWeeks > 0 ? (weeks / totalWeeks) * 100 : 0;
  };

  const getPhaseColor = (index: number): string => {
    const colors = [
      'from-sky-500 to-sky-400',
      'from-indigo-500 to-indigo-400',
      'from-purple-500 to-purple-400',
      'from-pink-500 to-pink-400'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-3">
      {/* Timeline Bar */}
      <div className="relative">
        <div className="h-8 bg-slate-700/50 rounded-full overflow-hidden">
          {milestones.map((milestone, index) => {
            const width = getMilestoneWidth(milestone.weeks || 0);
            const leftOffset = index > 0
              ? milestones.slice(0, index).reduce((sum, m) => sum + (m.weeks || 0), 0)
              : 0;

            return (
              <div
                key={milestone.phase}
                className={`absolute h-full bg-gradient-to-r ${getPhaseColor(index)} animate-fill`}
                style={{
                  left: `${(leftOffset / totalWeeks) * 100}%`,
                  width: `${width}%`
                }}
              />
            );
          })}
        </div>

        {/* Week Markers */}
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Week 0</span>
          <span>Week {Math.round(totalWeeks / 2)}</span>
          <span>Week {totalWeeks}</span>
        </div>
      </div>

      {/* Milestone Details */}
      <div className="space-y-2">
        {milestones.map((milestone, index) => {
          const leftOffset = index > 0
            ? milestones.slice(0, index).reduce((sum, m) => sum + (m.weeks || 0), 0)
            : 0;
          const leftPercent = (leftOffset / totalWeeks) * 100;

          return (
            <div
              key={milestone.phase}
              className="flex items-start gap-3 relative"
              style={{ paddingLeft: `${leftPercent}%` }}
            >
              <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 bg-gradient-to-r ${getPhaseColor(index)}`} />
              <div className="flex-1">
                <div className={`text-sm text-white mb-1 ${
                  index === 0 ? 'font-semibold' : ''
                }`}>
                  {milestone.phase} ({milestone.weeks || 0}w)
                </div>
                <p className="text-xs text-slate-400">{milestone.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineChart;
