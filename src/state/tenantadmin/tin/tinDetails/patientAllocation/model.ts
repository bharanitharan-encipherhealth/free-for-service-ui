import { userListResponseType } from "@/models/tenantadmin/tin/patientAllocation";

export default class patinetAllocationReducerType {
  getUsersLoading: boolean;
  getUserList: userListResponseType;

  constructor(
    getUsersLoading: false,
    getUserList: {
      data: {
        status: "fail";
        message: "fail";
        response: [
          {
            id: "";
            userName: "";
            firstName: "";
            lastName: "";
            name: "";
            roleId: "";
            aliasName: "";
            proxyId: "";
          }
        ];
      };
      loading: false;
      error: "fail";
    }
  ) {
    this.getUsersLoading = getUsersLoading;
    this.getUserList = getUserList;
  }
}
