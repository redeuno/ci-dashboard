
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
    sm: 'w-24 h-auto',
    md: 'w-32 h-auto',
    lg: 'w-48 h-auto'
  };

  return (
    <div className={cn(
      sizes[size],
      animated && 'animate-float',
      className
    )}>
      <img 
        src="/lovable-uploads/ci-logo-full.png" 
        alt="Comunidade Imobiliária Logo" 
        className="w-full h-full object-contain" 
      />
    </div>
  );
};

export default Logo;
