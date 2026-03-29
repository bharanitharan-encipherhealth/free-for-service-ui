import React from "react";
import DiagnosisFile from "./diagnosisFile";
import { DiagnosisDetailsPropsType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import MeatCreteria from "../meatCreteria";

export default function DiagnosisDetails({
  collapse,
  setCollapse,
  activeTab,
}: DiagnosisDetailsPropsType) {
  return (
    <div className="h-full w-full ">
      {(activeTab === 1 || activeTab === 2) && (
        <DiagnosisFile
          collapse={collapse}
          setCollapse={setCollapse}
          activeTab={activeTab}
        />
      )}
      {activeTab === 3 && <MeatCreteria />}
    </div>
  );
}
