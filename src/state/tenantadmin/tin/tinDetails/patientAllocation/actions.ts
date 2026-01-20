import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const getUserList = createActionThunk(
  "GET_L1_USERS_LIST",
  network.usersList
);

export const getAllocateUsers = createActionThunk(
  "ALLOCATE_USERS",
  network.allocateUsers
);
