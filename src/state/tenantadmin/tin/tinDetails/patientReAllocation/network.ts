import { requestPortal } from "@/util/network";

export async function reAllocateUsersList({ data }: { data: unknown }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(`dbservice/reallocation/get/user`, options);
  return res;
}

export const reAllocateUser = async ({ data }: { data: unknown }) => {
  const url = `dbservice/reallocation/update`;
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
