import { FileLayoutType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import style from "../../style.module.css";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { connect, ConnectedProps } from "react-redux";
import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";

type FileLayoutReduxType = ConnectedProps<typeof connector> & FileLayoutType;
const FileLayout = React.memo(
  ({
    collapse,
    setCollapse,
    diseaseCategories,
    activeTab,
    setAddModaOpen,
    isDisable,
  }: FileLayoutReduxType) => {
    const { setNodeRef: setDiagnosisDropRef } = useDroppable({
      id: "diagnosis",
    });
    const { setNodeRef: setCareGapDropRef } = useDroppable({
      id: "caregap",
    });
    const { setNodeRef: setSuggestedDropRef } = useDroppable({
      id: "suggested",
    });
    const { setNodeRef: setDeleteDropRef } = useDroppable({
      id: "delete",
    });
    const isDisabledStatus = useMemo(
      () => isDisable?.isDosWise || isDisable?.isYearWise,
      [isDisable],
    );
    return (
      <div className="flex gap-3 h-full w-full">
        {diseaseCategories?.map((item, index) => {
          return (
            <>
              {(item?.id == 1 || item?.id == 2) && (
                <div
                  className={`${style?.[item?.layout]} p-2 flex flex-col min-h-0 ${collapse?.includes(item?.layout) ? "w-full" : "w-20 flex justify-center cursor-pointer items-center"}`}
                  key={item?.id + index}
                  ref={
                    item.id === 1
                      ? setDiagnosisDropRef
                      : item.id === 2
                        ? setCareGapDropRef
                        : undefined
                  }
                  onClick={() => {
                    if (!collapse?.includes(item?.layout)) {
                      setCollapse((prev) => [...prev, item?.layout]);
                    }
                  }}
                >
                  <div className="flex justify-between mb-2 items-center mt-1 shrink-0">
                    <div className="flex gap-3 items-center font-semibold">
                      <div
                        className={`${style?.[item?.layout + "TextColor"]} font-bold text-sm ${!collapse?.includes(item?.layout) && "[writing-mode:vertical-rl]"}`}
                      >
                        {item?.cardTitle?.toUpperCase()}
                      </div>
                      {collapse?.includes(item?.layout) && (
                        <span>{item?.length || 0}</span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      {item?.cardTitle === "Diagnosis" &&
                        collapse?.includes(item?.layout) && (
                          <div
                            className={`${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => {
                              if (!isDisabledStatus) {
                                setAddModaOpen({ isAdd: true });
                              }
                            }}
                          >
                            <IoMdAdd className="font-bold text-xl" />
                          </div>
                        )}
                      {collapse?.includes(item?.layout) && (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setCollapse((prev) =>
                              prev?.filter((c) => c != item?.layout),
                            );
                          }}
                        >
                          <IoIosArrowBack className="font-bold text-xl" />
                        </div>
                      )}
                    </div>
                  </div>

                  {collapse?.includes(item?.layout) && (
                    <div className="flex-1 min-h-0 overflow-y-auto mb-3">
                      {item?.children}
                    </div>
                  )}
                </div>
              )}
              {item?.id == 3 && (
                <div
                  className={`grid flex-col gap-3 h-full overflow-hidden ${collapse?.includes(item?.layout) ? "w-full" : "w-20 cursor-pointer"}`}
                >
                  {[
                    ...(activeTab == 1
                      ? [
                          diseaseCategories?.find((i) => i?.id == 3),
                          diseaseCategories?.find((i) => i?.id == 4),
                        ]
                      : [diseaseCategories?.find((i) => i?.id == 4)]),
                  ]?.map((data, index) => {
                    return (
                      <div
                        className={`${style?.[data!.layout]} p-2 w-full h-full flex flex-col min-h-0 ${collapse?.includes(item?.layout) ? "w-full" : "flex justify-center cursor-pointer items-center"}`}
                        key={data!.id + index}
                        ref={
                          data?.id === 3
                            ? setSuggestedDropRef
                            : data?.id === 4
                              ? setDeleteDropRef
                              : undefined
                        }
                        onClick={() => {
                          if (!collapse?.includes(item?.layout)) {
                            setCollapse((prev) => [...prev, item?.layout]);
                          }
                        }}
                      >
                        <div className="flex justify-between mb-2 items-center mt-1 shrink-0">
                          <div className="flex gap-3 items-center font-semibold">
                            <div
                              className={`${style?.[item?.layout + "TextColor"]} font-bold text-sm ${!collapse?.includes(item?.layout) && "[writing-mode:vertical-rl]"}`}
                            >
                              {data?.cardTitle?.toUpperCase()}
                            </div>
                            {collapse?.includes(item?.layout) && (
                              <span>{data?.length || 0}</span>
                            )}
                          </div>
                          {index == 0 && collapse?.includes(item?.layout) && (
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                setCollapse((prev) =>
                                  prev?.filter((c) => c != item?.layout),
                                );
                              }}
                            >
                              <IoIosArrowBack className="font-bold text-xl" />
                            </div>
                          )}
                        </div>

                        {collapse?.includes(item?.layout) && (
                          <div className="flex-1 min-h-0 overflow-y-auto mb-3">
                            {data?.children}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })}
      </div>
    );
  },
);

FileLayout.displayName = "FileLayout";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    isDisable: state?.patientDetailsReducer?.isDisable,
  }),
  {
    setAddModaOpen: patientDetailsAction?.setAddModaOpen,
  },
);

export default connector(FileLayout);
