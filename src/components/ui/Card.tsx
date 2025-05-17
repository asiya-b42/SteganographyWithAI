import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = '',
  footer,
  bordered = false,
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden ${
        bordered ? 'border border-gray-700' : ''
      } ${
        hoverable ? 'transition-all hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-700">
          {title && (
            <div className="flex items-center gap-2">
              {icon && <div className="text-cyan-400">{icon}</div>}
              <h3 className="text-lg font-medium text-white">{title}</h3>
            </div>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700">{footer}</div>}
    </div>
  );
};

export default Card;