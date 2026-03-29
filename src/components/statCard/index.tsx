import Image, { StaticImageData } from "next/image";
import React, { CSSProperties } from "react";

interface StatCardProps {
  icon?: string | StaticImageData;
  title?: string;
  value?: string | number;
  bgColor?: string | StaticImageData;
  imageSizes?: string;
  isPriority?: boolean;
  borderRadius?: string | number;
  padding?: string | number;
  display?: CSSProperties["display"];
  alignItems?: CSSProperties["alignItems"];
  gap?: CSSProperties["gap"];
  minWidth?: string | number;
  justifyContent?: CSSProperties["justifyContent"];
  textAlign?: CSSProperties["textAlign"];
  fontSize?: string | number;
  fontWeight?: CSSProperties["fontWeight"];
  height?: string | number;
  width?: string | number;
  flexDirection?: CSSProperties["flexDirection"];
  paddingTop?: string | number;
  backgroundColor?: string;
  textColor?: string;
  border?: string;
  style?: CSSProperties;
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
  const isImageBackground = Boolean(bgColor && typeof bgColor !== "string");

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        border: border,
        borderRadius: borderRadius,
        padding: padding,
        display: display,
        flexDirection: flexDirection,
        alignItems: alignItems,
        gap: gap,
        width: minWidth || width,
        justifyContent: justifyContent,
        height: height || "80px",
        background: isImageBackground ? undefined : (bgColor as string),
        ...style,
      }}
    >
      {isImageBackground && (
        <Image
          src={bgColor as StaticImageData}
          alt={title || "background"}
          fill
          sizes={
            imageSizes ||
            "(max-width: 480px) 90vw, (max-width: 1024px) 45vw, 206px"
          }
          priority={Boolean(lcpPriority || isPriority)}
          loading={lcpPriority ? "eager" : "lazy"}
          style={{ objectFit: "cover", zIndex: 0 }}
        />
      )}

      {/* Uncomment and type icon usage if needed
      {icon && (
        <div
          style={{
            backgroundColor: backgroundColor || "#F5F5F5",
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

      <div
        style={{
          textAlign: textAlign,
          paddingTop: paddingTop,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, color: textColor }}>
          {title}
        </div>
        <div
          style={{
            fontSize: fontSize || 36,
            textAlign: textAlign,
            fontWeight: fontWeight,
            paddingTop: paddingTop,
            color: textColor,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
