import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useCompatibilityCheck } from '../../utils/compatibilityCheck';

interface CompatibilityWarningProps {
  className?: string;
}

const CompatibilityWarning: React.FC<CompatibilityWarningProps> = ({ className = '' }) => {
  const {
    allFeaturesSupported,
    unsupportedFeatures
  } = useCompatibilityCheck();
  
  if (allFeaturesSupported) {
    return null; // Don't render anything if all features are supported
  }
  
  return (
    <div className={`bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="text-amber-400 font-medium mb-1">Browser Compatibility Warning</h3>
          <p className="text-gray-300 text-sm">
            Your browser doesn't support the following features required for this application to work properly:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 mt-2 ml-2">
            {unsupportedFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-300">
            Please consider using a modern browser like Chrome, Firefox, Edge, or Safari for the best experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityWarning;