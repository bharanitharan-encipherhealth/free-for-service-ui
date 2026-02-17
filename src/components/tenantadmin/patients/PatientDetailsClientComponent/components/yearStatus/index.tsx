import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { getStorage } from "@/util/storage";
import { Button, Dropdown, MenuProps, Modal, Skeleton } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import style from "./style.module.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { usePathname } from "next/navigation";
import { overallStatusUpdate } from "@/state/tenantadmin/patients/details/network";
import { getResponePopup } from "@/util/reusableFunction";

type YearStatusReduxType = ConnectedProps<typeof connector> & {
  getPatientDetails: ({ patientId }: { patientId: string }) => void;
};
const YearStatusAction = React.memo(
  ({
    patientDetails,
    patientDetailsLoading,
    getPatientDetails,
  }: YearStatusReduxType) => {
    const pathname = usePathname();

    const userRole = getStorage("userRole");
    const workFlowData = patientDetails?.workflow?.[0];

    const status = useMemo(() => workFlowData?.status, [workFlowData]);

    const [selectedKey, setSelectedKey] = useState<string>("");

    const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCompleteAction = useCallback(() => {
      setSubmitModalOpen(true);
    }, [workFlowData, submitModalOpen]);

    const items: MenuProps["items"] = useMemo(() => {
      const status = workFlowData?.status?.toLowerCase();
      const menuItems: MenuProps["items"] = [];

      if (status !== "pending") {
        menuItems.push({
          key: "2",
          label: "Pending",
        });
      }

      if (status !== "completed") {
        menuItems.push({
          key: "4",
          label: "Complete",
          onClick: () => handleCompleteAction(),
        });
      }

      return menuItems;
    }, [workFlowData]);

    const onClearValue = useCallback(() => {
      setIsLoading(false);
      setSubmitModalOpen(false);
    }, []);

    const updateStatus = useCallback(
      async ({ status }: { status: string }) => {
        setIsLoading(true);
        const isTinDetailsPage = pathname.endsWith("/tindetails/masteraudit");
        const masterAudit = isTinDetailsPage ? true : false;
        const patientId = getStorage("patientId");
        const roleId = getStorage("roleId");

        const payload: {
          patientId: string;
          roleId: string;
          processedStatus: string;
          masterAudit: boolean;
        } = {
          patientId,
          roleId,
          processedStatus: status?.toUpperCase(),
          masterAudit,
        };

        try {
          const res = await overallStatusUpdate({ payload });
          if (res?.status === "SUCCESS") {
            onClearValue();
            getResponePopup(res);
            getPatientDetails({ patientId });
          } else {
            getResponePopup(res);
            onClearValue();
          }
        } catch (e) {
          console.error(e, "While Calling the Overall status");
        }
      },
      [pathname, getPatientDetails],
    );

    useEffect(() => {
      const callUseEffect = () => {
        const key =
          workFlowData?.status?.toLowerCase() === "pending"
            ? "2"
            : workFlowData?.status?.toLowerCase() === "completed"
              ? "4"
              : "";
        setSelectedKey(key);
      };
      callUseEffect();
    }, [workFlowData]);

    const overlayClassName = useMemo(
      () =>
        workFlowData?.status?.toLowerCase() === "pending"
          ? "completed"
          : workFlowData?.status?.toLowerCase() === "completed"
            ? "pending"
            : "",
      [workFlowData],
    );

    return patientDetailsLoading ? (
      <div>
        <Skeleton.Input />
      </div>
    ) : (
      patientDetails && (
        <>
          {userRole?.toLowerCase() === "admin" ||
          userRole?.toLowerCase() === "tenant_admin" ? (
            <div>
              <Button className={`${style?.allocateBgColor}`}>
                {workFlowData?.allocatedOn ? "ALLOCATED" : "ALLOCATE"}
              </Button>
            </div>
          ) : (
            <div>
              <Dropdown
                menu={{ items, selectedKeys: [selectedKey], selectable: true }}
                className=""
                trigger={["click"]}
                overlayClassName={style?.[`${overlayClassName}Overlay`]}
                disabled={workFlowData?.status?.toLowerCase() === "completed"}
              >
                <Button
                  className={`${style?.[`${status?.toLowerCase()}BgColor`]} rounded p-2`}
                >
                  {status}
                  <MdOutlineKeyboardArrowDown />
                </Button>
              </Dropdown>
            </div>
          )}

          {/* complete Modal */}
          <Modal
            title="Are You Sure You Want to Complete This Task"
            open={submitModalOpen}
            onCancel={() => onClearValue()}
            confirmLoading={isLoading}
            onOk={() => updateStatus({ status: "COMPLETED" })}
          />
        </>
      )
    );
  },
);

YearStatusAction.displayName = "YearStatusAction";
const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDetails:
      state?.patientDetailsReducer?.patientOverallDetails?.data?.response,
    patientDetailsLoading:
      state?.patientDetailsReducer?.patietOverallDetailsLoading,
  }),
);

export default connector(YearStatusAction);
