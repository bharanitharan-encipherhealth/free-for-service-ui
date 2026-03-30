import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Card, Skeleton } from "antd";
import AppChart from "../../appchart";
import ReusableTable from "../../table";
import StatCard from "../../statChart";
import GroupCard from "../../groupcard";
import {
  DefaultWidget,
  filterWidgetsByRole,
  getFormattedChartData,
  parseKValue,
  useHasMounted,
  useWindowWidth,
  Widget,
} from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import { connect } from "react-redux";
import {
  fileCountData,
  statCardsData,
  statCardData,
  rafAndRevenue,
  totalCodes,
  potientialCodes,
  careGapCodes,
  top10DiseasesMock,
  topOIGCodesMock,
  fileChartSeries,
  hccCodes,
  tinTableMock,
  overallPerformance,
  diseasesPerformance,
  CareGapPerformance,
  PotentialPerformance,
  patientOverllCountData,
  inPatientDetailsData,
  outPatientDetailsData,
} from "./mockData";
import { getColorValue } from "@/util/reusableFunction";
import CardSkeleton from "@/components/skeleton/card";
import { AllocatedStatus } from "@/components/tenantadmin/dashboard/component/layout/workflow/mockData";
import { WorkFlow } from "@/components/tenantadmin/dashboard/component/layout/workQueue/mockData";
const getCharts = ({ type, chartType, chartChange, windowWidth, selectedRole }: { type: string; chartType: string; chartChange: boolean; windowWidth: number | null; selectedRole: string }) => {
  switch (type) {
    case "filecount":
      if (chartType === "card") {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              gap: "20px",
            }}
            className="mx-auto"
          >
            {fileCountData.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
              />
            ))}
          </div>
        );
      }
      const formattedChartData = fileCountData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: fileChartCategories,
        formattedSeries: fileChartFormatted,
        height: fileChartHeight,
      } = getFormattedChartData(formattedChartData, chartType);

      return chartChange ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategories}
          series={fileChartFormatted}
          height={chartType !== "card" ? 250 : fileChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          title={"Total Count"}
        />
      );

    case "RafAndRevenue":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={rafAndRevenue({ chartType })} />
      );
    case "TotalCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={totalCodes({ chartType })} />
      );
    case "HccCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={hccCodes({ chartType })} />
      );
    case "CareGapCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={careGapCodes({ chartType })} />
      );
    case "PotientialCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={potientialCodes({ chartType })} />
      );
    case "labAndRadialogy":
      return (
        <div>
          <div className="flex gap-3">
            {statCardsData.map((card) => (
              <StatCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                padding="16px"
                minWidth="140px"
                gap="12px"
                display="flex"
                alignItems="center"
                borderRadius="12px"
                height="60px"
                fontWeight={
                  card.title === "Processing" || card.title === "Failed"
                    ? "900"
                    : undefined
                }
                justifyContent="center"
                textColor={"white"}
                border="3px solid #B3B3B3"
              />
            ))}
          </div>
          {chartChange ? (
            <CardSkeleton count={1} height={300} />
          ) : (
            <AppChart
              type={chartType}
              categories={[
                "Feb 26",
                "Mar 1",
                "Mar 4",
                "Mar 7",
                "Mar 9",
                "Mar 13",
                "Mar 16",
              ]}
              series={[
                {
                  name: "Lab",
                  data: [0, 0, 12.34, 0, 3, 0],
                  color: getColorValue("5"),
                  area: chartType === "area" ? true : false,
                },
                {
                  name: "Radiology",
                  data: [20, 56, 34, 67, 12],
                  color: getColorValue("6"),
                  area: chartType === "area" ? true : false,
                },
              ]}
            />
          )}
        </div>
      );
    case "fileChart": {
      const fileChartData = fileCountData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: fileChartCats,
        formattedSeries: fileChartFmtSeries,
      } = getFormattedChartData(fileChartData, chartType);
      return (
        <div className="row">
        <div className="flex flex-wrap justify-between w-full gap-3">
            {statCardData.map((card) => (
              <StatCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                padding="10px"
                minWidth="165px"
                gap="12px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="16px"
                height="65px"
                textColor={"white"}
                fontSize="16px"
                fontWeight={700}
                textAlign={"center"}
                border="3px solid #B3B3B3"
              />
            ))}
          </div>

          {chartChange ? (
            <CardSkeleton count={1} height={300} />
          ) : (
            <AppChart
              type={chartType}
              categories={fileChartCats}
              series={fileChartFmtSeries}
            />
          )}
        </div>
      );
    }
    case "Top10Diseases":
      return (
        <ReusableTable
          title="Top 10 Diseases"
          items={top10DiseasesMock}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TopOIGCodes":
      return (
        <ReusableTable
          title="Top 10 OIG Codes"
          items={topOIGCodesMock}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TinTable":
      return (
        <ReusableTable
          title="TIN Status Table"
          items={tinTableMock}
          columns={[
            { title: "TIN Number", dataIndex: "tinNumber" },
            { title: "TIN Name", dataIndex: "tinName", className: "midRow" },
            {
              title: "Status",
              dataIndex: "progressPercentage",
              isProgress: true,
            },
          ]}
        />
      );
    case "AllocatedStatus":
      return (
        <AllocatedStatus chartType={chartType} chartChange={chartChange} />
      );
    case "OverallPerformance":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={overallPerformance({ chartType })} />
      );
    case "DiseasesPerformance":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={diseasesPerformance({ chartType })} />
      );
    case "CareGapPerformance":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={CareGapPerformance({ chartType })} />
      );
    case "PotentialPerformance":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={PotentialPerformance({ chartType })} />
      );
    case "patientOverllCount":
      return (
        <WorkFlow
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
          chartData={patientOverllCountData}
        />
      );
    case "inPatientDetails":
      if (chartType === "card") {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              gap: "20px",
              height: "100%",
            }}
            className="mx-auto"
          >
            {inPatientDetailsData?.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
                fontSize={"20px"}
              />
            ))}
          </div>
        );
      }
      const formatInPatientDetailsData = inPatientDetailsData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: outPatientChartCategories,
        formattedSeries: inPatientChartFormatted,
        height: inPatientChartHeight,
      } = getFormattedChartData(formatInPatientDetailsData, chartType);

      return chartChange ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={outPatientChartCategories}
          series={inPatientChartFormatted}
          height={chartType !== "card" ? 250 : inPatientChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          title={"Total Count"}
        />
      );
    case "outPatientDetails":
      if (chartType === "card") {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              gap: "20px",
              height: "100%",
            }}
            className="mx-auto"
          >
            {outPatientDetailsData?.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
                fontSize={"20px"}
              />
            ))}
          </div>
        );
      }
      const formatOutPatientDetailsData = outPatientDetailsData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: inPatientChartCategorie,
        formattedSeries: outPatientChartFormatted,
        height: outPatientChartHeight,
      } = getFormattedChartData(formatOutPatientDetailsData, chartType);

      return chartChange ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={inPatientChartCategorie}
          series={outPatientChartFormatted}
          height={chartType !== "card" ? 250 : outPatientChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          title={"Total Count"}
        />
      );
    default:
      break;
  }
};


