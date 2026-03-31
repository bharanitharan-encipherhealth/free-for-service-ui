import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const uploadFile = createActionThunk(
  "FILE_PROCESSING_UPLOAD_FILE",
  network.uploadFile
);

export const addPatient = createActionThunk(
  "FILE_PROCESSING_ADD_PATIENT",
  network.addPatient
);

export const getUsers = createActionThunk(
  "FILE_PROCESSING_GET_USERS",
  network.getUsers
);

export const getAllFileProcessing = createActionThunk(
    "FILE_PROCESSING_GET_ALL",
    network.getAllFileProcessing
)
