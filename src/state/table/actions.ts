import { createActionThunk } from "@/util/redux";
import * as network from "./network";
export const tabelViewCall = createActionThunk(
  "GET_TABLE_VIEW_CALL",
  network.getTableView
);

export const tableDynamicColumn = createActionThunk(
  "TABLE_DYNAMIC_COLUMN",
  network.dynamicColumn
);
