import React from "react";
import { Skeleton } from "antd";

export const renderSkeletonHold = () => (
  <div className="skeleton-table">
    <div className="skeleton-header">
      <Skeleton.Input style={{ width: 510 }} active />
    </div>

    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="skeleton-row">
        <Skeleton.Input style={{ width: 510 }} active />
      </div>
    ))}
  </div>
);
