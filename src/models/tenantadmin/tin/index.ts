import { metaDTOType, OtherTableType, pageableType } from "@/state/table/model";
import { UserInfo } from "../tracking";

export interface contentArrayType {
  id: string;
  tinNumber: string;
  tinName: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
  patientCount: number;
  providerCount: number;
  progressPercentage: number;
  deactivatedByName: UserInfo;
  active: boolean;
  masterAuditStatus: "PENDING" | "APPROVED" | "REJECTED";
  QA: number;
  DOWNLOADER: number;
  CODER_1: number;
  CODER_2: number;
  AI: number;
  TENANT_ADMIN: number;
}
export interface tinCotentResposne extends OtherTableType {
  content: contentArrayType[];
  pageable: pageableType;
}

export interface tinPageResponse extends metaDTOType {
  pageResponse: tinCotentResposne;
}
export interface tinTableResponse {
  message: string;
  status: string;
  response: tinPageResponse;
}
