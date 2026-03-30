export const  getDashboardItems = (storageName) => {
  const roleList = ["Admin", "Coder1", "Coder2", "Owner", "QA", "QALead", "ProjectLead"];
  const defaultTabs = { Default: [], Workflow: [], Invalid: [], WorkQueue: [] };

  let parsedStorage = {};
  try {
    parsedStorage = JSON.parse(storageName) || {};
  } catch {
    parsedStorage = {};
  }

  return roleList.reduce((acc, role) => {
    acc[role] = { ...defaultTabs, ...parsedStorage[role] };
    return acc;
  }, {});
}