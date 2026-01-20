import React from "react";
import style from "../ContentLayout/style.module.css";
import { FaArrowLeft } from "react-icons/fa6";
import { Skeleton } from "antd";

export default function PageHeaderLayout({
  data,
  onHandleBack,
  loading,
}: {
  data: { title: string; value: string | number }[];
  onHandleBack: () => void;
  loading: boolean;
}) {

  return (
    <div
      className={`${style.contentLayout} h-[53px] flex justify-start items-center py-2 gap-10 px-5`}
    >
      {!loading ? (
        data?.length &&
        data?.map((item, index) =>
          index === 0 ? (
            <div key={index} className="flex gap-3 items-center">
              <div
                className={`${style.leftArrow} cursor-pointer`}
                onClick={onHandleBack}
              >
                <FaArrowLeft />
              </div>
              <div>
                <div>{item?.title}</div>
                <div>{item?.value}</div>
              </div>
            </div>
          ) : (
            <div key={index}>
              <div>{item?.title}</div>
              <div>{item?.value}</div>
            </div>
          )
        )
      ) : (
        <Skeleton.Input active block />
      )}
    </div>
  );
}
