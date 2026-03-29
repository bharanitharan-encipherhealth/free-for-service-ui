import { allBatchesParamsType } from "@/models/tenantadmin/project/batch";
import { requestPortal } from "@/util/network";
import { getStorage } from "@/util/storage";

export async function allBatches({
  page,
  search,
  batchUploadStatus,
  startDate,
  endDate,
}: allBatchesParamsType) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/batch/batchupload?page=${page}&size=15&searchString=${
      search ? search : ""
    }&batchUploadStatus=${
      batchUploadStatus ? batchUploadStatus : ""
    }&createdDateStart=${startDate ? startDate : ""}&createdDateEnd=${
      endDate ? endDate : ""
    }`,
    options,
  );
  return data;
}

export async function batchDetails({
  batchId,
  page,
  search,
}: {
  batchId: string;
  page: number;
  search: string;
}) {
  const options = {
    method: "GET",
  };
  // url for removed filters in view batchFiles
  // fileStatus=${
  //   fileStatus ? fileStatus : ""
  // }&startDate=${startDate ? startDate : ""}&endDate=${
  //   endDate ? endDate : ""
  // }
  const data = await requestPortal(
    `dbservice/batch/batchuploaddetails?batchId=${batchId}&page=${page}&size=15&searchString=${search}`,
    options,
  );
  return data;
}
