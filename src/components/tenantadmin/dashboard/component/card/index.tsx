import React from "react";

interface CardProps {
  children?: React.ReactNode;
  borderRadius?: string;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  borderRadius = "12px",
  padding = "16px",
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`bg-white border rounded shadow-sm ${className}`}
      style={{
        borderRadius,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
