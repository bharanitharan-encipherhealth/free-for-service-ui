import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const getMoveBackLevel = createActionThunk(
  "GET_MOVEBACK_LEVEL",
  network.getmoveBackLevel,
);

export const postMoveBack = createActionThunk(
  "POST_MOVEBACK_LEVEL",
  network.moveBack,
);
