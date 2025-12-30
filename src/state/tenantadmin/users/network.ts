import {
  assignUserPayloadType,
  userEnableType,
} from "@/models/tenantadmin/users";
import { requestPortal } from "@/util/network";

export const usersSoftDelete = async ({ data }: { data: userEnableType }) => {
  const url = `dbservice/mci/user/softdelete`;
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export async function getAllUser({ searchText }: { searchText: string }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/mci/user/unassigned?&searchString=${
      searchText ? searchText : ""
    }`,
    options
  );
  return data;
}

export async function getUserRole({ searchText }: { searchText: string }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `/dbservice/mci/user/getroles?&searchString=${
      searchText ? searchText : ""
    }`,
    options
  );
  return data;
}

export const usersAssignedList = async ({
  data,
}: {
  data: assignUserPayloadType;
}) => {
  const url = `dbservice/mci/user/assignuser`;
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
