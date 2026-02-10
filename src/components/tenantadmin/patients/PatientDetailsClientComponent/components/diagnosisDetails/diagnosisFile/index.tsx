import React, { useEffect, useMemo } from "react";
import FileLayout from "../components/fileLayout";
import { DiagnosisDetailsPropsType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import { connect, ConnectedProps } from "react-redux";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import HccCard from "../components/hccCard";
import { getDiseaseData } from "../components/function/reusabelFunction";
import Filter from "../../filter";


type DiagnosisFileReduxType = ConnectedProps<typeof connector>;

type DiagnosisFileType = DiagnosisDetailsPropsType & DiagnosisFileReduxType;
function DiagnosisFile({
  collapse,
  setCollapse,
  patientDiseaseDetails,
  activeTab,
}: DiagnosisFileType) {
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
          />
        ),
        length: getDiseaseData({
          diseaseList: patientDiseaseDetails?.hccDiseases,
          activeTab: activeTab || 0,
          diseaseType: "hccDiseases",
        })?.length,
        layout: "hccLayout",
      },
      {
        id: 2,
        cardTitle: "Care Gap",
        children: (
          <HccCard
            diseaseData={getDiseaseData({
              diseaseList: patientDiseaseDetails?.suggestedHccDiseases,
              activeTab: activeTab || 0,
              diseaseType: "suggestedHccDiseases",
            })}
            cardTitle="CargeGap"
          />
        ),
        length: getDiseaseData({
          diseaseList: patientDiseaseDetails?.suggestedHccDiseases,
          activeTab: activeTab || 0,
          diseaseType: "suggestedHccDiseases",
        })?.length,
        layout: "careGapLayout",
      },
      {
        id: 3,
        cardTitle: "Suggested",
        children: (
          <HccCard
            diseaseData={getDiseaseData({
              diseaseList: patientDiseaseDetails?.potentialDiseases,
              activeTab: activeTab || 0,
              diseaseType: "potentialDiseases",
            })}
            cardTitle="Suggested"
          />
        ),
        length: getDiseaseData({
          diseaseList: patientDiseaseDetails?.potentialDiseases,
          activeTab: activeTab || 0,
          diseaseType: "potentialDiseases",
        })?.length,
        layout: "potentialLayout",
      },
      {
        id: 4,
        cardTitle: "Delete",
        children: (
          <HccCard
            diseaseData={getDiseaseData({
              diseaseList: patientDiseaseDetails?.potentialDiseases,
              activeTab: activeTab || 0,
              diseaseType: "potentialDiseases",
            })}
            cardTitle="Delete"
          />
        ),
        length: getDiseaseData({
          diseaseList: patientDiseaseDetails?.potentialDiseases,
          activeTab: activeTab || 0,
          diseaseType: "potentialDiseases",
        })?.length,
        layout: "deletedLayout",
      },
    ],
    [patientDiseaseDetails, activeTab],
  );

  return (
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
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
  }),
  {
   
  },
);

export default connector(DiagnosisFile);
