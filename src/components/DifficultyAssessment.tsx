import React, { useState } from 'react';
import { AssessmentQuiz, AssessmentQuestion, AssessmentResult } from '../types';
import { calculateDifficultyAdjustment } from '../services/difficultyAssessmentService';

interface DifficultyAssessmentProps {
  quiz: AssessmentQuiz;
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}

const DifficultyAssessment: React.FC<DifficultyAssessmentProps> = ({
  quiz,
  onComplete,
  onCancel
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.skill, score);
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate result and show
      const result = calculateDifficultyAdjustment(newAnswers, 'Intermediate' as any);
      setShowResults(true);
      setTimeout(() => onComplete(result), 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="animate-fade-in">
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0l-6-6m-6 6 2-2-4 4" />
            </svg>
            Assessment Complete
          </h3>
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-slate-300">
              Your personalized difficulty rating has been calculated.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Difficulty Self-Assessment</h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span className="text-sky-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 animate-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-white mb-2">{currentQuestion.question}</h4>
          <p className="text-sm text-slate-400">
            Skill: <span className="text-sky-400 font-semibold">{currentQuestion.skill}</span>
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={`${currentQuestion.id}-${index}`}
              onClick={() => handleAnswer(option.score)}
              className="w-full text-left p-4 rounded-lg border-2 border-slate-600 hover:border-sky-500 hover:bg-slate-700/50 transition-all duration-200 hover-scale-up"
            >
              <div className="flex items-center justify-between">
                <span className="text-white">{option.text}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    option.score <= 2 ? 'bg-red-500' :
                    option.score <= 5 ? 'bg-yellow-500' :
                    option.score <= 7 ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultyAssessment;
