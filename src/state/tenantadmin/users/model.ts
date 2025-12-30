import {
  getAllUserRoleListType,
  userTabelType,
} from "@/models/tenantadmin/users";

export default class tableViewType {
  tableView: {
    data: userTabelType;
    error: string | null;
    loading: boolean;
  };
  tableViewLoading: boolean;
  allUserList: {
    data: string;
    error: string | null;
    loading: boolean;
  };
  allUserLoading: boolean;
  alluserRoleLoading: boolean;
  alluserRoleList: {
    data: getAllUserRoleListType;
    error: string | null;
    loading: boolean;
  };

  constructor(
    tableViewLoading: false,
    tableView: {
      data: {
        message: "Failed";
        status: "fail";
        response: {
          pageResponse: {
            content: [
              {
                createdDate: "";
                lastModifiedDate: null;
                active: false;
                version: null;
                createdBy: "";
                lastModifiedBy: null;
                id: "";
                role: "";
                organizationId: null;
                userId: null;
                email: "";
                managerId: null;
                tenantId: null;
                userName: "";
                firstName: "";
                lastName: "";
                userType: null;
                accountStatus: false;
                totalFileProcessed: null;
                totalFileAllocated: null;
                totalFilePending: null;
                totalFileHold: null;
                totalFileDeclined: null;
                profileImageUrl: null;
                mfaSkipCount: null;
                accuracy: null;
                mfaSecret: null;
                appRoleAssignmentId: null;
                totalFileAudited: null;
                totalFileAuditAllocated: null;
                totalFileAuditPending: null;
                totalFileAuditHold: null;
                totalFileAuditDeclined: null;
                organizationDTO: null;
                roleId: null;
                roleWiseStatusCount: [];
                authorizedDetails: [];
                orgBasedUserStrategy: false;
                ssoEnabled: false;
                roleNames: [];
                userNames: null;
                name: "";
                currentUser: false;
                mfaEnabled: false;
              }
            ];
            pageable: {
              pageNumber: 0;
              pageSize: 0;
              sort: {
                sorted: false;
                empty: false;
                unsorted: false;
              };
              offset: 0;
              paged: false;
              unpaged: false;
            };
            last: false;
            totalPages: 0;
            totalElements: 0;
            first: false;
            size: 0;
            number: 0;
            sort: {
              sorted: false;
              empty: false;
              unsorted: false;
            };
            numberOfElements: 0;
            empty: false;
          };
          processStatusCount: "";
          patientIds: "";
          tinNumbers: "";
          metaDataDTO: [
            {
              headerName: "";
              actualField: "";
              active: boolean;
              columnActive: boolean;
              design: ["", ""];
              filter: {
                filter: "";
                options: [{ id: ""; name: "" }];
                nameOptions: [{ id: ""; name: "" }];
                style: "";
              };
              orderValue: 0;
            }
          ];
        };
      };
      error: "";
      loading: false;
    },
    allUserList: {
      data: string;
      error: "";
      loading: false;
    },
    allUserLoading: false,
    alluserRoleLoading: false,

    alluserRoleList: {
      data: {
        message: "Failed";
        status: "fail";
        response: {
          content: [
            {
              roleId: "";
              roleName: "";
              roleOrder: 0;
              aliasName: "";
              accessList: null;
            }
          ];
          pageable: {
            pageNumber: 0;
            pageSize: 0;
            sort: {
              sorted: false;
              empty: false;
              unsorted: false;
            };
            offset: 0;
            paged: false;
            unpaged: false;
          };
          last: false;
          totalPages: 0;
          totalElements: 0;
          first: false;
          size: 0;
          number: 0;
          sort: {
            sorted: false;
            empty: false;
            unsorted: false;
          };
          numberOfElements: 0;
          empty: false;
        };
      };
      error: "";
      loading: false;
    }
  ) {
    this.tableView = tableView;
    this.tableViewLoading = tableViewLoading;
    this.allUserList = allUserList;
    this.allUserLoading = allUserLoading;
    this.alluserRoleLoading = alluserRoleLoading;
    this.alluserRoleList = alluserRoleList;
  }
}
