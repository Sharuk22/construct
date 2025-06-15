import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: '8px 16px',
        backgroundColor: 'blue',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        ...props.style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
