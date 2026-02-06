import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { Empty, Popconfirm, Skeleton, Tooltip } from "antd";
import { timeLineContentType } from "@/models/tenantadmin/patients/details";
import { getBadgeClassName } from "../diagnosisDetails/components/function/reusabelFunction";
import { IoHomeOutline } from "react-icons/io5";
import { formatDateTime } from "@/util/reusableFunction";
import commanStyle from "@/styles/comman.style.module.css";
import { getHtmlContent, getTimelineHeading } from "../function";

type VersionHistoryReduxType = ConnectedProps<typeof connector>;
const VersionHistory = React.memo(
  ({
    getVersionHistoryAction,
    selectedDos,
    admissionNumber,
    versionHistoryData,
    versionHistoryLoading,
  }: VersionHistoryReduxType) => {
    const [popClickDisCode, setPopClickDisCode] = useState<number | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const getVersionHistory = useCallback(async () => {
      await getVersionHistoryAction({ dos: selectedDos, admissionNumber });
    }, [selectedDos, getVersionHistoryAction, admissionNumber]);

    const renderVersionHistory = useCallback(
      ({ item, index }: { item: timeLineContentType; index: number }) => {
        return (
          <li key={index} id={`tooltip-username-${index}`}>
            <Tooltip
              title={
                item?.revertHistory === -1
                  ? "Base Version"
                  : item?.revertHistory === 0
                    ? "Initial Version"
                    : ""
              }
            >
              <div
                className={`cursor-pointer ${getBadgeClassName({ item })} font-bold text-xl flex justify-center items-center`}
                id={`user-timeline${index} `}
              >
                {item?.revertHistory === -1 ? (
                  "B"
                ) : item?.revertHistory === 0 ? (
                  <IoHomeOutline className="text-xl leading-none" />
                ) : (
                  item?.revertHistory
                )}
              </div>
            </Tooltip>
            {!item?.isCurrentVersion ? (
              <Popconfirm
                title="Confirm Revert to this Version"
                className="custom-pop"
                placement="top"
                okText="Yes"
                cancelText="No"
              >
                <div className="timeline-panel cr-pointer text-muted">
                  <span
                    className={`${commanStyle.timelineheading} ant-badge cursor-pointer d-flex`}
                  >
                    {item?.htmlContent
                      ? getHtmlContent({ htmlContent: item?.htmlContent })
                      : getTimelineHeading({
                          item,
                          index,
                          popClickDisCode,
                          setIsPopupOpen,
                          setPopClickDisCode,
                          isPopupOpen,
                        })}
                  </span>
                  {item?.dos && (
                    <span className={`${commanStyle.timelineDate} mt-1`}>
                      {`DOS: ${item?.dos}`}
                    </span>
                  )}
                  <span className={commanStyle.timelineDate}>
                    {formatDateTime({ date: item.createdDate })}
                  </span>
                </div>
              </Popconfirm>
            ) : (
              <div
                className="timeline-panel text-muted"
                style={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                <span
                  className={`${commanStyle.timelineheading} ant-badge d-flex`}
                >
                  {item?.htmlContent
                    ? getHtmlContent({ htmlContent: item?.htmlContent })
                    : getTimelineHeading({
                        item,
                        index,
                        popClickDisCode,
                        setIsPopupOpen,
                        setPopClickDisCode,
                        isPopupOpen,
                      })}
                </span>
                {item?.dos && (
                  <span className={`${commanStyle.timelineDate} mt-1`}>
                    {`DOS: ${item?.dos}`}
                  </span>
                )}
                <span className={commanStyle.timelineDate}>
                  {formatDateTime({ date: item.createdDate })}
                </span>
              </div>
            )}
          </li>
        );
      },
      [
        versionHistoryData,
        popClickDisCode,
        setIsPopupOpen,
        setPopClickDisCode,
        isPopupOpen,
      ],
    );
    useEffect(() => {
      getVersionHistory();
    }, []);

    console.log(versionHistoryData, "versionHistoryData");

    return (
      <div>
        {versionHistoryLoading ? (
          <div className="flex flex-col gap-4 my-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton.Input key={i} active block />
            ))}
          </div>
        ) : (
          <div
            className={`my-2 widget-timeline ${versionHistoryData?.length === 0 ? "no-timeline-line" : ""}`}
          >
            <ul className="timeline">
              {versionHistoryData?.length > 0 ? (
                versionHistoryData?.map((item, index) =>
                  renderVersionHistory({ item, index }),
                )
              ) : (
                <div className="no-data-container">
                  <h6 className="text-center">
                    <Empty />
                  </h6>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    versionHistoryData:
      state?.patientDetailsReducer?.getVersionHistory?.data?.response,
    versionHistoryLoading:
      state?.patientDetailsReducer?.getVersionHistoryloading,
  }),
  {
    getVersionHistoryAction: patientDetailsAction?.getVersionHistory,
  },
);

export default connector(VersionHistory);

VersionHistory.displayName = "VersionHistory";
