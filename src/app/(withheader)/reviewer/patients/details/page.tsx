import PatientDetailsClientComponent from "@/components/tenantadmin/patients/PatientDetailsClientComponent";
import React, { Suspense } from "react";

export default function ReviewerPatientsDetails() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <PatientDetailsClientComponent />
    </Suspense>
  );
}
