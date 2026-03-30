import { DashboardStorage, RoleType, DashboardTabs } from "../../types";

export const getDashboardItems = (storageName: string | null): DashboardStorage => {
  const roleList: RoleType[] = ["Admin", "Coder1", "Coder2", "Owner", "QA", "QALead", "ProjectLead"];
  const defaultTabs: DashboardTabs = { Default: [], Workflow: [], Invalid: [], WorkQueue: [] };

  let parsedStorage: any = {};
  if (storageName) {
    try {
      parsedStorage = JSON.parse(storageName) || {};
    } catch {
      parsedStorage = {};
    }
  }

  return roleList.reduce((acc: DashboardStorage, role: RoleType) => {
    acc[role] = { ...defaultTabs, ...parsedStorage[role] };
    return acc;
  }, {});
}