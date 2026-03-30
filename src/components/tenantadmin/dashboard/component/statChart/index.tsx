import Image, { StaticImageData } from "next/image";
import React from "react";

interface StatCardProps {
  icon?: any;
  title: string;
  value: string | number;
  bgColor?: string | StaticImageData;
  imageSizes?: string;
  isPriority?: boolean;
  borderRadius?: string;
  padding?: string;
  display?: string;
  alignItems?: string;
  gap?: string;
  minWidth?: string;
  justifyContent?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  fontSize?: string;
  fontWeight?: string | number;
  height?: string;
  width?: string;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  paddingTop?: string;
  backgroundColor?: string;
  textColor?: string;
  border?: string;
  style?: React.CSSProperties;
  lcpPriority?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
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
  width,
  flexDirection,
  paddingTop,
  backgroundColor,
  textColor,
  border,
  style,
  lcpPriority,
}) => {
  const isImageBackground = Boolean(bgColor && (bgColor as any).src);

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
        width: minWidth,
        justifyContent: justifyContent,
        height: height || "80px",
        background: isImageBackground ? undefined : (typeof bgColor === 'string' ? bgColor : '#F5F5F5'),
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
            // Rendered card typical width: clamp(150px, 30%, 206px)
            // Prefer a realistic responsive sizes map to improve LCP
            "(max-width: 480px) 90vw, (max-width: 1024px) 45vw, 206px"
          }
          priority={Boolean(lcpPriority || isPriority)}
          loading={lcpPriority ? "eager" : "lazy"}
          fetchPriority={lcpPriority ? "high" : (isPriority ? "high" : "auto")}
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
      )}
      {/* {icon && (
        <div
          style={{
            backgroundColor: backgroundColor || "#F5F5F5" ,
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
          }}
        >
          <Image
            src={icon}
            alt={title}
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
        </div>
      )} */}

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
