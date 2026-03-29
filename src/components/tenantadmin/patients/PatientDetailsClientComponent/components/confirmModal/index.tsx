"use client";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { Modal } from "antd";
import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { suggestedMeatCheck } from "@/state/tenantadmin/patients/details/network";
import CustomSelect from "@/components/customSelect";
import { optionsTypes } from "@/state/reusableTypes";
import {
  commentSectionList,
  onDiseaseMove,
} from "../function/reusableFunction";

type ConfirmModalRedux = ConnectedProps<typeof connector> & {
  getPatientDiseaseDetails: ({ dos }: { dos: string }) => void;
};
const ConfirmModal = React.memo(
  ({
    dndConfirm,
    setDndConfrim,
    moveData,
    selectedPatientYear,
    selectedDos,
    setPageLoading,
    admissionNumber,
    getPatientDiseaseDetails,
    setMeatModal,
    setEditDiseaseList,
    setMovingData,
  }: ConfirmModalRedux) => {
    const [commentSection, setCommentSection] =
      useState<optionsTypes[]>(commentSectionList);
    const [selectedComments, setSelectedComments] = useState("");

    const onCloseModal = useCallback(() => {
      setDndConfrim(false);
      setSelectedComments("");
      setMovingData(null);
      setEditDiseaseList(null);
    }, [
      dndConfirm,
      setDndConfrim,
      selectedComments,
      setEditDiseaseList,
      setMovingData,
    ]);

    const onConfirmMove = useCallback(async () => {
      if (moveData) {
        const { data } = moveData;

        const result = await suggestedMeatCheck({
          diagnosisCode: data?.diagnosisCode,
        });
        if (result?.response && moveData?.dropId === "diagnosis") {
          setEditDiseaseList({ ...moveData?.data, comments: selectedComments });
          setMeatModal({ isMeatEdit: true });
          onCloseModal();
        } else {
          onDiseaseMove({
            comment: selectedComments,
            processedYear: selectedPatientYear,
            selectedDos,
            moveData,
            setPageLoading,
            onCloseModal,
            admissionNumber,
            getPatientDiseaseDetails,
          });
        }
      }
    }, [
      moveData,
      selectedComments,
      selectedPatientYear,
      selectedDos,
      setPageLoading,
      onCloseModal,
      admissionNumber,
      getPatientDiseaseDetails,
      setMeatModal,
      setEditDiseaseList,
    ]);

    return (
      <>
        <Modal
          title={
            <span className="capitalize">{`Are You Sure Do You Want to Move to ${moveData?.dropId}`}</span>
          }
          open={dndConfirm}
          centered
          onOk={onConfirmMove}
          onCancel={onCloseModal}
          okButtonProps={{ disabled: !selectedComments }}
        >
          <div className="my-1">
            <label>
              Reason <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={commentSection}
              onChange={(val) => {
                setSelectedComments(val || "");
              }}
              setOptions={setCommentSection}
              placeholder="Select The Comments"
              size="middle"
              value={selectedComments || ""}
            />
          </div>
        </Modal>
      </>
    );
  },
);

ConfirmModal.displayName = "ConfirmModal";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    dndConfirm: state?.patientDetailsReducer?.setDropConfirm,
    moveData: state?.patientDetailsReducer?.setMovingData,
    selectedPatientYear: state?.patientDetailsReducer?.setPatientOverallYear,
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
  }),
  {
    setDndConfrim: patientDetailsAction?.setDropConfirm,
    setPageLoading: patientDetailsAction?.setPageLoading,
    setMeatModal: patientDetailsAction?.setAddModaOpen,
    setEditDiseaseList: patientDetailsAction?.setEditDiseaseList,
    setMovingData: patientDetailsAction?.setMovingData,
  },
);
export default connector(ConfirmModal);
