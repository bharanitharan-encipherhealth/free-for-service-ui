import { Skeleton } from "antd";
import React from "react";

interface CardSkeletonProps {
  count?: number;
  height?: number | string;
  display?: React.CSSProperties["display"];
  gap?: React.CSSProperties["gap"];
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  height = 100,
  display,
  gap,
}) => {
  return (
    <>
      {Array.from({ length: Number(count) }).map((_, index) => (
        <div key={index}>
          <Skeleton.Input
            style={{
              height: height,
              display: display,
              gap: gap,
            }}
            active
            block={true}
          />
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
