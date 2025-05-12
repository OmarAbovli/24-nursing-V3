
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className, size = 40 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
        <path
          d="M10 20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20C30 25.523 25.523 30 20 30C14.477 30 10 25.523 10 20Z"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M20 15V25"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 20H25"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xl font-bold text-primary">24h App</span>
    </div>
  );
};

export default Logo;
