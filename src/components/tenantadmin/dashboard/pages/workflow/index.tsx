import { connect } from "react-redux";
import { Card, Select, Modal } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AppChart from "../../component/appchart";
import {
  getFormattedChartData,
  getTotalChart,
  useHasMounted,
  useWindowWidth,
  WorkflowWidget,
  getColSpan,
  getRowSpan,
  formatKValue,
} from "../../component/function";
import AccuracyChart from "../../component/accuracyChart";
import StatCard from "../../component/statChart";
import processing from "@/images/tenantAdmin/processing.svg";
import failed from "@/images/tenantAdmin/failed.svg";
import completed from "@/images/tenantAdmin/completed.svg";
import upload from "@/images/tenantAdmin/upload.svg";
import Notifications from "../../component/notifications";
import Image from "next/image";
import { getStorage } from "../../../../../util/storage";
import EmptyComponent from "../../component/empty/EmptyComponent";
import styles from "../../reviewerStyles.module.css";
import accuracy from "@/images/dashboard/accuracy.webp";
import actions from "../../../../../state/admin/dashboard/actions";
import moment from "moment";
import CardSkeleton from "@/components/skeleton/card";
import {
  getColorValue,
  companyDetails,
  getDashboardStatusColor,
  getDashboardRoleColor,
  getLast30Days,
  getLast7Days,
} from "../../../../../util/reusableFunction";
import GroupCard from "../../component/groupcard";
import uploadContainer from "@/images/dashboard/uploadContainer.webp";
import processingContainer from "@/images/dashboard/processingContainer.webp";
import completedContainer from "@/images/dashboard/completedContainer.webp";
import failedContainer from "@/images/dashboard/failedContainer.webp";
import codeCaptureContainer from "@/images/dashboard/codeCaptureContainer.webp";

interface WorkflowProps {
  selectedRole: string;
  pagesLoader: boolean;
  windowWidth: number | null;
  dispatch: any;
  getSelectedWidgets: any[];
  getSelectedWidgetsLoader: boolean;
  data: any;
  filesCountData: any;
  filesCountDataLoading: boolean;
  allocatedStatusCountData: any;
  allocatedStatusCountDataLoading: boolean;
  coder1StatusCountData: any;
  coder1StatusCountDataLoading: boolean;
  coder2StatusCountData: any;
  coder2StatusCountDataLoading: boolean;
  qaStatusCountData: any;
  qaStatusCountDataLoading: boolean;
  projectLeadStatusCountData: any;
  projectLeadStatusCountDataLoading: boolean;
  ownerStatusCountData: any;
  ownerStatusCountDataLoading: boolean;
  qaLeadStatusCountData: any;
  qaLeadStatusCountDataLoading: boolean;
  usersStatusCountData: any;
  usersStatusCountDataLoading: boolean;
  accuracyData: any;
  accuracyDataLoading: boolean;
  allocationStatus: any;
  allocationStatusLoading: boolean;
  userDropDown: any;
  productivityStatusData: any;
  productivityStatusLoading: boolean;
  selectedValue: string;
  customDate: string[];
  dateRange: any;
}

const statCardsData = [
  {
    icon: upload,
    title: "Upload",
    value: 293,
    bgColor: "#ecebff",
    iconColor: "#d0ccff",
  },
  {
    icon: processing,
    title: "Processing",
    value: 4,
    bgColor: "#eae9f6",
    iconColor: "#d0ccff",
  },
  {
    icon: completed,
    title: "Completed",
    value: 293,
    bgColor: "#d6ffda",
    iconColor: "#adffb5",
  },
  {
    icon: failed,
    title: "Failed",
    value: 4,
    bgColor: "#ffeae0",
    iconColor: "#ffdbcc",
  },
];

const TabButtons = [
  {
    id: 1,
    title:
      (companyDetails as any) == "encipher" || (companyDetails as any) == "abha"
        ? "CodeGen-i"
        : "CogentAI Accuracy",
  },
  {
    id: 2,
    title: "Organization Quality",
  },
];

const dummyData: any[] = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];

const organizationData = [
  { name: "3Gen", value: 0 },
  { name: "Encipher Health", value: 1 },
  { name: "Change Healthcare", value: 2 },
  { name: "Vanguard", value: 3 },
  { name: "3M Health Information Systems", value: 4 },
];

const orgData =
  organizationData.map((org, index) => ({
    name: org.name,
    value: org.value,
    itemStyle: {
      color: [
        getColorValue("1"),
        getColorValue("2"),
        getColorValue("3"),
        getColorValue("4"),
        getColorValue("5"),
        getColorValue("6"),
        getColorValue("7"),
      ][index % 10],
    },
  })) || [];

interface GetChartsParams {
  type: string;
  chartType: string;
  pagesLoader: boolean;
  isOrgModalOpen: boolean;
  showModal: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  handleTabButtonClick: (index: any, btn?: any) => void;
  currentTabBtn: string;
  activeTabButton: number;
  filesCountData: any;
  filesCountDataLoading: boolean;
  allocatedStatusCountData: any;
  allocatedStatusCountDataLoading: boolean;
  coder1StatusCountData: any;
  coder1StatusCountDataLoading: boolean;
  coder2StatusCountData: any;
  coder2StatusCountDataLoading: boolean;
  qaStatusCountData: any;
  qaStatusCountDataLoading: boolean;
  projectLeadStatusCountData: any;
  projectLeadStatusCountDataLoading: boolean;
  ownerStatusCountData: any;
  ownerStatusCountDataLoading: boolean;
  qaLeadStatusCountData: any;
  qaLeadStatusCountDataLoading: boolean;
  usersStatusCountData: any;
  usersStatusCountDataLoading: boolean;
  accuracyData: any;
  accuracyDataLoading: boolean;
  selectedValue?: string;
  dates?: string[];
  allocationStatus?: any;
  allocationStatusLoading?: boolean;
  productivityStatusData?: any;
  productivityStatusLoading?: boolean;
  averageReviewerScore: number;
  averageEngineScore: number;
}

