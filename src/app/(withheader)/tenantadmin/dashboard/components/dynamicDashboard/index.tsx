"use client";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import HeaderFilters from "../headerFilters";
import actions from "@/state/admin/dashboard/actions";
import dashboardTypes from "@/state/admin/dashboard/model";

import { getRoleIdByRole } from "@/resuabelFunction/Menu";
import { getLocalStored } from "@/util/storage";
import Default from "../widgets/default";


interface DateRange {
  startDate: string;
  endDate: string;
}

interface ReduxProps {
  dashboardData: dashboardTypes["getWidgtetsData"];
  dispatch: any;
}

function DynamicDashboardClientComponent({
  dispatch,
  dashboardData,
}: ReduxProps) {
  
  const [handleDateRange, setHandleDateRange] = useState<DateRange>({
    startDate: "2024-01-01",
    endDate: "2024-01-31"
  });

  const [selectedDates, setSelectedDates] = useState<any>([]);

  const [activeBtn, setActiveBtn] = useState("Default");
  const [selectedRole, setSelectedRole] = useState("Admin");


  const handleApiCalls = async ({
    actionType,
    params,
  }: {
    actionType: string;
    params: any;
  }) => {
    const actionKey = `${actionType}Action` as keyof typeof actions;
    return dispatch(actions[actionKey](params));
  };

  const handleGetWidgets = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: getRoleId,
        dashBoardPage: activeBtn.toUpperCase(),
        },
      });
      // if (res.status == "SUCCESS") {
      //   setSelectedItem(res.response);
      // } else {
      //   getResponePopup(res);
      // }
    } catch (error) {}
  };

  useEffect(()=>{
     handleGetWidgets();
  },[]);

  console.log("handleDateRange", handleDateRange);
  console.log("dashboardData", dashboardData);

  return (
    <div>
      <HeaderFilters
        setDateRange={setHandleDateRange}
        setActiveBtn={setActiveBtn}
        activeBtn={activeBtn}
        setSelectedDates={setSelectedDates}
      />
      <Default selectedRole={selectedRole} dataRange={selectedDates} />
    </div>
  );
}


const enhancer = connect((state: { dashboardReducer: dashboardTypes }) => ({
  dashboardData: state.dashboardReducer.getWidgtetsData,
}))(DynamicDashboardClientComponent);

export default enhancer;
