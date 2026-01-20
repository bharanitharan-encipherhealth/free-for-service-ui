import {
  clientDetailsTypes,
  clinetDetailsDropDowntypes,
  projectDetailsDropDownTypes,
  roleResponseType,
  tinDropDownResponseType,
} from "@/models/(withoutheader)/projects";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export interface mfaValidationType {
  username: string;
  password: { pass: string; iv: string };
  route: AppRouterInstance;
}

export default class authTypes {
  allRolesData: {
    data: roleResponseType;
    error?: string | null;
    loading: boolean;
  };
  clientDetails: {
    data: clientDetailsTypes;
    error?: string | null;
    loading: boolean;
  };
  clientDropDown: {
    data: clinetDetailsDropDowntypes;
    error?: string | null;
    loading: boolean;
  };
  projectDetails: {
    data: projectDetailsDropDownTypes;
    error?: string | null;
    loading: boolean;
  };
  tinDetails: {
    error?: string;
    loading: boolean;
    data: tinDropDownResponseType;
  };
  mfaLoader: boolean;
  clientDetailsLoading: boolean;
  projectDetailsLoading: boolean;
  roleLoading: boolean;
  tinDetailsLoading: boolean;
  selectedUserRole: string;

  constructor(
    allRolesData: {
      data: {
        message: "Failed";
        status: "fail";
        response: {
          userName: "";
          firstName: "";
          lastName: "";
          profileImageUrl: "";
          userRoles: [
            {
              roleId: "";
              roleOrder: 0;
              role: "";
              proxyRole: "";
              aliasName: "";
              panelList: {
                panel1Name: null;
                accessListForPanel1: [
                  {
                    title: "";
                    tabMenuList: ["Dashbaord"];
                    tabMenuList2: ["Dashbaord"];
                    active: true;
                  }
                ];
                panel2Name: null;
                accessListForPanel2: [
                  {
                    title: "";
                    tabMenuList: ["Dashbaord"];
                    tabMenuList2: ["Dashbaord"];
                    active: true;
                  }
                ];
              };
              allocationOrder: 0;
              dashboardPageAccess: [];
            }
          ];
        };
      };
      loading: false;
    },
    clientDetails: {
      data: {
        message: "Failed";
        response: { userName: ""; orgId: "" };
        status: "fail";
      };
      loading: false;
    },
    clientDropDown: {
      data: {
        message: "Failed";
        response: [
          {
            id: "";
            clientId: "";
            clientName: "";
            clientType: "";
            editIcon: false;
          }
        ];
        status: "fail";
      };
      loading: false;
    },
    projectDetails: {
      data: {
        message: "Failed";
        response: [
          {
            id: "";
            projectName: "";
            projectInitiatedDate: "";
            projectEndDate: "";
            projectStatus: "";
            editIcon: false;
          }
        ];
        status: "fail";
      };
      loading: false;
    },
    tinDetails: {
      loading: false;
      data: {
        message: "fail";
        status: "fail";
        response: [
          {
            id: "";
            patientCount: 0;
            progressPercentage: 0;
            providerCount: 0;
            tinName: "";
            tinNumber: "";
          }
        ];
      };
    },
    selectedUserRole: "",
    mfaLoader: false,
    clientDetailsLoading: false,
    projectDetailsLoading: false,
    roleLoading: false,
    tinDetailsLoading: false
  ) {
    this.mfaLoader = mfaLoader;
    this.allRolesData = allRolesData;
    this.clientDetails = clientDetails;
    this.clientDetailsLoading = clientDetailsLoading;
    this.clientDropDown = clientDropDown;
    this.projectDetailsLoading = projectDetailsLoading;
    this.projectDetails = projectDetails;
    this.roleLoading = roleLoading;
    this.tinDetails = tinDetails;
    this.tinDetailsLoading = tinDetailsLoading;
    this.selectedUserRole = selectedUserRole;
  }
}
