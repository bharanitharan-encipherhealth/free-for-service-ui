import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { getStorage } from "@/util/storage";
import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Skeleton,
  Spin,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import style from "../yearStatus/style.module.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { usePathname } from "next/navigation";
import { dosStatusAction } from "@/state/tenantadmin/patients/details/network";

const { TextArea } = Input;
type DosStatusActionRedux = ConnectedProps<typeof connector> & {
  getPatientDosCall: () => void;
  getPatientDiseaseDetails: ({ dos }: { dos: string }) => void;
};
const DosStatusAction = React.memo(
  ({
    patientDiseaseDetails,
    patientDiseaseLoading,
    selectedPatientYear,
    selectedDos,
    admissionNumber,
    getPatientDosCall,
    getPatientDiseaseDetails,
    isDisable,
  }: DosStatusActionRedux) => {
    const userRole = getStorage("userRole");

    const pathname = usePathname();

    const [selectedKey, setSelectedKey] = useState<string>("");

    const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [reasonValue, setReasonValue] = useState<string>("");

    const [pendingModalOpen, setPendingModalOpen] = useState<boolean>(false);

    const workFlowData = patientDiseaseDetails?.workflow?.[0];

    const isDisabledStatus = useMemo(() => isDisable?.isYearWise, [isDisable]);

    const handleCompleteAction = useCallback(() => {
      setSubmitModalOpen(true);
    }, [workFlowData, submitModalOpen]);

    const handlePendingAction = useCallback(() => {
      setPendingModalOpen(true);
    }, [workFlowData, pendingModalOpen]);

    const items: MenuProps["items"] = useMemo(() => {
      const status = workFlowData?.status?.toLowerCase();
      const menuItems: MenuProps["items"] = [];

      if (status !== "pending") {
        menuItems.push({
          key: "2",
          label: "Pending",
          onClick: () => handlePendingAction(),
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
    }, [workFlowData, isDisabledStatus]);

    const status = useMemo(() => workFlowData?.status, [workFlowData]);

    const onClearValue = useCallback(() => {
      setIsLoading(false);
      setReasonValue("");
      setSubmitModalOpen(false);
      setPendingModalOpen(false);
    }, []);

    const updateStatus = useCallback(
      async ({ status }: { status: string }) => {
        const roleId = getStorage("roleId");
        const patientId = getStorage("patientId");
        setIsLoading(true);
        const isTinDetailsPage = pathname.endsWith("/tindetails/masteraudit");
        const masterAudit = isTinDetailsPage ? true : false;

        let payload: {
          patientId: string;
          notes: string;
          processedYear: number;
          dateOfService: string;
          roleId: string;
          processedStatus: string;
          masterAudit: boolean;
          admNo?: string;
        } = {
          patientId,
          notes: reasonValue,
          processedYear: selectedPatientYear,
          dateOfService: selectedDos,
          roleId,
          processedStatus: status?.toUpperCase(),
          masterAudit,
        };

        if (admissionNumber?.patientType?.toLowerCase() === "inpatient") {
          payload = { ...payload, admNo: admissionNumber?.admNo };
        }

        try {
          const res = await dosStatusAction({ payload });
          if (res?.status === "SUCCESS") {
            onClearValue();
            if (payload?.processedStatus?.toLowerCase() === "completed")
              getPatientDosCall();
            else getPatientDiseaseDetails({ dos: selectedDos });
          }
        } catch (e) {
          console.error(e, "while calling the dos status action");
        }
      },
      [
        pathname,
        reasonValue,
        selectedPatientYear,
        selectedDos,
        admissionNumber,
        getPatientDosCall,
        getPatientDiseaseDetails,
      ],
    );

    const onConfirmCompleteAction = useCallback(async () => {
      await updateStatus({ status: "completed" });
    }, [updateStatus]);

    const onConfirmPendingAction = useCallback(async () => {
      await updateStatus({ status: "pending" });
    }, [updateStatus]);

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

    return (
      patientDiseaseDetails && (
        <>
          {userRole?.toLowerCase() === "coder_1" ||
          userRole?.toLowerCase() === "coder_2" ||
          userRole?.toLowerCase() === "qa" ? (
            <div>
              <Dropdown
                className=""
                trigger={["click"]}
                menu={{ items, selectedKeys: [selectedKey], selectable: true }}
                overlayClassName={style?.[`${overlayClassName}Overlay`]}
                disabled={isDisabledStatus}
              >
                <Button
                  className={`${style?.[`${status?.toLowerCase()}BgColor`]} rounded p-2 ${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  {status}
                  {patientDiseaseLoading || isLoading ? (
                    <Spin size="small" />
                  ) : (
                    <MdOutlineKeyboardArrowDown />
                  )}
                </Button>
              </Dropdown>
            </div>
          ) : null}

          {/* complete Modal */}
          <Modal
            title="Are You Sure You Want to Complete This Task"
            open={submitModalOpen}
            onCancel={() => onClearValue()}
            confirmLoading={isLoading}
            onOk={onConfirmCompleteAction}
          />

          {/* pendong modal */}
          <Modal
            centered
            open={pendingModalOpen}
            onCancel={onClearValue}
            onOk={onConfirmPendingAction}
            confirmLoading={isLoading}
          >
            <label>
              Reason <span className="text-red-500">*</span>
            </label>

            <TextArea
              placeholder="Enter The Reason..."
              onChange={(e) => setReasonValue(e?.target?.value)}
              rows={4}
              value={reasonValue}
            />
          </Modal>
        </>
      )
    );
  },
);

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    patientDiseaseLoading:
      state?.patientDetailsReducer?.patientDiseaseDetailsLoading,
    selectedPatientYear: state?.patientDetailsReducer?.setPatientOverallYear,
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    isDisable: state?.patientDetailsReducer?.isDisable,
  }),
  {},
);

export default connector(DosStatusAction);

DosStatusAction.displayName = "DosStatusAction";
