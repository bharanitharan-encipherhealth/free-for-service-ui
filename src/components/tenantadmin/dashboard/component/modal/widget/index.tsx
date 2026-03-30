import React from "react";
import Layout from "../../layout";

const Widget = (props: any) => {
  const { selectedTab, selectedItems, setSelectedItem, handleSelect, selectedRole } = props;
  return (
    <div>
      <Layout {...props} />
    </div>
  );
};

export default Widget;
