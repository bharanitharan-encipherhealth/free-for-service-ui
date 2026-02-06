import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { getStorage } from "@/util/storage";
import { Button } from "antd";
import React from "react";
import { connect, ConnectedProps } from "react-redux";

import style from "./style.module.css";

type YearStatusReduxType = ConnectedProps<typeof connector>;
function YearStatus({
  patientDiseaseDetails,
  patientDiseaseLoading,
}: YearStatusReduxType) {
  const userRole = getStorage("userRole");
  const workFlowData = patientDiseaseDetails?.workflow?.[0];

  return patientDiseaseLoading ? (
    <div>Loading</div>
  ) : (
    patientDiseaseDetails && (
      <>
        {userRole?.toLowerCase === "admin" ||
          (userRole?.toLowerCase() === "tenant_admin" && (
            <div>
              <Button className={`${style?.allocateBgColor}`}>
                {workFlowData?.allocatedOn ? "ALLOCATED" : "ALLOCATE"}
              </Button>
            </div>
          ))}
      </>
    )
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    patientDiseaseLoading:
      state?.patientDetailsReducer?.patientDiseaseDetailsLoading,
  }),
);

export default connector(YearStatus);