const getCharts = ({
  type,
  chartType,
  pagesLoader,
  isOrgModalOpen,
  showModal,
  handleOk,
  handleCancel,
  handleTabButtonClick,
  currentTabBtn,
  activeTabButton,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  coder1StatusCountData,
  coder1StatusCountDataLoading,
  coder2StatusCountData,
  coder2StatusCountDataLoading,
  qaStatusCountData,
  qaStatusCountDataLoading,
  projectLeadStatusCountData,
  projectLeadStatusCountDataLoading,
  ownerStatusCountData,
  ownerStatusCountDataLoading,
  qaLeadStatusCountData,
  qaLeadStatusCountDataLoading,
  usersStatusCountData,
  usersStatusCountDataLoading,
  accuracyData,
  accuracyDataLoading,
  selectedValue,
  dates,
  allocationStatus,
  allocationStatusLoading,
  productivityStatusData,
  productivityStatusLoading,
}: GetChartsParams) => {
  switch (type) {
    case "OrgPieChartInfo":
      const {
        categories: OrgPieChartCategories,
        formattedSeries: OrgPieChartFormatted,
        height: OrgPieChartHeight,
        legendData: OrePieChartLegendData,
      } = getFormattedChartData(orgData, chartType);
      return pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={OrgPieChartCategories}
          series={OrgPieChartFormatted}
          legendData={OrePieChartLegendData}
          height={300}
          showLegend={true}
          radius={["55%", "60%"]}
          showLabel={true}
          isOrgModalOpen={isOrgModalOpen}
          showModal={showModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
          xAxisInterval={8}
          xAxisRotated={true}
        />
      );
    case "WorkFlowFiles":
      const {
        computedFiles = 0,
        failedFiles = 0,
        processingFiles = 0,
        uploadedFiles = 0,
        computedStats = [],
        failedStats = [],
        processingStats = [],
        capturedCodesCount = 0,
      } = filesCountData || [];
      const statCardsData = [
        // {
        //   icon: upload,
        //   title: "AI Upload",
        //   value: uploadedFiles || 0,
        //   bgColor: uploadContainer,
        //   iconColor: "#d0ccff",
        // },
        {
          icon: processing,
          title: "AI Processing",
          value: processingFiles || 0,
          bgColor: processingContainer,
          iconColor: "#d0ccff",
        },
        {
          icon: completed,
          title: "AI Completed",
          value: computedFiles || 0,
          bgColor: completedContainer,
          iconColor: "#adffb5",
        },
        {
          icon: failed,
          title: "AI Failed",
          value: failedFiles || 0,
          bgColor: failedContainer,
          iconColor: "#ffdbcc",
        },
        // {
        //   icon: failed,
        //   title: "AI Codes Captured",
        //   value: capturedCodesCount || 0,
        //   bgColor: codeCaptureContainer,
        //   iconColor: "#ffdbcc",
        // },
      ];
      const categories = computedStats.map((item: any) =>
        moment(item.date).format("MMM DD"),
      );
      const series = [
        {
          name: "Completed",
          data: computedStats || [],
          color: getColorValue("5"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Processing",
          data: processingStats || [],
          color: getColorValue("7"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Failed",
          data: failedStats || [],
          color: getColorValue("1"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
      ];
      return (
        <>
          <div className="flex justify-between flex-wrap gap-3">
            {statCardsData.map((card) =>
              filesCountDataLoading || pagesLoader ? (
                <CardSkeleton count={1} height={70} />
              ) : (
                <StatCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  bgColor={card.bgColor}
                  padding="16px"
                  minWidth="220px"
                  gap="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="14px"
                  height="63px"
                  fontSize="20px"
                  fontWeight={700}
                  backgroundColor={card.iconColor}
                  textColor={"white"}
                  textAlign={"center"}
                  border="4px solid #B3B3B3"
                />
              ),
            )}
          </div>
          {filesCountDataLoading || pagesLoader ? (
            <div className="m-4">
              <CardSkeleton count={1} height={200} />
            </div>
          ) : (
            <AppChart type={chartType} categories={dates} series={series} />
          )}
        </>
      );

    case "AllocatedStatus":
      const allocatedSeries = [
        {
          name: "Allocated",
          value: allocatedStatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Not Allocated",
          value: allocatedStatusCountData?.notAllocatedCount || 0,
          color: getDashboardStatusColor("2"),
        },
      ];

      const {
        categories: allocatedCategories,
        formattedSeries: allocatedFormatted,
        height: allocatedHeight,
      } = getFormattedChartData(allocatedSeries, chartType);

      return allocatedStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={allocatedCategories}
          series={allocatedFormatted}
          height={allocatedHeight}
          showLegend={true}
          showLegendBarLine={false}
        />
      );

    case "Coder 1":
      const coder1Series = [
        {
          name: "Allocated",
          value: coder1StatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Completed",
          value: coder1StatusCountData?.completedCount || 0,
          color: getDashboardStatusColor("2"),
        },
        {
          name: "InProgress",
          value: coder1StatusCountData?.pendingCount || 0,
          color: getDashboardStatusColor("7"),
        },
        // {
        //   name: "QueryPending",
        //   value: coder1StatusCountData?.queryPendingCount || 0,
        //   color: getDashboardStatusColor("4"),
        // },
        // {
        //   name: "QueryApproved",
        //   value: coder1StatusCountData?.queryApprovedCount || 0,
        //   color: getDashboardStatusColor("5"),
        // },
        // {
        //   name: "ReassignedPending",
        //   value: coder1StatusCountData?.reassignedPendingCount || 0,
        //   color: getDashboardStatusColor("3"),
        // },
        // {
        //   name: "ReassignedCompleted",
        //   value: coder1StatusCountData?.reassignedCompletedCount || 0,
        //   color: getDashboardStatusColor("7"),
        // },
      ];

      const {
        categories: coder1Categories,
        formattedSeries: coder1Formatted,
        height: coder1Height,
      } = getFormattedChartData(coder1Series, chartType);

      return coder1StatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={coder1Categories}
          series={coder1Formatted}
          height={coder1Height}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(coder1Series)}
        />
      );

    case "Coder 2":
      const coder2Series = [
        {
          name: "Allocated",
          value: coder2StatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Completed",
          value: coder2StatusCountData?.completedCount || 0,
          color: getDashboardStatusColor("2"),
        },
        {
          name: "InProgress",
          value: coder2StatusCountData?.pendingCount || 0,
          color: getDashboardStatusColor("7"),
        },
        // {
        //   name: "QueryPending",
        //   value: coder2StatusCountData?.queryPendingCount || 0,
        //   color: getDashboardStatusColor("4"),
        // },
        // {
        //   name: "QueryApproved",
        //   value: coder2StatusCountData?.queryApprovedCount || 0,
        //   color: getDashboardStatusColor("5"),
        // },
        // {
        //   name: "ReassignedPending",
        //   value: coder2StatusCountData?.reassignedPendingCount || 0,
        //   color: getDashboardStatusColor("3"),
        // },
        // {
        //   name: "ReassignedCompleted",
        //   value: coder2StatusCountData?.reassignedCompletedCount || 0,
        //   color: getDashboardStatusColor("6"),
        // },
      ];
      const {
        categories: coder2Categories,
        formattedSeries: coder2Formatted,
        height: coder2Height,
      } = getFormattedChartData(coder2Series, chartType);

      return coder2StatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={coder2Categories}
          series={coder2Formatted}
          height={coder2Height}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(coder2Series)}
        />
      );
    case "QA":
      const QASeries = [
        {
          name: "Allocated",
          value: qaStatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Completed",
          value: qaStatusCountData?.completedCount || 0,
          color: getDashboardStatusColor("2"),
        },
        {
          name: "InProgress",
          value: qaStatusCountData?.pendingCount || 0,
          color: getDashboardStatusColor("7"),
        },
        // {
        //   name: "QueryPending",
        //   value: qaStatusCountData?.queryPendingCount || 0,
        //   color: getDashboardStatusColor("4"),
        // },
        // {
        //   name: "QueryApproved",
        //   value: qaStatusCountData?.queryApprovedCount || 0,
        //   color: getDashboardStatusColor("5"),
        // },
        // {
        //   name: "ReassignedPending",
        //   value: qaStatusCountData?.reassignedPendingCount || 0,
        //   color: getDashboardStatusColor("3"),
        // },
        // {
        //   name: "ReassignedCompleted",
        //   value: qaStatusCountData?.reassignedCompletedCount || 0,
        //   color: getDashboardStatusColor("6"),
        // },
      ];
      const {
        categories: QACategories,
        formattedSeries: QAFormatted,
        height: QAHeight,
      } = getFormattedChartData(QASeries, chartType);

      return qaStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={QACategories}
          series={QAFormatted}
          height={QAHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(QASeries)}
        />
      );
    case "Project Lead":
      const PLSeries = [
        {
          name: "Allocated",
          value: projectLeadStatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Completed",
          value: projectLeadStatusCountData?.completedCount || 0,
          color: getDashboardStatusColor("2"),
        },
        {
          name: "InProgress",
          value: projectLeadStatusCountData?.pendingCount || 0,
          color: getDashboardStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: projectLeadStatusCountData?.queryPendingCount || 0,
          color: getDashboardStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: projectLeadStatusCountData?.queryApprovedCount || 0,
          color: getDashboardStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: projectLeadStatusCountData?.reassignedPendingCount || 0,
          color: getDashboardStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: projectLeadStatusCountData?.reassignedCompletedCount || 0,
          color: getDashboardStatusColor("6"),
        },
      ];
      const {
        categories: PLCategories,
        formattedSeries: PLFormatted,
        height: PLHeight,
      } = getFormattedChartData(PLSeries, chartType);

      return projectLeadStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={PLCategories}
          series={PLFormatted}
          height={PLHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(PLSeries)}
        />
      );

    case "QA Lead":
      const QALeadSeries = [
        {
          name: "Allocated",
          value: qaLeadStatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Completed",
          value: qaLeadStatusCountData?.completedCount || 0,
          color: getDashboardStatusColor("2"),
        },
        {
          name: "InProgress",
          value: qaLeadStatusCountData?.pendingCount || 0,
          color: getDashboardStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: qaLeadStatusCountData?.queryPendingCount || 0,
          color: getDashboardStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: qaLeadStatusCountData?.queryApprovedCount || 0,
          color: getDashboardStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: qaLeadStatusCountData?.reassignedPendingCount || 0,
          color: getDashboardStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: qaLeadStatusCountData?.reassignedCompletedCount || 0,
          color: getDashboardStatusColor("6"),
        },
      ];
      const {
        categories: QALeadCategories,
        formattedSeries: QALeadFormatted,
        height: QALeadHeight,
      } = getFormattedChartData(QALeadSeries, chartType);

      return qaLeadStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={QALeadCategories}
          series={QALeadFormatted}
          height={QALeadHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(QALeadSeries)}
        />
      );
    case "Owner":
      const OwnerSeries = [
        {
          name: "Allocated",
          value: ownerStatusCountData?.allocatedCount || 0,
          color: getDashboardStatusColor("1"),
        },
        {
          name: "Completed",
          value: ownerStatusCountData?.completedCount || 0,
          color: getDashboardStatusColor("2"),
        },
        {
          name: "InProgress",
          value: ownerStatusCountData?.pendingCount || 0,
          color: getDashboardStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: ownerStatusCountData?.queryPendingCount || 0,
          color: getDashboardStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: ownerStatusCountData?.queryApprovedCount || 0,
          color: getDashboardStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: ownerStatusCountData?.reassignedPendingCount || 0,
          color: getDashboardStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: ownerStatusCountData?.reassignedCompletedCount || 0,
          color: getDashboardStatusColor("6"),
        },
      ];
      const {
        categories: OwnerCategories,
        formattedSeries: OwnerFormatted,
        height: OwnerHeight,
      } = getFormattedChartData(OwnerSeries, chartType);

      return ownerStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={OwnerCategories}
          series={OwnerFormatted}
          height={OwnerHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(OwnerSeries)}
        />
      );
    case "Users":
      const UsersSeries = [
        {
          name: "Admin",
          value: usersStatusCountData?.usersCount?.admin || 0,
          color: getDashboardRoleColor("1"),
        },
        {
          name: "Coder 1",
          value: usersStatusCountData?.usersCount?.coder1 || 0,
          color: getDashboardRoleColor("2"),
        },
        {
          name: "Coder 2",
          value: usersStatusCountData?.usersCount?.coder2 || 0,
          color: getDashboardRoleColor("3"),
        },
        {
          name: "QA",
          value: usersStatusCountData?.usersCount?.qa || 0,
          color: getDashboardRoleColor("4"),
        },
        {
          name: "QA Lead",
          value: usersStatusCountData?.usersCount?.qaLead || 0,
          color: getDashboardRoleColor("5"),
        },
        {
          name: "Project Lead",
          value: usersStatusCountData?.usersCount?.projectLead || 0,
          color: getDashboardRoleColor("6"),
        },
        {
          name: "Owner",
          value: usersStatusCountData?.usersCount?.owner || 0,
          color: getDashboardRoleColor("7"),
        },
        {
          name: "Downloader",
          value: usersStatusCountData?.usersCount?.downloader || 0,
          color: getDashboardRoleColor("8"),
        },
      ];
      const {
        categories: UsersSeriesCategories,
        formattedSeries: UsersSeriesFormatted,
        height: UsersSeriesHeight,
      } = getFormattedChartData(UsersSeries, chartType);

      return usersStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={UsersSeriesCategories}
          series={UsersSeriesFormatted}
          height={UsersSeriesHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
        />
      );
    case "Accuracy":
      //send both date and value to filter data based on x-axis date
      const accuracyList = accuracyData?.accuracyResultDTOList || [];
      const correctedCodesData = accuracyList.map((item: any) => ({
        date: item.date,
        value: +(item.correctedCodes?.toFixed?.(2) ?? 0),
      }));
      const machineAccuracyData = accuracyList.map((item: any) => ({
        date: item.date,
        value: +(item.machineAccuracy?.toFixed?.(2) ?? 0),
      }));
      const orgAccuracyData = accuracyList.map((item: any) => ({
        date: item.date,
        value: +(item.organisationAccuracy?.toFixed?.(2) ?? 0),
      }));
      const averageMachineAccuracy = accuracyData?.avgMachineAccuracy ?? 0;
      const averageOrganizationAccuracy =
        accuracyData?.avgOrganisationAccuracy ?? 0;
      return (
        <>
          <div
            style={{
              margin: "20px 20px 0px 0px",
              display: "flex",
            }}
            className="flex justify-end"
          >
            <div>
              {/* <Buttonscroller
                Buttons={TabButtons}
                handleButtonClick={handleTabButtonClick}
                activeButton={activeTabButton}
                activeColor="#fff"
                inActiveColor="#000000"
                activeBg="#2472FF"
                // inActiveBg="#E6EEFF"
                containerBg="#E6EEFF"
                width="150px"
              /> */}
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              {accuracyDataLoading || pagesLoader ? (
                <CardSkeleton count={1} height={300} />
              ) : (
                <AccuracyChart
                  type="column"
                  xAxisFontColor="Gray"
                  LeftYaxisFont="black"
                  yAxis1Title="Accuracy Changes Count"
                  yAxis2Title="Accuracy Changes Count"
                  yAxisFont1="#2CAFFE"
                  yAxisFont2="#2472FF"
                  rightYaxisFont="black"
                  selectedValue={selectedValue}
                  customDate={dates}
                  series={[
                    {
                      name: "Total Codes Count",
                      data: correctedCodesData,
                      color: "#2472FF",
                      yAxis: 1,
                      type: "column",
                    },
                    {
                      name:
                        currentTabBtn === "CogentAM Accuracy"
                          ? (companyDetails as any) == "encipher" ||
                            (companyDetails as any) == "abha"
                            ? "CodeGen-i"
                            : "CogentAI Accuracy"
                          : "Organization Score",
                      data:
                        currentTabBtn === "CogentAI Accuracy"
                          ? machineAccuracyData
                          : orgAccuracyData,
                      color: "#2CAFFE",
                      yAxis: 0,
                      type: "spline",
                    },
                  ]}
                />
              )}
            </div>
            <div className="col-3 my-4">
              {accuracyDataLoading || pagesLoader ? (
                <div className="m-2">
                  <CardSkeleton count={1} height={200} />
                </div>
              ) : (
                <div
                  style={{
                    height: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                    border: "0.5px solid #3479FE",
                    backgroundColor: "#F0F6FF",
                  }}
                  className="w-100"
                >
                  <div className="p-4">
                    <div className="flex justify-center py-2">
                      <DashboardOutlined
                        className={`mt-1 ${styles.Img}`}
                      />
                      <div className={styles.heading}>
                        {(currentTabBtn as any) === "CogentAI Accuracy"
                          ? "Accuracy"
                          : "Average Score"}
                      </div>
                    </div>
                    <div className={styles.percentage}>
                      <span className={styles.insideTitle}>
                        {(currentTabBtn as any) === "CogentAI Accuracy" ? (
                          <>
                            {" "}
                            {averageMachineAccuracy
                              ? `${Math.floor(averageMachineAccuracy)}%`
                              : `0%`}
                          </>
                        ) : (
                          <>
                            {" "}
                            {averageOrganizationAccuracy
                              ? `${Math.floor(averageOrganizationAccuracy)}%`
                              : `0%`}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      );
    case "Notificatin":
      return (
        <div className="py-2">
          <Notifications
            useDummyData={true}
            dummyNotificationData={dummyData}
          />
        </div>
      );
    case "allocationStatus":
      return allocationStatusLoading ? (
        <CardSkeleton count={1} height={250} />
      ) : (
        <GroupCard
          chartType={chartType}
          charts={[
            {
              type: chartType,
              size: "col-12",
              categories: dates,
              series: [
                {
                  name: "Pending",
                  data: allocationStatus || [],
                  color: getColorValue("2"),
                  stack: "same",
                  plotConfig: {
                    key: "date",
                    value: "pendingCount",
                    dates: dates,
                  },
                },
                {
                  name: "Completed",
                  data: allocationStatus || [],
                  color: getColorValue("4"),
                  stack: "same",
                  plotConfig: {
                    key: "date",
                    value: "completedCount",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
          stacked={true}
        />
      );
    case "productivityStatus":
      return productivityStatusLoading ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <AccuracyChart
          type="column"
          xAxisFontColor="Gray"
          LeftYaxisFont="black"
          yAxis1Title="Accuracy"
          yAxis2Title="Total Codes"
          yAxisFont1="#2CAFFE"
          yAxisFont2="#2472FF"
          rightYaxisFont="black"
          selectedValue={selectedValue}
          customDate={dates}
          series={[
            {
              name: "Add",
              type: "column",
              color: getColorValue("5"),
              stack: "allocation",
              yAxis: 1,
              data: productivityStatusData,
              plotConfig: {
                key: "date",
                value: "addCount",
              },
            },
            {
              name: "Edit",
              type: "column",
              color: getColorValue("2"),
              stack: "allocation",
              yAxis: 1,
              data: productivityStatusData,
              plotConfig: {
                key: "date",
                value: "editCount",
              },
            },
            {
              name: "Move",
              type: "column",
              color: getColorValue("3"),
              stack: "allocation",
              yAxis: 1,
              data: productivityStatusData,
              plotConfig: {
                key: "date",
                value: "moveCount",
              },
            },
            {
              name: "Delete",
              type: "column",
              color: getColorValue("1"),
              stack: "allocation",
              yAxis: 1,
              data: productivityStatusData,
              plotConfig: {
                key: "date",
                value: "deleteCount",
              },
            },
            {
              name: "Submit",
              type: "column",
              color: getColorValue("4"),
              stack: "allocation",
              yAxis: 1,
              data: productivityStatusData,
              plotConfig: {
                key: "date",
                value: "submitCount",
              },
            },
            {
              name: "Accuracy %",
              type: "spline",
              color: "#2CAFFE",
              yAxis: 0,
              data: productivityStatusData,
              plotConfig: {
                key: "date",
                value: "accuracy",
              },
            },
          ]}
        />
      );
    default:
      break;
  }
};

const Workflow = ({
  selectedRole,
  pagesLoader,
  windowWidth,
  dispatch,
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  data,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  coder1StatusCountData,
  coder1StatusCountDataLoading,
  coder2StatusCountData,
  coder2StatusCountDataLoading,
  qaStatusCountData,
  qaStatusCountDataLoading,
  projectLeadStatusCountData,
  projectLeadStatusCountDataLoading,
  ownerStatusCountData,
  ownerStatusCountDataLoading,
  qaLeadStatusCountData,
  qaLeadStatusCountDataLoading,
  usersStatusCountData,
  usersStatusCountDataLoading,
  accuracyData,
  accuracyDataLoading,
  allocationStatus,
  allocationStatusLoading,
  userDropDown,
  productivityStatusData,
  productivityStatusLoading,
  selectedValue,
  customDate,
  dateRange,
}: WorkflowProps) => {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_month"
        ? getLast30Days()
        : getLast7Days();
  const showDashboard = getSelectedWidgets
    .filter((item: any) => item?.active)
    .sort((a: any, b: any) => a?.orderValue - b?.orderValue);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");
  const [averageReviewerScore, setAverageReviewerScore] = useState(0);
  const [averageEngineScore, setAverageEngineScore] = useState(0);
  const [isUserWise, setIsUserWise] = useState<Record<string, any>>({});
  const [patientTypeFilter, setPatientTypeFilter] = useState<Record<string, any>>({});
  const [userFilter, setUserFilter] = useState<Record<string, any>>({});

  const { userName = "" } = getStorage("userName") as any;
  const showModal = () => {
    setIsOrgModalOpen(true);
  };
  const handleOk = () => {
    setIsOrgModalOpen(false);
  };
  const handleCancel = () => {
    setIsOrgModalOpen(false);
    console.log("handle cancel called");
  };
  const handleTabButtonClick = (index: any, btn: any) => {
    setActiveTabButton(index);
    setCurrentTabBtn(btn);
  };
  const getInitialApiCall = async () => {
    const commonParams = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };

    try {
      const api = [
        {
          key: "workFlowFilesCount",
          params: commonParams,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c023"],
        },
        {
          key: "workFlowAllocatedStatusCount",
          params: commonParams,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c024"],
        },
        {
          key: "workFlowUsersCount",
          params: {},
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c037"],
        },
        {
          key: "workFlowAccuracy",
          params: commonParams,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c038"],
        },
      ];

      const independentApiKeys = api.filter((item) =>
        item.widgetId?.some((id) =>
          showDashboard.some((widget) => widget.widgetId === id),
        ),
      );

      for (const { key, params } of independentApiKeys) {
        const actionKey = `${key}Action`;
        if (typeof actions[actionKey] === "function") {
          dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
      const api1 = [
        {
          key: "workFlowCoder1StatusCount",
          roleId: 4,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c025"],
        },
        {
          key: "workFlowCoder2StatusCount",
          roleId: 5,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c026"],
        },
        {
          key: "workFlowQAStatusCount",
          roleId: 6,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c027"],
        },
        {
          key: "workFlowProjectLeadStatusCount",
          roleId: 8,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c028"],
        },
        {
          key: "workFlowOwnerStatusCount",
          roleId: 2,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c036"],
        },
        {
          key: "workFlowQALeadStatusCount",
          roleId: 7,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c029"],
        },
      ];

      const roleBasedApiKeys = api1.filter((item) =>
        item.widgetId?.some((id) =>
          showDashboard.some((widget) => widget.widgetId === id),
        ),
      );

      const roleApiCalls = roleBasedApiKeys.map(({ key, roleId }) => {
        const actionKey = `${key}Action`;
        const params = { ...commonParams, roleId };
        if (typeof actions[actionKey] === "function") {
          dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
          return Promise.resolve();
        }
      });

      await Promise.all(roleApiCalls);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getAllocationStatusCall = async () => {
    const allocationParams = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      patientType: patientTypeFilter?.allocationStatus || "",
      user: userFilter?.allocationStatus || "",
    };
    const api = [
      {
        key: "workFlowAllocationStatus",
        params: allocationParams,
        widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c056"],
      },
    ];
    const independentApiKeys = api.filter((item) =>
      item.widgetId?.some((id) =>
        showDashboard.some((widget) => widget.widgetId === id),
      ),
    );

    for (const { key, params } of independentApiKeys) {
      try {
        const actionKey = `${key}Action`;
        if (typeof actions[actionKey] === "function") {
          dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      } catch (error) {
        console.error(error, "Api Errro");
      }
    }
  };

  const getProductivityStatusCall = async () => {
    const allocationParams = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      patientType: patientTypeFilter?.productivityStatus || "",
      user: userFilter?.productivityStatus || "",
    };
    const api = [
      {
        key: "productivityStatusChart",
        params: allocationParams,
        widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c057"],
      },
    ];
    const independentApiKeys = api.filter((item) =>
      item.widgetId?.some((id) =>
        showDashboard.some((widget) => widget.widgetId === id),
      ),
    );

    for (const { key, params } of independentApiKeys) {
      try {
        const actionKey = `${key}Action`;
        if (typeof actions[actionKey] === "function") {
          dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      } catch (error) {
        console.error(error, "Api Errro");
      }
    }
  };

  const getUserDropDown = async () => {
    const actionKey = `getUserDropDownAction`;
    try {
      await dispatch(actions[actionKey](""));
    } catch (error) {
      console.error("Action not found", error);
    }
  };

  const userDropDownList = useMemo(
    () =>
      userDropDown?.map((item: any) => ({
        label: item?.userName,
        value: item?.email,
      })),
    [userDropDown],
  );

  useEffect(() => {
    getInitialApiCall();
  }, [dateRange, getSelectedWidgets]);

  useEffect(() => {
    getAllocationStatusCall();
  }, [
    dateRange,
    getSelectedWidgets,
    patientTypeFilter?.allocationStatus,
    userFilter?.allocationStatus,
  ]);

  useEffect(() => {
    getProductivityStatusCall();
  }, [
    dateRange,
    getSelectedWidgets,
    patientTypeFilter?.productivityStatus,
    userFilter?.productivityStatus,
  ]);

  useEffect(() => {
    getUserDropDown();
  }, [getSelectedWidgets]);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <>
      {getSelectedWidgetsLoader ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            padding: 20,
          }}
          className="container-fluid"
        >
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 10,
            height: "100%",
          }}
          className="container-fluid"
        >
          {showDashboard?.map((item, id) => {
            const style = {
              gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div className="dynamicChart" key={id} style={style}>
                <Card>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-3 items-center">
                        <section>
                          <div className="font-bold mb-2 text-xl">
                            {item.title === "Notifications" ? null : item.title}
                          </div>
                        </section>
                        {(item?.widgetName == "productivityStatus" ||
                          item?.widgetName === "allocationStatus") && (
                          <div>
                            <Select
                              style={{ width: "150px" }}
                              placeholder={"Select Patient Type"}
                              dropdownStyle={{ zIndex: 100000 }}
                              options={[
                                {
                                  label: "In-Patient",
                                  value: "INPATIENT",
                                },
                                {
                                  label: "Out-Patient",
                                  value: "OUTPATIENT",
                                },
                              ]}
                              onChange={(e) => {
                                setPatientTypeFilter((prev) => ({
                                  ...prev,
                                  [item?.widgetName]: e,
                                }));
                              }}
                              allowClear
                            />
                          </div>
                        )}
                      </div>
                      {isUserWise?.[item?.widgetName] &&
                        (item?.widgetName === "allocationStatus" ||
                          item?.widgetName === "productivityStatus") && (
                          <div>
                            <Select
                              placeholder="Select User"
                              style={{
                                width: "150px",
                              }}
                              dropdownStyle={{ zIndex: 100000 }}
                              options={userDropDownList}
                              allowClear
                              onChange={(e) => {
                                setUserFilter((prev) => ({
                                  ...prev,
                                  [item?.widgetName]: e,
                                }));
                              }}
                            />
                          </div>
                        )}
                    </div>

                    <div className="m-2 flex gap-3 items-center">
                      {(item?.widgetName === "allocationStatus" ||
                        item?.widgetName === "productivityStatus") && (
                        <div className="flex items-center gap-2 dashboardSwitch cursor-pointer">
                          <div
                            className={`${!isUserWise?.[item?.widgetName] ? "active" : ""} px-2 py-1`}
                            onClick={() => {
                              setIsUserWise((prev) => ({
                                ...prev,
                                [item?.widgetName]: false,
                              }));
                              setUserFilter((prev) => ({
                                ...prev,
                                [item?.widgetName]: "",
                              }));
                            }}
                          >
                            Overall
                          </div>
                          <div
                            className={`${isUserWise?.[item?.widgetName] ? "active" : ""} px-2 py-1`}
                            onClick={() =>
                              setIsUserWise((prev) => ({
                                ...prev,
                                [item?.widgetName]: true,
                              }))
                            }
                          >
                            User Wise
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {getCharts({
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                    isOrgModalOpen,
                    showModal,
                    handleOk,
                    handleCancel,
                    handleTabButtonClick,
                    currentTabBtn,
                    activeTabButton,
                    averageEngineScore,
                    averageReviewerScore,
                    filesCountData,
                    filesCountDataLoading,
                    allocatedStatusCountData,
                    allocatedStatusCountDataLoading,
                    coder1StatusCountData,
                    coder1StatusCountDataLoading,
                    coder2StatusCountData,
                    coder2StatusCountDataLoading,
                    qaStatusCountData,
                    qaStatusCountDataLoading,
                    projectLeadStatusCountData,
                    projectLeadStatusCountDataLoading,
                    ownerStatusCountData,
                    ownerStatusCountDataLoading,
                    qaLeadStatusCountData,
                    qaLeadStatusCountDataLoading,
                    usersStatusCountData,
                    usersStatusCountDataLoading,
                    accuracyData,
                    accuracyDataLoading,
                    selectedValue,
                    dates,
                    allocationStatus,
                    allocationStatusLoading,
                    productivityStatusData,
                    productivityStatusLoading,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
    </>
  );
};
const enhancer = connect((state: any) => ({
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsListLoader,
  data: state.admin?.dashboard1,
  filesCountData: state.admin?.dashboard1?.workFlowFilesCount?.data?.response,
  filesCountDataLoading: state.admin?.dashboard1?.workFlowFilesCountLoader,
  allocatedStatusCountData:
    state.admin?.dashboard1?.workFlowAllocatedStatusCount?.data?.response,
  allocatedStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowAllocatedStatusCountLoader,
  coder1StatusCountData:
    state.admin?.dashboard1?.workFlowCoder1StatusCount?.data?.response,
  coder1StatusCountDataLoading:
    state.admin?.dashboard1?.workFlowCoder1StatusCountLoader,
  coder2StatusCountData:
    state.admin?.dashboard1?.workFlowCoder2StatusCount?.data?.response,
  coder2StatusCountDataLoading:
    state.admin?.dashboard1?.workFlowCoder2StatusCountLoader,
  qaStatusCountData:
    state.admin?.dashboard1?.workFlowQAStatusCount?.data?.response,
  qaStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowQAStatusCountLoader,
  projectLeadStatusCountData:
    state.admin?.dashboard1?.workFlowProjectLeadStatusCount?.data?.response,
  projectLeadStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowProjectLeadStatusCountLoader,
  ownerStatusCountData:
    state.admin?.dashboard1?.workFlowOwnerStatusCount?.data?.response,
  ownerStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowOwnerStatusCountLoader,
  qaLeadStatusCountData:
    state.admin?.dashboard1?.workFlowQALeadStatusCount?.data?.response,
  qaLeadStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowQALeadStatusCountLoader,
  usersStatusCountData:
    state.admin?.dashboard1?.workFlowUsersCount?.data?.response,
  usersStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowUsersCountLoader,
  accuracyData: state.admin?.dashboard1?.workFlowAccuracy?.data?.response,
  accuracyDataLoading: state.admin?.dashboard1?.workFlowAccuracyLoader,
  allocationStatus:
    state?.admin?.dashboard1?.workFlowAllocationStatus?.data?.response,
  allocationStatusLoading:
    state?.admin?.dashboard1?.workFlowAllocationStatusLoader,
  userDropDown: state?.admin?.dashboard1?.getUserDropDown?.data?.response,
  productivityStatusData:
    state?.admin?.dashboard1?.productivityStatusChart?.data?.response,
  productivityStatusLoading:
    state?.admin?.dashboard1?.productivityStatusChartLoader,
}));

export default enhancer(Workflow);
