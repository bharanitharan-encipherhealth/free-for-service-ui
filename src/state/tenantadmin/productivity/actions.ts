import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const getAllRoles = createActionThunk(
  "GET_ROLES_ADMIN",
  network.getRoles
);
