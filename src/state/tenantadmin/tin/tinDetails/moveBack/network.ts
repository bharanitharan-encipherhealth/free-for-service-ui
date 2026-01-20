import { requestPortal, requestPortalExcel } from "@/util/network";
import { getStorage } from "@/util/storage";

export async function getmoveBackLevel({ roleId }: { roleId: string }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/v1/move-back/get-role-status-details?roleId=${roleId}`,
    options
  );
  return res;
}

export async function moveBack(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(`management/v1/move-back`, options);
  return response;
}
