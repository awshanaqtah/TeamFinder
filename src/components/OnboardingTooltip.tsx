import React, { useState, useEffect } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  content: string;
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
  onComplete: () => void;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('teamfinder-onboarding');
    if (!seen) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleComplete = () => {
    localStorage.setItem('teamfinder-onboarding', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-lg max-w-md mx-4 border border-sky-500 animate-slide-in-up shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">
            {steps[currentStep].title}
          </h3>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white transition"
            aria-label="Skip onboarding"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 min-h-[80px]">
          <p className="text-slate-300 leading-relaxed">
            {steps[currentStep].content}
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-sky-500 scale-125' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition cursor-pointer">
              <input
                type="checkbox"
                onChange={handleComplete}
                className="rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500"
              />
              Don't show again
            </label>

            <button
              onClick={handleNext}
              className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition"
            >
              {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTooltip;