import { tableCustomizationResposnetype } from "@/state/table/model";
import { projectTableType } from "./patient";

export interface projectPropsType {
  tableData: projectTableType;
  tableLoader: boolean;
  tableCustomizationCall: ({
    payload,
  }: {
    payload: { pageId: string; headerNames: string[] };
  }) => Promise<tableCustomizationResposnetype>;
}
