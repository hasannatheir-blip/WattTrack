import React from 'react';

export const JordanFlag: React.FC<{ className?: string }> = ({ className = "w-6 h-4" }) => {
  return (
    <svg
      viewBox="0 0 600 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Stripes */}
      <rect width="600" height="100" fill="black" />
      <rect width="600" height="100" y="100" fill="white" />
      <rect width="600" height="100" y="200" fill="#007A3D" />
      
      {/* Red Triangle */}
      <path d="M 0,0 L 300,150 L 0,300 Z" fill="#CE1126" />
      
      {/* 7-pointed Star (Heptagram) */}
      <path
        d="M 100,150 
           m 0,-25
           L 105.5,138.5 118.5,135.5 111.5,146.5 121.5,155.5 108.5,156.5 100,168.5 91.5,156.5 78.5,155.5 88.5,146.5 81.5,135.5 94.5,138.5 Z"
        fill="white"
        transform="translate(0, 0)"
      />
    </svg>
  );
};
