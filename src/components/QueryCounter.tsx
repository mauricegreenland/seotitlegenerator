import React from 'react';
import { Timer } from 'lucide-react';

interface QueryCounterProps {
  remainingQueries: number;
  nextReset: number;
  selectedModel: string;
}

function QueryCounter({ remainingQueries, nextReset, selectedModel }: QueryCounterProps) {
  if (selectedModel !== 'default') {
    return (
      <div className="flex items-center gap-2 text-sm text-custom-medium-gray">
        <Timer className="w-4 h-4 flex-shrink-0" />
        <span>Unlimited queries remaining</span>
      </div>
    );
  }

  const getTimeRemaining = () => {
    const now = Date.now();
    const diff = nextReset - now;
    
    if (diff <= 0) return 'Resetting...';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Resets in ${hours}h ${minutes}m`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-custom-medium-gray">
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{remainingQueries} queries remaining</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="whitespace-nowrap">{getTimeRemaining()}</span>
        <div className="w-16 sm:w-24 h-2 bg-custom-gray-blue rounded-full overflow-hidden flex-shrink-0">
          <div
            className={`h-full transition-all duration-300 ${
              remainingQueries > 2 ? 'bg-green-500' : 'bg-custom-primary'
            }`}
            style={{ width: `${(remainingQueries / 8) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default QueryCounter;