import { Checkbox, Empty, Popover, Select, Skeleton, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { usePathname } from "next/navigation";
import { IoFilterOutline } from "react-icons/io5";
import style from "../../style.module.css";
import {
  getBadgeClassName,
  splitUserName,
} from "../diagnosisDetails/components/function/reusabelFunction";
import { BsInfoCircleFill } from "react-icons/bs";
import { timeLineDateAndTime } from "@/util/reusableFunction";
import { timeLineContentType } from "@/models/tenantadmin/patients/details";
import commanStyle from "@/styles/comman.style.module.css";
import { actions as usersAction } from "@/state/tenantadmin/users";
import UserReducerType from "@/state/tenantadmin/users/model";
import { getHtmlContent, getTimelineHeading } from "../function";

type TimeLineRedux = ConnectedProps<typeof connector>;

const Timeline = React.memo(
  ({
    getTimeLineData,
    selectedDos,
    admissionNumber,
    timeListDataLoading,
    timeListData,
    getAllRole,
    allRoleData,
    getTimeLineAction,
    actionListData,
  }: TimeLineRedux) => {
    const pathName = usePathname();
    const currentFileView = pathName.endsWith("/tenantadmin/patientdetails")
      ? "NORMAL_PATIENTS_VIEW"
      : pathName.endsWith("/patients/details")
        ? "WORK_QUEUE_VIEW"
        : pathName.endsWith("/queried/details")
          ? "QUERIED_VIEW"
          : pathName.endsWith("/reassign/details")
            ? "RE_ASSIGN_VIEW"
            : "NORMAL_PATIENTS_VIEW";

    const [isViewAll, setIsViewAll] = useState<boolean>(false);
    const [popClickDisCode, setPopClickDisCode] = useState<number | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [role, setRole] = useState<string>("");
    const [action, setAction] = useState<string>("");
    const allRoles = useMemo(() => {
      return allRoleData
        ?.filter((item) => item?.aliasName?.toLowerCase() !== "admin")
        ?.map((item) => ({
          value: item?.aliasName,
          label: item?.roleName?.split("_")?.join(" "),
        }));
    }, [allRoleData]);

    const allAction = useMemo(() => {
      return actionListData?.map((item) => ({
        value: item,
        label: item?.replace(/_/g, " "),
      }));
    }, [actionListData]);

    // const getMeatEditDeatils = useCallback(
    //   ({ viewValue }: { viewValue: timeLineContentType }) => {
    //     const sectionMapArr = (
    //       <>
    //         <div className="flex justify-end">
    //           <IoMdCloseCircle
    //             className={styles.deleteIcon}
    //             onClick={() => {
    //               setIsPopupOpen(false);
    //               setPopClickDisCode(null);
    //             }}
    //           />
    //         </div>
    //         <div className={styles.detailsContainer}>
    //           <div className={styles.oldCodeContiner}>
    //             <span className={styles.codeTitle}>OLD</span>
    //             <div className={styles.details}>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>
    //                   {" "}
    //                   {viewValue?.previousMeatDetail?.diagnosisCode}
    //                 </span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.previousMeatDetail?.diseaseName}
    //                 </span>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Provider</span>
    //                 <div>
    //                   {renderProviderSection({
    //                     capture: viewValue?.previousMeatDetail?.providerNames,
    //                     sectionName: "providerSection",
    //                     hyperlinkKey: "header",
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Encounter Date</span>
    //                 <div>
    //                   {renderProviderSection({
    //                     capture: viewValue?.previousMeatDetail?.dateOfService,
    //                     sectionName: "dateSection",
    //                     hyperlinkKey: "dateOfService",
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Monitor</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.previousMeatDetail?.monitorAspect}
    //                 </span>
    //                 <div>
    //                   {renderProviderSection({
    //                     capture: viewValue?.previousMeatDetail?.monitorHyperLink,
    //                     sectionName: "captureSection",
    //                     hyperlinkKey: "dateOfService",
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Evaluate</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.previousMeatDetail?.evaluateAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.previousMeatDetail?.evaluateHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Assessment</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.previousMeatDetail?.assessmentAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.previousMeatDetail?.assessmentHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Treatment</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.previousMeatDetail?.treatmentAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.previousMeatDetail?.treatmentHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className={styles.editCodeContainer}>
    //             <span className={styles.editTitle}>NEW</span>
    //             <div className={styles.details}>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>
    //                   {" "}
    //                   {viewValue?.changedMeatDetail?.diagnosisCode}
    //                 </span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.changedMeatDetail?.diseaseName}
    //                 </span>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Provider</span>
    //                 <div>
    //                   {getProviderNameTagList({
    //                     data: viewValue?.changedMeatDetail?.providerNames,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Encounter Date</span>
    //                 <div>
    //                   {getDateOfServiceBackground({
    //                     value: viewValue?.changedMeatDetail?.dateOfService,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Monitor</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.changedMeatDetail?.monitorAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.changedMeatDetail?.monitorHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Evaluate</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.changedMeatDetail?.evaluateAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.changedMeatDetail?.evaluateHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Assessment</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.changedMeatDetail?.assessmentAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.changedMeatDetail?.assessmentHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //               <div className={styles.detailsHeader}>
    //                 <span className={styles.disCode}>Treatment</span>
    //                 <span className={styles.discription}>
    //                   {viewValue?.changedMeatDetail?.treatmentAspect}
    //                 </span>
    //                 <div>
    //                   {getSectionHeadersBackground({
    //                     value: viewValue?.changedMeatDetail?.treatmentHyperLink,
    //                   })}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     );

    //     return sectionMapArr;
    //   },
    //   [timeListData],
    // );

    const getTimelineList = useCallback(async () => {
      await getTimeLineData({
        dos: isViewAll ? "" : selectedDos || "",
        admissionNumber,
        currentFileView,
        role,
        action,
      });
    }, [
      getTimeLineData,
      selectedDos,
      admissionNumber,
      currentFileView,
      isViewAll,
      role,
      action,
    ]);

    const renderTimeLineList = useCallback(
      ({ item, index }: { item: timeLineContentType; index: number }) => {
        return (
          <li key={item?.id} id={`tooltip-username-${index}`}>
            <Tooltip
              id="tooltip-username"
              title={item.userName}
              placement="bottom"
            >
              <Popover placement="bottom">
                <div
                  className={getBadgeClassName({ item })}
                  id={`user-timeline${index}`}
                >
                  {splitUserName({ name: item.userName })}
                </div>
              </Popover>
            </Tooltip>

            <div className="timeline-panel">
              <div className="flex justify-between">
                <div>
                  {item?.fullName}{" "}
                  {item?.aliasName
                    ? `(${item?.aliasName?.split("_")?.join(" ")})`
                    : ""}
                </div>

                {item?.comment && (
                  <div>
                    <Popover content={item?.comment} placement="bottom">
                      <BsInfoCircleFill
                        style={{ color: "blue", fontSize: "16px" }}
                      />
                    </Popover>
                  </div>
                )}
              </div>

              <span className={`${commanStyle.timelineheading} flex`}>
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
              <div>
                {item?.dos && (
                  <span className="text-muted mt-1">{`DOS: ${item?.dos}`}</span>
                )}
              </div>

              {item?.educationalError && (
                <div className="flex items-end justify-end">
                  <span
                    className={` rounded-1 flex  items-center justify-center p-3 ${commanStyle.error}`}
                  >
                    EDU Error
                  </span>
                </div>
              )}
              <div className="flex items-end justify-between mt-2">
                <div
                  style={{ fontSize: "11px" }}
                  className="flex text-muted items-end justify-end mt-1"
                >
                  {timeLineDateAndTime({ inputDate: item?.createdDate })}
                </div>
              </div>
            </div>
          </li>
        );
      },
      [
        timeListData,
        getTimelineList,
        popClickDisCode,
        setIsPopupOpen,
        setPopClickDisCode,
        isPopupOpen,
      ],
    );

    const getRoles = useCallback(async () => {
      await getAllRole();
      await getTimeLineAction();
    }, [getAllRole, getTimeLineAction]);

    useEffect(() => {
      getTimelineList();
    }, [role, action]);

    useEffect(() => {
      getRoles();
    }, []);
    return (
      <div className="px-2">
        <div className="flex justify-end gap-4 items-center">
          <div className="flex gap-2">
            <label>All</label>
            <Checkbox
              className="custom-checkbox"
              checked={isViewAll}
              onChange={(e) => setIsViewAll(e?.target?.checked)}
            />
          </div>
          <div className={`${style?.timelineFilter} p-1 rounded-lg`}>
            <IoFilterOutline className="text-lg font-bold" />
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`flex gap-3 w-full border ${style?.workqueueBorderColor} p-3 rounded-lg`}
          >
            <div className="w-50 flex flex-col gap-2">
              <label className="font-bold px-1">Role</label>
              <Select
                placeholder="Select Role"
                options={allRoles}
                onChange={(e) => setRole(e)}
                allowClear
              />
            </div>
            <div className="w-50 flex flex-col gap-2">
              <label className="font-bold px-1">Event Type</label>
              <Select
                placeholder="Select Event Type"
                options={allAction}
                onChange={(e) => setAction(e)}
                allowClear
              />
            </div>
          </div>

          <div>
            {timeListDataLoading ? (
              <div className="flex flex-col gap-4 my-2">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton.Input key={i} active block />
                ))}
              </div>
            ) : (
              <div
                className={`my-2 widget-timeline ${timeListData?.length === 0 ? "no-timeline-line" : ""}`}
              >
                <ul className="timeline">
                  {timeListData?.length > 0 ? (
                    timeListData?.map((item, index) =>
                      renderTimeLineList({ item, index }),
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
        </div>
      </div>
    );
  },
);

Timeline.displayName = "Timeline";

const connector = connect(
  (state: {
    patientDetailsReducer: patinetDetailsReducerType;
    userReducer: UserReducerType;
  }) => ({
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    timeListData:
      state?.patientDetailsReducer?.timelineList?.data?.response?.content,
    timeListDataLoading: state?.patientDetailsReducer?.timelineListLoading,
    allRoleData: state?.userReducer?.alluserRoleList?.data?.response?.content,
    actionListData:
      state?.patientDetailsReducer?.timelineActionData?.data?.response,
  }),
  {
    getTimeLineData: patientDetailsAction?.getTimelineList,
    getAllRole: usersAction?.getRole,
    getTimeLineAction: patientDetailsAction?.getAction,
  },
);

export default connector(Timeline);
