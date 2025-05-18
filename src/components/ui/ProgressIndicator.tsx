import React from 'react';

interface ProgressIndicatorProps {
  progress: number; // Value between 0 and 1
  status?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  status,
  variant = 'default',
  showPercentage = true,
  className = '',
}) => {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(normalizedProgress * 100);
  
  // Determine color based on variant
  const variantClasses = {
    default: 'bg-cyan-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  
  return (
    <div className={`w-full ${className}`}>
      {status && <p className="text-sm text-gray-400 mb-1">{status}</p>}
      
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${variantClasses[variant]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {showPercentage && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;