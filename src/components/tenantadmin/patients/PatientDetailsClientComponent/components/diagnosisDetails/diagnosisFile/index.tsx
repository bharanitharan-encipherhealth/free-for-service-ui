import React, { useMemo, useState } from "react";
import FileLayout from "../components/fileLayout";
import { DiagnosisDetailsPropsType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import { DiseaseItem } from "@/models/tenantadmin/patients/details";
import { connect, ConnectedProps } from "react-redux";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import HccCard from "../components/hccCard";
import { getDiseaseData } from "../components/function/reusabelFunction";
import Filter from "../../filter";
import DiseaseOverlay from "../components/hccCard/diseaseOverlay";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { onDragEndDisease } from "../../function/reusableFunction";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";

type DiagnosisFileReduxType = ConnectedProps<typeof connector>;

type DiagnosisFileType = DiagnosisDetailsPropsType & DiagnosisFileReduxType;
function DiagnosisFile({
  collapse,
  setCollapse,
  patientDiseaseDetails,
  activeTab,
  setDndConfrim,
  setMovingData,
}: DiagnosisFileType) {
  const [activeItem, setActiveItem] = useState<DiseaseItem | null>(null);
  const [activeCardTitle, setActiveCardTitle] = useState<string | null>(null);
  const diseaseCategories = useMemo(
    () => [
      {
        id: 1,
        cardTitle: "Diagnosis",
        children: (
          <HccCard
            diseaseData={getDiseaseData({
              diseaseList: patientDiseaseDetails?.hccDiseases,
              activeTab: activeTab || 0,
              diseaseType: "hccDiseases",
            })}
            cardTitle="Diagnosis"
            dragId="diagnosis"
          />
        ),
        length: getDiseaseData({
          diseaseList: patientDiseaseDetails?.hccDiseases,
          activeTab: activeTab || 0,
          diseaseType: "hccDiseases",
        })?.length,
        layout: "hccLayout",
        dropId: "diagnosis",
      },
      {
        id: 2,
        cardTitle: "Delete",
        children: (
          <HccCard
            diseaseData={getDiseaseData({
              diseaseList: patientDiseaseDetails?.deletedDiseases,
              activeTab: activeTab || 0,
              diseaseType: "deletedDiseases",
            })}
            cardTitle="Delete"
            dragId="delete"
          />
        ),
        length: getDiseaseData({
          diseaseList: patientDiseaseDetails?.deletedDiseases,
          activeTab: activeTab || 0,
          diseaseType: "deletedDiseases",
        })?.length,
        layout: "deletedLayout",
        dropId: "delete",
      },
    ],
    [patientDiseaseDetails, activeTab],
  );
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={(e: DragStartEvent) => {
        const data = e.active.data.current as {
          item: DiseaseItem;
          cardTitle: string;
        } | null;
        if (data) {
          setActiveItem(data.item);
          setActiveCardTitle(data.cardTitle);
        }
      }}
      onDragEnd={(e: DragEndEvent) => {
        const { active, over } = e;
        onDragEndDisease({ active, over, setDndConfrim, setMovingData });
      }}
      onDragCancel={() => {
        setActiveItem(null);
        setActiveCardTitle(null);
      }}
    >
      <div className="h-full w-full flex">
        <div className="content w-full">
          <FileLayout
            collapse={collapse}
            setCollapse={setCollapse}
            diseaseCategories={diseaseCategories}
            activeTab={activeTab}
          />
        </div>
        {activeTab == 1 && <Filter />}
      </div>
      <DragOverlay>
        {activeItem && activeCardTitle ? (
          <DiseaseOverlay item={activeItem} cardTitle={activeCardTitle} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
  }),
  {
    setDndConfrim: patientDetailsAction?.setDropConfirm,
    setMovingData: patientDetailsAction?.setMovingData,
  },
);

export default connector(DiagnosisFile);
