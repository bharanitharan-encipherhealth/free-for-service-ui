import { createActionThunk } from "@/util/redux";
import * as network from "./network";
import { createAction } from "redux-actions";
export const tabelViewCall = createActionThunk(
  "GET_TABLE_VIEW_CALL",
  network.getTableView
);

export const tableDynamicColumn = createActionThunk(
  "TABLE_DYNAMIC_COLUMN",
  network.dynamicColumn
);

export const getReportTable = createActionThunk(
  "REPORT_TABLE_NEW",
  network.tableCall
);

export const getRoutedData = createAction("GET_ROUTED_DATA");
