import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const getReAllocateUserList = createActionThunk(
  "GET_REALLOCATE_USER_LIST",
  network.reAllocateUsersList
);

export const getAllocateUsers = createActionThunk(
  "ALLOCATE_USERS",
  network.reAllocateUser
);
