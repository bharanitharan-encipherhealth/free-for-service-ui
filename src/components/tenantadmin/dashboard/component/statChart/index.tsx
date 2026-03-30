import Image from "next/image";
import React from "react";

interface StatCardProps {
  icon?: any;
  title: string;
  value: string | number;
  bgColor?: any;
  imageSizes?: string;
  isPriority?: boolean;
  borderRadius?: string | number;
  padding?: string | number;
  display?: string;
  alignItems?: string;
  gap?: string | number;
  minWidth?: string | number;
  justifyContent?: string;
  textAlign?: any;
  fontSize?: string | number;
  fontWeight?: string | number;
  height?: string | number;
  width?: string | number;
  flexDirection?: any;
  paddingTop?: string | number;
  backgroundColor?: string;
  textColor?: string;
  border?: string;
  style?: React.CSSProperties;
  lcpPriority?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  bgColor = "#F5F5F5",
  imageSizes,
  isPriority,
  borderRadius,
  padding,
  display,
  alignItems,
  gap,
  minWidth,
  justifyContent,
  textAlign,
  fontSize,
  fontWeight,
  height,
  flexDirection,
  paddingTop,
  textColor,
  border,
  style,
  lcpPriority
}) => {
  const isImageBackground = Boolean(bgColor && (bgColor.src || (typeof bgColor === "string" && (bgColor.startsWith("/") || bgColor.startsWith("http")))));

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: border,
        borderRadius: borderRadius,
        padding: padding,
        display: display,
        flexDirection: flexDirection,
        alignItems: alignItems,
        gap: gap,
        width: minWidth ?? "100%",
        justifyContent: justifyContent,
        height: height || "80px",
        background: isImageBackground ? undefined : (bgColor || '#F5F5F5'),
        ...style,
      }}
    >
      {isImageBackground && (
        <Image
          src={bgColor}
          alt={title || "background"}
          fill
          sizes={
            imageSizes ||
            "(max-width: 480px) 90vw, (max-width: 1024px) 45vw, 206px"
          }
          priority={Boolean(lcpPriority || isPriority)}
          loading={lcpPriority ? "eager" : "lazy"}
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
      )}

      <div style={{ textAlign: textAlign, paddingTop: paddingTop, position: 'relative', zIndex: 1 }} className="flex flex-col items-center justify-center h-full">
        <div style={{ fontWeight: "600", fontSize: "13px", color: textColor }}>{title}</div>
        <div
          style={{
            fontSize: fontSize || "36px",
            textAlign: textAlign,
            fontWeight: fontWeight,
            paddingTop: paddingTop,
            color: textColor
          }}
        >
          {value}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default StatCard;
