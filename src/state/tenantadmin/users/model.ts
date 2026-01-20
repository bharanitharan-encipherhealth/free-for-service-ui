import {
  getAllUserRoleListType,
  userTabelType,
} from "@/models/tenantadmin/users";

export default class UserReducerType {
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
  userRoleEditLoading: boolean;

  constructor(
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
    },
    userRoleEditLoading: boolean
  ) {
    this.allUserList = allUserList;
    this.allUserLoading = allUserLoading;
    this.alluserRoleLoading = alluserRoleLoading;
    this.alluserRoleList = alluserRoleList;
    this.userRoleEditLoading = userRoleEditLoading;
  }
}
