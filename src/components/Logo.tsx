
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className,
  size = 'md',
  animated = true
}) => {
  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div className={cn(
      sizes[size],
      animated && 'animate-float',
      className
    )}>
      <img 
        src="/lovable-uploads/7a96682a-47a3-4ed0-8036-8a31ad28cb4b.png" 
        alt="Comunidade Imobiliária Logo" 
        className="w-full h-full object-contain" 
      />
    </div>
  );
};

export default Logo;
