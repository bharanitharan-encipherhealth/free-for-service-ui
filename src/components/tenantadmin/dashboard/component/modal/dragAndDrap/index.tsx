import React from "react";
import Layout from  "../../layout"
const DragAndDrap = ({ selectedTab, dashboard, setDashboard, selectedRole }: any) => {
  return (
    <div>
    <Layout selectedTab={selectedTab} isDragable={true} dashboard={dashboard} setDashboard={setDashboard} selectedRole={selectedRole}/>
     
    </div>
  );
};

export default DragAndDrap;
