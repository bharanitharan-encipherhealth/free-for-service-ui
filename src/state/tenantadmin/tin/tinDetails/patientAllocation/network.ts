import { requestPortal, requestPortalExcel } from "@/util/network";
import { getStorage } from "@/util/storage";

export async function usersList({
  roleId,
  search = "",
  masterAudit,
}: {
  roleId: string;
  search?: string;
  masterAudit?: boolean;
}) {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/user/get/role?roleId=${roleId}&searchString=${search}&masterAudit=${
      masterAudit || false
    }`,
    options,
  );
  return res;
}

export const allocateUsers = async ({ data }: { data: unknown }) => {
  const url = `management/allocation/manual`;
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
