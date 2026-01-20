import {  getAllRoleTabReducerType } from "@/models/tenantadmin/productivity/page";

export default class productivityReducerType {
  allRolesAllocation: getAllRoleTabReducerType;
  allRolesAllocationLoading: boolean;

  constructor(
    allRolesAllocation: {
      data: {
        message: "fails";
        status: "fail";
        response: {
          allocationRoles: [
            {
              roleId: "0";
              roleName: "";
              roleOrder: 0;
              aliasName: "";
              disableAllocation: false;
              accessList: null;
              allocationOrder: 0;
            }
          ];
          randomSamplingCompleted: false;
          masterAuditSamplingCompleted: false;
        };
      };
      loading: false;
      status: "fail";
    },
    allRolesAllocationLoading: false,
  ) {
    this.allRolesAllocation = allRolesAllocation;
    this.allRolesAllocationLoading = allRolesAllocationLoading;
  }
}
