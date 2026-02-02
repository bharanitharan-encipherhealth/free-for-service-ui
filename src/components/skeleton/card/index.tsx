import { Skeleton } from "antd";
import React from "react";

interface CardSkeletonProps {
  count?: number;
  height?: number;
  display?: React.CSSProperties["display"];
  gap?: string | number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  height = 100,
  display,
  gap,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ marginBottom: gap }}>
          <Skeleton.Input
            style={{
              height,
              display,
            }}
            active
            block
          />
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
