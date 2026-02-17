import {
  metaDTOType,
  OtherTableType,
  pageableType,
  tableApiParamsType,
  tableCustomizationResposnetype,
} from "@/state/table/model";

export interface AuthorizedProjectType {
  projectId: string;
  roles: string[];
  active: boolean;
}

export interface AuthorizedDetailType {
  clientId: string;
  projects: AuthorizedProjectType[];
}

export interface roleWiseStatusCountType {
  userName?: string | null;
  projectId?: string | null;
  roleId: string;
  complete: number;
  declined: number;
  pending: number;
  hold: number;
  reassigned: number;
  queried: number;
}

export interface UserContentType extends Record<string, unknown> {
  createdDate: string;
  lastModifiedDate?: string | null;
  active: boolean;
  version?: string | null;
  createdBy: string;
  lastModifiedBy?: string | null;
  id: string;
  role?: string;
  organizationId?: string | null;
  userId?: string | null;
  email: string;
  managerId?: string | null;
  tenantId?: string | null;
  userName: string;
  firstName: string;
  lastName: string;
  userType?: string | null;
  accountStatus: boolean;
  totalFileProcessed?: number | null;
  totalFileAllocated?: number | null;
  totalFilePending?: number | null;
  totalFileHold?: number | null;
  totalFileDeclined?: number | null;
  profileImageUrl?: string | null;
  mfaSkipCount?: number | null;
  accuracy?: number | null;
  mfaSecret?: string | null;
  appRoleAssignmentId?: string | null;
  totalFileAudited?: number | null;
  totalFileAuditAllocated?: number | null;
  totalFileAuditPending?: number | null;
  totalFileAuditHold?: number | null;
  totalFileAuditDeclined?: number | null;
  organizationDTO?: unknown | null;
  roleId?: string | null;
  roleWiseStatusCount?: roleWiseStatusCountType[];
  authorizedDetails?: AuthorizedDetailType[];
  orgBasedUserStrategy: boolean;
  ssoEnabled: boolean;
  roleNames?: string[] | null;
  userNames?: string[] | null;
  name: string;
  currentUser: boolean;
  mfaEnabled: boolean;
}

export interface tableContentType extends OtherTableType {
  content: UserContentType[];
  pageable: pageableType;
}

export interface UserPageResponseType extends metaDTOType {
  pageResponse: tableContentType;
}
export interface userTabelType {
  message: string;
  status: string;
  response: UserPageResponseType;
}

export interface userEnableType {
  userName: string;
  isActive: boolean;
  isClientBased: boolean;
}

export interface userEnableResponseType {
  message: string;
  status: string;
  response: UserContentType;
}

export interface UserEditRolesResposneType {
  message: string;
  status: string;
  response: UserContentType;
}

export interface userPropsType {
  getTableView: (
    tableApiParamsType: tableApiParamsType,
  ) => Promise<userTabelType>;
  getUserEnable: ({
    data,
  }: {
    data: userEnableType;
  }) => Promise<userEnableResponseType>;
  tabelData: UserPageResponseType;
  tableLoader: boolean;
  tableCustomizationCall: ({
    payload,
  }: {
    payload: { pageId: string; headerNames: string[] };
  }) => Promise<tableCustomizationResposnetype>;
  allRoles: userContentType[];
  getAllRole: () => Promise<getAllUserRoleListType>;
  setUserEditRoles: (data: {
    userName: string;
    roles: string[] | null;
  }) => Promise<UserEditRolesResposneType>;
  editUsersLoader: boolean;
}

export interface UserListType {
  role?: string[] | null;
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface getAllUserType {
  message: string;
  status: string;
  response: UserContentType[];
}

export interface userContentType {
  roleId: string;
  roleName: string;
  roleOrder: number;
  aliasName: string;
  accessList: null;
}

export interface getAllUserRoleContetType extends OtherTableType {
  content: userContentType[];
  pageable: pageableType;
}
export interface getAllUserRoleListType {
  message: string;
  status: string;
  response: getAllUserRoleContetType;
}

export interface assignUserPayloadType {
  userNames: string[];
  authorizedDetails: {
    clientId: string;
    projects: {
      projectId: string;
      roles: string[];
    }[];
  }[];
}

export interface assignUserResponse {
  message: string;
  status: string;
  response: UserContentType[];
}
export interface UserAssignModalType {
  openSelectUser: boolean;
  getAllUser: () => Promise<getAllUserType>;
  handleCloseMoadl: () => void;
  setAssignUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  getAllRole: () => Promise<getAllUserRoleListType>;
  allRoleData: userContentType[];
  allRoleDataLoading: boolean;
  setAssignUserRole: ({
    data,
  }: {
    data: assignUserPayloadType;
  }) => Promise<assignUserResponse>;
  getUsersAPi: () => void;
  allUserListLoading: boolean;
}
