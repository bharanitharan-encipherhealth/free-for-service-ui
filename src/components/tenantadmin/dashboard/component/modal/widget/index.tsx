import React from "react";
import Layout from "../../layout";
import { Widget as WidgetType } from "../../../types";

interface WidgetProps {
  selectedTab: string;
  selectedItems: WidgetType[];
  setSelectedItem: (items: WidgetType[]) => void;
  handleSelect: (item: WidgetType) => void;
  dashboard: WidgetType[];
  setDashboard: (items: WidgetType[]) => void;
  selectedRole: string;
  [key: string]: any;
}

const Widget: React.FC<WidgetProps> = (props) => {
  return (
    <div>
      <Layout {...props} />
    </div>
  );
};

export default Widget;
