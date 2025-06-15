import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white rounded shadow ${className || ''}`}>
    {children}
  </div>
);

export default Card;
export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={`p-4 ${className || ''}`}>
    {children}
  </div>
);
