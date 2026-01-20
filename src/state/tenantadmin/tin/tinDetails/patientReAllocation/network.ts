import { requestPortal, requestPortalExcel } from "@/util/network";
import { getStorage } from "@/util/storage";

export async function reAllocateUsersList({ data }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(`dbservice/reallocation/get/user`, options);
  return res;
}

export const reAllocateUser = async ({ data }) => {
  const url = `dbservice/reallocation/update`;
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
