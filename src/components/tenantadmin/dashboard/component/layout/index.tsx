import React from "react";
import Default from "./default";
import Invalid from "./invalid/Invalid";
import Workflow from "./workflow";
import WorkQueue from "./workQueue";

interface LayoutProps {
  selectedTab: string;
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { selectedTab } = props;
  return (
    <div style={{minHeight: "80vh"}}>
      {selectedTab === "Default" && <Default {...props} />}
      {selectedTab === "Workflows" && <Workflow {...props} />}
      {selectedTab === "Invalid" && <Invalid {...props} />}
      {selectedTab === "WorkQueue" && <WorkQueue {...props} />}
    </div>
  );
};

export default Layout;
