import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const getAllBatches = createActionThunk(
  "GET_ALL_BATCHES",
  network.allBatches
);

export const getBatchInfo = createActionThunk(
  "GET_BATCH_INFO",
  network.batchDetails
);
