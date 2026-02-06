import PatientDetailsClientComponent from "@/components/tenantadmin/patients/PatientDetailsClientComponent";
import { Suspense } from "react";
export default function PatientDetails() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <PatientDetailsClientComponent />
    </Suspense>
  );
}
