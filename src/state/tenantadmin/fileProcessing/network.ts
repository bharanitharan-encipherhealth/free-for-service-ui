import { requestPortal, requestPortalFiles } from "@/util/network";
import { getStorage } from "@/util/storage";

export async function uploadFile({ data }: { data: FormData }) {
  const options = {
    method: "POST",
    body: data
  };
  const res = await requestPortalFiles(`aiservice/ai/upload`, options);
  return res;
}

export async function addPatient({ data }: { data: any }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(`dbservice/patient`, options);
  return res;
}

export const getUsers = async ({ pageNo, pageSize, selectOrgList = "" }: { pageNo: number, pageSize: number, selectOrgList?: string }) => {
  const uId = getStorage("userId");
  const url = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}&orgId=${selectOrgList}`;
  const options = {
    method: "GET"
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export const getAllFileProcessing = async ({ tinId }: { tinId: string }) => {
    const options = {
        method: "GET"
    }
    const res = await requestPortal(`dbservice/file-process/status?tinId=${tinId}`, options);
    return res;
}