interface DefaultProps {
  isDragable: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: Widget[];
  setDashboard: Dispatch<SetStateAction<Widget[]>>;
  getSelectedWidgets: any[];
  selectedRole: string;
}

function Default({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}: DefaultProps) {
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  const [components, setComponents] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    if (getSelectedWidgets) {
      setComponents(getSelectedWidgets?.filter((d) => !d.active));
    }
  }, [getSelectedWidgets]);

  if (!hasMounted)
    return (
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="grid grid-cols-1 gap-4 p-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-full md:w-1/2">
                <CardSkeleton count={1} height={300} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );

  return (
    <>
      {isDragable ? (
        <DndFunction
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          dashboard={dashboard}
          setDashboard={setDashboard}
          components={components}
          setComponents={setComponents}
          getCharts={(params: any) =>
            getCharts({
              ...params,
              windowWidth,
              selectedRole,
              chartChange: false,
            })
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
        >
          {filterWidgetsByRole(DefaultWidget, selectedRole)
            ?.sort((a, b) => a.orderValue - b.orderValue)
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style}>
                  <Card className="h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.title && item.title !== "Notifications" && (
                          <div className="mb-2 text-xl font-bold">
                            {item.title}
                          </div>
                        )}
                      </div>

                      <div className="m-2">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          id="selectAll"
                          checked={selectedItems?.some(
                            (element: any) => element.widgetId == item.widgetId,
                          )}
                          onClick={() => handleSelect(item)}
                        />
                      </div>
                    </div>

                    {getCharts({
                      type: item.widgetName,
                      chartType: item.selectedChart,
                      chartChange: false,
                      windowWidth,
                      selectedRole,
                    })}
                  </Card>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
const enhancer = connect(
  (state: any) => ({
    getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  }),
  {},
);
export default enhancer(Default);
