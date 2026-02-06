"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

import ContentLayout from "@/components/layout/ContentLayout/page";
import { generateHeaderTab } from "@/util/reusableFunction";
import { getAccessTabItems } from "@/resuabelFunction/Menu";
import { connect } from "react-redux";
import TableViewType, { metaDataType } from "@/state/table/model";
import { actions as tableAction } from "@/state/table";
import { projectPropsType } from "@/models/tenantadmin/project";
import { patientProjectPageId } from "@/util/pageIds";
import Patients from "@/components/tenantadmin/projects/patients";
import { getProjectTableView } from "@/models/tenantadmin/project/patient";
import Batch from "@/components/tenantadmin/projects/batch";

function Project({
  tableData,
  tableLoader,
  tableCustomizationCall,
}: projectPropsType) {
  const [activeTab, setActiveTab] = useState<string>("");

  const [tableCustomization, setTableCustomization] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  const [insertTable, setInsertTable] = useState<string>("");

  const projectTab = useMemo(() => {
    return getAccessTabItems({
      page: "Project",
      tab: "tabMenuList",
    })?.map((item: string) => (item == "Sync" ? "Batch" : item));
  }, []);

  const handleTabChange = useCallback(
    ({ item }: { item: { label: string; value: string } }) => {
      setActiveTab(item?.value);
    },
    [],
  );

  const handleTableCustomizationClick = useCallback(() => {
    setTableCustomization((prev) => !prev);
  }, []);

  const layoutList = useMemo(
    () => [
      {
        isFilter: true,
        data: tableData?.metaDataDTO,
        loading: tableLoader,
      },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: handleTableCustomizationClick,
        loading: tableLoader,
      },
    ],
    [tableLoader, tableData?.metaDataDTO, handleTableCustomizationClick],
  );

  const tabList = useMemo(() => {
    return {
      isTab: true,
      tabList: generateHeaderTab({
        tabList: projectTab,
      }),
      activeTab: activeTab,
      onClick: ({ item }: { item: { label: string; value: string } }) =>
        handleTabChange({ item }),
    };
  }, [activeTab, projectTab, handleTabChange]);

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      const payload = {
        pageId: patientProjectPageId,
        headerNames: data,
      };

      const res = await tableCustomizationCall({ payload });
      if (res?.status == "SUCCESS") {
        setInsertTable(activeTab);
        setTableCustomization(false);
      }
    },
    [tableCustomizationCall, activeTab],
  );

  useEffect(() => {
    setActiveTab(projectTab?.[0]);
  }, [projectTab]);

  return (
    <>
      <ContentLayout
        pageTitle="Project"
        tabList={tabList}
        layoutList={layoutList}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        tableCustomization={tableCustomization}
        tableCustomizationData={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        handleInsert={handleInsert}
        setTableCustomization={setTableCustomization}
      />
      {activeTab == "Patients" && (
        <div className="content">
          <Patients
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            setSelectedColumns={setSelectedColumns}
            insertTable={insertTable}
            setInsertTable={setInsertTable}
          />
        </div>
      )}
      <div>{activeTab == "Batch" && <Batch />}</div>
    </>
  );
}

const connector = connect(
  (state: { tableView: TableViewType<getProjectTableView> }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    tableCustomizationCall: tableAction?.tableDynamicColumn,
  },
);

export default connector(Project);
