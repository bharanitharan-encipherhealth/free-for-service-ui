import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const usersSoftDelete = createActionThunk(
  "USERS_SOFT_DELETE",
  network.usersSoftDelete
);

export const getUsers = createActionThunk(
  "GET_ALL_USERS_DETAILS",
  network.getAllUser
);

export const getRole = createActionThunk(
  "GET_ALL_USER_LIST",
  network.getUserRole
);

export const usersAssigned = createActionThunk(
  "USERS_ASSIGNED_DETIALS",
  network.usersAssignedList
);

export const userEditRoles = createActionThunk(
  "EDIT_USERS_ROLES",
  network.editRoles
);

export const createUser = createActionThunk(
  "CREATE_USER_DETAILS",
  network.createUser
);
