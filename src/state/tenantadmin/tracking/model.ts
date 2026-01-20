import {
  getAllUserRoleListType,
  userTabelType,
} from "@/models/tenantadmin/users";

export default class LogsReducerType {
  exportLoading: boolean;

  constructor(exportLoading: boolean) {
    this.exportLoading = exportLoading;
  }
}
