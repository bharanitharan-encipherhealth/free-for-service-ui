"use client";
import { getStorage } from "@/util/storage";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";

type PatientDetailsReduxType = ConnectedProps<typeof connector>;

function PatientDetailsClientComponent({
  getPatientOverallDetails,
}: PatientDetailsReduxType) {
  const router = useRouter();
  const pathName = usePathname();
  const patientId = getStorage("patientId");

  if (!patientId) {
    const routerBackTo = getStorage("routeBackTo");
    router.push(routerBackTo || router.back);
  }

  const getPatientDetails = useCallback(async () => {
    await getPatientOverallDetails({ navigate: pathName });
  }, [getPatientOverallDetails, pathName]);

  useEffect(() => {
    getPatientDetails();
  }, []);
  return <div>index</div>;
}

const connector = connect((state) => ({}), {
  getPatientOverallDetails: patientDetailsAction?.patientOverallDetails,
});

export default connector(PatientDetailsClientComponent);
