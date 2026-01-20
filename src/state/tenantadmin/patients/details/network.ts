import { requestPortal, requestPortalExcel } from "@/util/network";
import { getStorage } from "@/util/storage";

// api call for patient details
export async function patientIdDetails({
  navigate,
  dataEmpty = false,
}: {
  navigate: string;
  dataEmpty: boolean;
}) {
  const patientId = getStorage("patientId");
  const userRoleId = getStorage("roleId");
  if (dataEmpty == true) {
    return null;
  }
  const isTinDetailsPage = navigate
    ? navigate.endsWith("/tindetails/masteraudit")
    : "";

  const options = {
    method: "GET",
  };

  let url = `dbservice/status/patient/get?patientId=${patientId}&roleId=${userRoleId}`;
  if (isTinDetailsPage) {
    url += `&masterAudit=true`;
  }

  try {
    const data = await requestPortal(url, options);
    return data;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}
