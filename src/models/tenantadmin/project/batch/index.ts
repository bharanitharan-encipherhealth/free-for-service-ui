import { OtherTableType, pageableType } from "@/state/table/model";

export interface bacthContentArrayType extends Record<string, unknown> {
  id: string;
  name: string;
  uploadedFilePath: string;
  totalSuccessCount: number;
  totalFailedCount: number;
  totalProcessingCount: number;
  totalFileCount: number;
  yearOfService: number[];
  emrType: string | null;
  batchUploadStatus: string;
  createdBy: string;
  createdDate: string; // ISO string
  source: string;
  processedStatus: string | null;
  sourceFolderPath: string | null;
  fileExtension: string | null;
  startTime: string | null;
  endTime: string | null;
  client: string | null;
  facility: string | null;
  receivedTime: string | null;
  allocatedCount: number;
  projectId: string;
  batchDate: string;

  createdByDetail: {
    firstName: string;
    lastName: string;
    userName: string;
    profileImageUrl: string | null;
    role: string | null;
  };
}

export interface allBatchesParamsType {
  page: string;
  search: string;
  batchUploadStatus: string;
  startDate: string;
  endDate: string;
}

export interface bacthTableResponseType extends OtherTableType {
  content: bacthContentArrayType[];
  pageable: pageableType;
}

export interface bacthTableType {
  message: string;
  status: string;
  response: bacthTableResponseType;
}

export interface getProjectTableView {
  message: string;
  status: string;
  response: bacthTableResponseType;
}

export interface bachInfoPramsType {
  bacthInfo: bacthContentArrayType | null;
  setViewDetailedBatch: React.Dispatch<
    React.SetStateAction<{
      status: boolean;
      data: bacthContentArrayType | null;
    }>
  >;
}
