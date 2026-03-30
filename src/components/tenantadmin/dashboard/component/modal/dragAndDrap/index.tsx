import React from "react";
import Layout from "../../layout";
import { Widget as WidgetType } from "../../../types";

interface DragAndDrapProps {
  selectedTab: string;
  selectedItems: WidgetType[];
  setSelectedItem: (items: WidgetType[]) => void;
  handleSelect: (item: WidgetType) => void;
  dashboard: WidgetType[];
  setDashboard: (items: WidgetType[]) => void;
  selectedRole: string;
}

const DragAndDrap: React.FC<DragAndDrapProps> = ({ 
  selectedTab, 
  dashboard, 
  setDashboard, 
  selectedRole,
  ...rest 
}) => {
  return (
    <div>
      <Layout 
        {...rest}
        selectedTab={selectedTab} 
        isDragable={true} 
        dashboard={dashboard} 
        setDashboard={setDashboard} 
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default DragAndDrap;
