export interface orgIdtypes {
  userName: string;
  orgId: string;
}

export interface clientDetailsTypes {
  message: string;
  response: orgIdtypes;
  status: string;
}

export interface clientDropDownTypes {
  id: string;
  clientId: string;
  clientName: string;
  clientType: string;
  editIcon: boolean;
}

export interface clinetDetailsDropDowntypes {
  message: string;
  status: string;
  response: [clientDropDownTypes];
}

export interface projectDropDownTypes {
  id: string;
  projectName: string;
  projectInitiatedDate: string;
  projectEndDate: string;
  projectStatus: string;
  editIcon: boolean;
}

export interface projectDetailsDropDownTypes {
  message: string;
  status: string;
  response: [projectDropDownTypes];
}

export interface accessListForPanel1 {
  title: string;
  tabMenuList: string[];
  tabMenuList2: string[];
  active: boolean;
}
export interface panelListType {
  panel1Name?: null;
  accessListForPanel1: accessListForPanel1[];
  panel2Name?: null;
  accessListForPanel2: accessListForPanel1[];
}

export interface userRolesTypes {
  roleId: string;
  roleOrder: number;
  role: string;
  proxyRole: string;
  aliasName: string;
  panelList: panelListType;
  allocationOrder: number;
  dashboardPageAccess: string[];
}

export interface roleTypes {
  userName: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  userRoles: userRolesTypes[];
}

export interface roleResponseType {
  message: string;
  status: string;
  response: roleTypes;
}

export interface tinDropDownType {
  id: string;
  patientCount: number;
  progressPercentage: number;
  providerCount: number;
  tinName: string;
  tinNumber: string;
}
export interface tinDropDownResponseType {
  message: string;
  status: string;
  response: [tinDropDownType];
}

export interface projectTypes {
  getAllRoles: () => Promise<roleResponseType>;
  getAllClientId: () => Promise<clientDetailsTypes>;
  allRolesData: roleTypes;
  clientIdData: orgIdtypes;
  clientLoading: boolean;
  clientDetails: [clientDropDownTypes];
  projectDetails: [projectDropDownTypes];
  tinDetails: [tinDropDownType];
  projectLoading: boolean;
  roleLoading: boolean;
  getAllClientDetails: () => Promise<clinetDetailsDropDowntypes>;
  getAllProjects: () => Promise<projectDetailsDropDownTypes>;
  getAllTin: () => Promise<tinDropDownResponseType>;
  handleRoleDropChange: ({ key }: { key: string }) => void;
  setRole: (value: string | undefined) => void;
}


