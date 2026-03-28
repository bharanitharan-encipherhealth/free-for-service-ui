import React from "react";
import style from "../ContentLayout/style.module.css";
import { FaArrowLeft } from "react-icons/fa6";
import { Skeleton } from "antd";

export default function PageHeaderLayout({
  data,
  onHandleBack,
  loading,
  children,
}: {
  data: { title?: string; value: string | number; icon?: React.ReactNode }[];
  onHandleBack: () => void;
  loading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${style.contentLayout} h-[53px] flex justify-between items-center py-2 px-5`}
    >
      {!loading ? (
        <>
          <div className="flex justify-start items-center gap-10">
            {data?.length &&
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
                      <div
                        className={`${item?.icon && "flex gap-1 items-center"}`}
                      >
                        {item?.icon && (
                          <div className={style?.headerIcon}>{item?.icon}</div>
                        )}
                        {item?.value}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={index}>
                    <div>{item?.title}</div>
                    <div
                      className={`${item?.icon && "flex gap-1 items-center"}`}
                    >
                      {item?.icon && (
                        <div className={style?.headerIcon}>{item?.icon}</div>
                      )}
                      {item?.value}
                    </div>
                  </div>
                ),
              )}
          </div>
          {children && <div>{children}</div>}
        </>
      ) : (
        <Skeleton.Input active block />
      )}
    </div>
  );
}
