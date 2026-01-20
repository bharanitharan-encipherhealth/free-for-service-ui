import { createActionThunk } from "@/util/redux";
import * as network from "./network";
import { createAction } from "redux-actions";

export const reportTabList = createActionThunk("REPORT_TABS", network.tabList);

export const getReportDownload = createActionThunk(
  "REPORT_DOWNLOAD",
  network.reportDownloadCall
);

export const getReportCall = createActionThunk(
  "VIEW_REPORT",
  network.reportViewCall
);

