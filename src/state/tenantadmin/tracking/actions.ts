import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const logsExport = createActionThunk(
  "LOGS_REPORT_GENERATE",
  network.logsReportDownload
);
