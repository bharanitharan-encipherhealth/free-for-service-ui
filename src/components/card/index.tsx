import React from "react";
import styles from "./style.module.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  Bgcolor?: string;
  padding?: any;
  borderRadius?: any;
  width?: any;
  height?: any;
  bg?: any;
  display?: any;
  placeItems?: any;
  "data-testid"?: string;
}

const Card = ({
  children,
  Bgcolor = "#fff",
  padding,
  borderRadius,
  width,
  height,
  bg,
  display,
  placeItems,
  "data-testid": testId,
  style: propStyle,
  ...rest
}: CardProps) => {
  const cardStyle: React.CSSProperties = {
    background: bg ? bg : Bgcolor,
    padding: padding ? padding : "5px",
    borderRadius: borderRadius ? borderRadius : "16px",
    width: width,
    height: height,
    display: display,
    placeItems: placeItems,
    ...propStyle,
  };
  return (
    <div className={styles.card} style={cardStyle} data-testid={testId} {...rest}>
      {children}
    </div>
  );
};

export default Card;
