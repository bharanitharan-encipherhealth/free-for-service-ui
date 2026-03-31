import React from "react";
import Default from "./default";
import Invalid from "./invalid/Invalid";
import Workflow from "./workflow";
import WorkQueue from "./workQueue";

interface LayoutProps {
  selectedTab: string;
  isDragable?: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: any[];
  setDashboard: ((items: any[]) => void) | React.Dispatch<React.SetStateAction<any[]>>;
  selectedRole: string;
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { selectedTab } = props;
  return (
    <div style={{ minHeight: "80vh" }}>
      {selectedTab === "Default" && <Default {...(props as any)} />}
      {selectedTab === "Workflows" && <Workflow {...(props as any)} />}
      {selectedTab === "Invalid" && <Invalid {...(props as any)} />}
      {selectedTab === "WorkQueue" && <WorkQueue {...(props as any)} />}
    </div>
  );
};

export default Layout;
