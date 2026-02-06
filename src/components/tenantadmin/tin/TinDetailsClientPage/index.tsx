"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { connect, ConnectedProps } from "react-redux";

import { actions as tableAction } from "@/state/table";
import ContentLayout from "@/components/layout/ContentLayout/page";
import { getAccessTabItems } from "@/resuabelFunction/Menu";
import { findMatchesByField, generateHeaderTab } from "@/util/reusableFunction";
import TableViewType, { metaDataType } from "@/state/table/model";
import PatientsTab from "./components/patients";
import PatientAllocation from "./components/patientAllocation";
import {
  activeTinPageId,
  moveBackPageId,
  patientAllocationPageId,
  patientPageId,
  reAllocationPageId,
} from "@/util/pageIds";
import { tinPatientTableResposneType } from "@/models/tenantadmin/tin/patients";
import PageHeaderLayout from "@/components/layout/pageHeaderLayout/page";
import { getStorage } from "@/util/storage";
import { getTable } from "@/state/table/network";
import { contentArrayType } from "@/models/tenantadmin/tin";
import { useRouter } from "next/navigation";
import PatientReAllocation from "./components/patientReAllocation";
import MoveBack from "./components/moveback";

type TinDetailsPropsType = ConnectedProps<typeof connector>;
function TinDetailsClientPage({
  tableData,
  tableLoader,
  tableCustomizationCall,
}: TinDetailsPropsType) {
  const router = useRouter();
  const tinDetailsTab = useMemo(() => {
    return getAccessTabItems({
      page: "TIN",
      tab: "tabMenuList2",
    });
  }, []);

  const [activeTab, setActiveTab] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  const [triggerTableCustomization, setTriggerTableCustomization] = useState<
    Record<string, boolean>
  >({
    patients: false,
    patientallocation: false,
    reallocation: false,
    moveback: false,
  });

  const [tinInfoList, setTinInfoList] = useState<
    { title: string; value: string | number }[]
  >([]);

  const [allocateModal, setAllocateModal] = useState(false);
  const [reAllocateModal, setReAllocateModal] = useState(false);
  const [moveBackModal, setMoveBackModal] = useState(false);
  const [patientAllocationHasSelection, setPatientAllocationHasSelection] =
    useState(false);
  const [patientReAllocationHasSelection, setPatientReAllocationHasSelection] =
    useState(false);
  const [patientMoveBackSelection, setPatientMoveBackSelection] =
    useState(false);

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      try {
        let pageId;
        switch (activeTab.toLowerCase()) {
          case "patients":
            pageId = patientPageId;
            break;
          case "patient allocation":
            pageId = patientAllocationPageId;
            break;
          case "reallocation":
            pageId = reAllocationPageId;
            break;
          case "moveback":
            pageId = moveBackPageId;
            break;
        }
        const payload = {
          pageId,
          headerNames: data,
        };

        const res = await tableCustomizationCall({ payload });

        if (res?.status == "SUCCESS") {
          const triggerTab = activeTab?.replace(/\s+/g, "").toLowerCase();
          setTriggerTableCustomization((prev) => ({
            ...prev,
            [triggerTab]: true,
          }));
        }
      } catch (e) {
        console.error(
          e,
          "Error Occur while tableCustomization call in the tinDetails",
        );
      }
    },
    [setTriggerTableCustomization, activeTab, tableCustomizationCall],
  );

  const handleTabsButton = useCallback(() => {
    switch (activeTab.toLowerCase()) {
      case "patient allocation":
        return [
          {
            isBtn: true,
            btnTitle: "Allocate",
            onClick: () => setAllocateModal(true),
            loading: tableLoader,
            disable: !patientAllocationHasSelection,
          },
        ];
      case "reallocation":
        return [
          {
            isBtn: true,
            btnTitle: "Re Allocate",
            onClick: () => setReAllocateModal(true),
            loading: tableLoader,
            disable: !patientReAllocationHasSelection,
          },
        ];

      case "moveback":
        return [
          {
            isBtn: true,
            btnTitle: "Move Back",
            onClick: () => setMoveBackModal(true),
            loading: tableLoader,
            disable: !patientMoveBackSelection,
          },
        ];
      default:
        return [];
    }
  }, [
    activeTab,
    tableLoader,
    setAllocateModal,
    patientAllocationHasSelection,
    patientReAllocationHasSelection,
    patientMoveBackSelection,
    setReAllocateModal,
    setMoveBackModal,
  ]);

  const handleTabChange = useCallback(
    ({ item }: { item: { label: string; value: string } }) => {
      setActiveTab(item?.value);
      setPatientAllocationHasSelection(false);
    },
    [],
  );
  const [tableCustomization, setTableCustomization] = useState<boolean>(false);
  const tabList = useMemo(() => {
    return {
      isTab: true,
      tabList: generateHeaderTab({
        tabList: tinDetailsTab,
      }).filter(
        (item: { label: string; value: string }) =>
          item?.value != "Query Approval",
      ),
      activeTab,
      onClick: ({ item }: { item: { label: string; value: string } }) =>
        handleTabChange({ item }),
    };
  }, [handleTabChange, activeTab, tinDetailsTab]);

  const layoutList = useMemo(() => {
    return [
      { isFilter: true, data: tableData?.metaDataDTO, loading: tableLoader },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: () => setTableCustomization(!tableCustomization),
        loading: tableLoader,
      },
      ...handleTabsButton(),
    ];
  }, [
    tableData,
    tableLoader,
    tableCustomization,
    setTableCustomization,
    handleTabsButton,
  ]);

  const tinInfoCall = useCallback(async () => {
    const result = await getTable({
      pageId: activeTinPageId,
      pageNo: 0,
      pageSize: 15,
      roleId: "",
      projectId: "test",
      allTinIds: false,
    });
    return result;
  }, []);

  const onHandleBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const fetchTinInfo = async () => {
      setLoading(true);
      const result = await tinInfoCall();
      const tinId = getStorage("tinId");
      if (result?.status == "SUCCESS") {
        const headers = result?.response?.pageResponse?.content.filter(
          (item: contentArrayType) => item?.id == tinId,
        )?.[0];
        const row = result?.response?.metaDataDTO;

        setTinInfoList(
          row.map((h: metaDataType) => ({
            title: h.headerName,
            value: headers?.[h.actualField],
          })),
        );
        setLoading(false);
      }
    };

    fetchTinInfo();
  }, []);

  useEffect(() => {
    setActiveTab(tinDetailsTab?.[0]);
  }, []);

  useEffect(() => {
    if (
      tableData?.metaDataDTO ||
      !findMatchesByField(activeFilters, tableData?.metaDataDTO)
    ) {
      setActiveFilters(
        tableData?.metaDataDTO.filter(
          (item) => item.active && item?.filter?.style,
        ),
      );
      setSelectedColumns(tableData?.metaDataDTO);
      // setIsFilter(false);
    }
  }, [tableData?.metaDataDTO, tableLoader]);

  return (
    <div>
      <ContentLayout
        pageTitle="Tenant"
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

      <PageHeaderLayout
        data={tinInfoList}
        onHandleBack={onHandleBack}
        loading={loading}
      />

      <div>
        {activeTab.toLowerCase() === "patients" && (
          <PatientsTab
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            triggerTableCustomization={triggerTableCustomization}
            setTriggerTableCustomization={setTriggerTableCustomization}
          />
        )}
        {activeTab.toLowerCase() === "patient allocation" && (
          <PatientAllocation
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            triggerTableCustomization={triggerTableCustomization}
            setTriggerTableCustomization={setTriggerTableCustomization}
            onSelectionChange={setPatientAllocationHasSelection}
            allocateModal={allocateModal}
            setAllocateModal={setAllocateModal}
          />
        )}
        {activeTab.toLowerCase() === "reallocation" && (
          <PatientReAllocation
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            triggerTableCustomization={triggerTableCustomization}
            setTriggerTableCustomization={setTriggerTableCustomization}
            onSelectionChange={setPatientReAllocationHasSelection}
            allocateModal={reAllocateModal}
            setAllocateModal={setReAllocateModal}
          />
        )}

        {activeTab.toLowerCase() === "moveback" && (
          <MoveBack
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            triggerTableCustomization={triggerTableCustomization}
            setTriggerTableCustomization={setTriggerTableCustomization}
            onSelectionChange={setPatientMoveBackSelection}
            allocateModal={moveBackModal}
            setAllocateModal={setMoveBackModal}
          />
        )}
      </div>
    </div>
  );
}

const connector = connect(
  (state: { tableView: TableViewType<tinPatientTableResposneType> }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    tableCustomizationCall: tableAction?.tableDynamicColumn,
  },
);

export default connector(TinDetailsClientPage);
