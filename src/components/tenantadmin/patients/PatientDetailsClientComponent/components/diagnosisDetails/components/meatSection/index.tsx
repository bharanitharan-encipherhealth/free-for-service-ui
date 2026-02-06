import { MeatSectionType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import React, { useMemo } from "react";
import { connect, ConnectedProps } from "react-redux";
import { generateMeatCriteriaList } from "../function/reusabelFunction";
import { renderMeatFound } from "../function/renderingFunction";
import { MeatCriteriaItem } from "@/models/tenantadmin/patients/details";

type MeatSectionReduxType = ConnectedProps<typeof connector>;
type MeatSectionPropsType = MeatSectionType & MeatSectionReduxType;
function MeatSection({
  meatDetails,
  patientDiseaseDetails,
}: MeatSectionPropsType) {
  console.log(meatDetails, "MeatSectionType");

  const meatCriteriaList = useMemo(
    () =>
      generateMeatCriteriaList<MeatCriteriaItem>({
        meatList: [
          ...(patientDiseaseDetails?.meatCriteria || []),
          ...(patientDiseaseDetails?.deletedMeatCriteria || []),
        ],
      }),
    [patientDiseaseDetails],
  );

  const meatAvatarList = ["M", "E", "A", "T"];

  return (
    <div className="flex gap-2">
      {meatAvatarList?.map((item, index) => (
        <div key={index}>
          {renderMeatFound({
            meatList: meatCriteriaList,
            code: meatDetails?.diagnosisCode,
            value: item,
          })}
        </div>
      ))}
    </div>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
  }),
  {},
);

export default connector(MeatSection);
