"use client";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import HeaderFilters from "../headerFilters";
import actions from "@/state/admin/dashboard/actions";
import dashboardTypes from "@/state/admin/dashboard/model";

import { getRoleIdByRole } from "@/resuabelFunction/Menu";
import { getLocalStored } from "@/util/storage";
import Default from "../widgets/default";
import moment from "moment";


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
  
  const [handleDateRange, setHandleDateRange] = useState<DateRange>({startDate: "", endDate: ""});

  const [selectedDates, setSelectedDates] = useState<any>([]);

  const [activeBtn, setActiveBtn] = useState("Default");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [selectedValue, setSelectedValue] = useState("")
  const [customDate, setCustomDate] = useState<string[]>([]);

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

  const getAllDatesInRange = ({dateRange}: {dateRange: DateRange}) => {
    const dates = [];
    let currentDate = moment(dateRange?.startDate);

    while (currentDate.isSameOrBefore(dateRange?.endDate)) {
      dates.push(currentDate.format("MMMDD"));
      currentDate = currentDate.add(1, "days");
    }

    return dates;
  };

  // useEffect(() => {
  //   if (selectedTab) {
  //     handleGetWidgets();
  //   }
  // }, [selectedTab]);

    useEffect(() => {
    const customRange = getAllDatesInRange({dateRange:handleDateRange});
    setCustomDate(customRange);
  }, [handleDateRange]);

  useEffect(() => {
    if (!handleDateRange?.startDate || !handleDateRange?.endDate) return;
    handleGetWidgets();
  }, [handleDateRange?.startDate, handleDateRange?.endDate]);

  useEffect(() => {
    if (!handleDateRange?.startDate || !handleDateRange?.endDate) return;
    handleGetWidgets();
  }, []);

  return (
    <div>
      <HeaderFilters
        setDateRange={setHandleDateRange}
        setActiveBtn={setActiveBtn}
        activeBtn={activeBtn}
        setSelectedDates={setSelectedDates}
        setSelectedValue={setSelectedValue}
      />
      <Default selectedRole={selectedRole} dateRange={handleDateRange} selectedValue={selectedValue} customRange={customDate}/>
    </div>
  );
}


const enhancer = connect((state: { dashboardReducer: dashboardTypes }) => ({
  dashboardData: state.dashboardReducer.getWidgtetsData,
}))(DynamicDashboardClientComponent);

export default enhancer;
