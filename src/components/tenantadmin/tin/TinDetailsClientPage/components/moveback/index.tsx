import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as productivityAction } from "@/state/tenantadmin/productivity";
import { MovebackParamsType } from "@/models/tenantadmin/tin/moveback";
import { moveBackPageId } from "@/util/pageIds";
import productivityReducerType from "@/state/tenantadmin/productivity/model";
import { generateHeaderTab } from "@/util/reusableFunction";
import ContentLayout from "@/components/layout/ContentLayout/page";
import TableViewType from "@/state/table/model";
import { tinPatientReAllocationTableResposneType } from "@/models/tenantadmin/tin/patientReAllocation";
import { actions as tableAction } from "@/state/table";
import { getStorage } from "@/util/storage";
import ReusableFilters from "@/components/ReusbaleFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { handleRowCheckboxChangeType } from "@/models/ReusabelTable";
import { getTable } from "@/state/table/network";
import { checkAllPatientIdType } from "@/models/tenantadmin/tin/patientAllocation";
import MoveBackModal from "./components/movebackModal";

type patientMoveBackTabReduxType = ConnectedProps<typeof connector>;
type patientMoveBackTabProps = MovebackParamsType & patientMoveBackTabReduxType;
function MoveBack({
  activeFilters,
  setActiveFilters,
  triggerTableCustomization,
  setTriggerTableCustomization,
  onSelectionChange,
  allocateModal,
  setAllocateModal,
  getRolesTab,
  allAllocationRoleData,
  allAllocationRoleLoading,
  getTableView,
  tableData,
  tableLoader,
}: patientMoveBackTabProps) {
  const prevMoveBackModalRef = useRef<boolean | undefined>(undefined);
  const tin = getStorage("tinNumber");
  const [activeTab, setActiveTab] = useState<string>("");
  const [roleAliasName, setRoleAliasName] = useState("");
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [pageNo, setPageNo] = useState(0);
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
  });
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectedDates, setSelectedDates] = useState({});
  const [row, setRow] = useState<number>(15);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [checkedLoader, setCheckedLoader] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(false);

  const handleTabChange = useCallback(
    ({ item }: { item: { label: string; value: string } }) => {
      setActiveTab(item?.value);
      setRoleAliasName(item?.label);
      setSelectedDates({});
      setSelectedDateRanges({});
      setSelectedOption({});
      setSearchText({});
    },
    [],
  );
  const tabList = useMemo(() => {
    return {
      isTab: true,
      tabList: generateHeaderTab({
        tabList: allAllocationRoleData?.allocationRoles,
        value: "aliasName",
        id: "roleId",
      }),
      loading: allAllocationRoleLoading,
      activeTab: activeTab,
      onClick: ({ item }: { item: { label: string; value: string } }) =>
        handleTabChange({ item }),
      value: "aliasName",
    };
  }, [
    activeTab,
    allAllocationRoleData,
    allAllocationRoleLoading,
    handleTabChange,
  ]);

  const getAllRoles = useCallback(async () => {
    try {
      const res = await getRolesTab({ pageId: moveBackPageId });
      if (res?.status == "SUCCESS") {
        setActiveTab(res?.response?.allocationRoles?.[0]?.roleId);
      }
    } catch (e) {
      console.error("Error Occur while role api in the moveback");
    }
  }, [getRolesTab]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  const handleRowChange = ({ value }: { value: number }) => {
    const totalRecords = tableData?.pageResponse?.totalElements || 0;

    const newTotalPages = Math.ceil(totalRecords / value);

    setRow(value);

    if (pageNo >= newTotalPages && newTotalPages > 0) {
      setPageNo(newTotalPages - 1);
      setPaginationFirst((newTotalPages - 1) * value);
    }
  };

  const getMoveBack = useCallback(async () => {
    try {
      await getTableView({
        pageId: moveBackPageId,
        pageNo,
        pageSize: 15,
        roleId: activeTab,
        tin,
        selectedOption,
        searchText,
        sort,
        selectedDateRanges,
      });
      setTriggerTableCustomization((prev) => ({
        ...prev,
        moveback: false,
      }));
    } catch (e) {
      console.error("Error Occur while table call in the move back");
    }
  }, [
    getTableView,
    pageNo,
    activeTab,
    selectedOption,
    selectedDateRanges,
    searchText,
    sort,
    roleAliasName,
    setTriggerTableCustomization,
    tin,
  ]);

  const handleRowCheckboxChange = useCallback(
    async ({ e, row, singleCheck, checked }: handleRowCheckboxChangeType) => {
      if (!singleCheck) {
        if (checked) {
          setCheckedLoader(true);
          setCheckedHeader(true);
          const response = await getTable({
            allPatientIds: checked,
            pageId: moveBackPageId,
            pageNo: 0,
            pageSize: 15,
            roleId: activeTab,
            searchText,
            selectedOption,
            selectedDateRanges,
            isMasterAudit: false,
          });
          if (response?.status === "SUCCESS") {
            const result = response?.response?.patientIds?.map(
              (patient: checkAllPatientIdType) => ({
                patientId: patient?.patientId,
                patientName: patient.patientName,
              }),
            );

            setSelectedRows(
              result.map((patient: checkAllPatientIdType) => patient.patientId),
            );
          }
        } else {
          setSelectedRows([]);

          setCheckedLoader(false);
          setCheckedHeader(false);
        }
      } else {
        setSelectedRows((prev) => {
          const updatedSelection = e.target.checked
            ? [...prev, row.patientId]
            : prev.filter((id) => id !== row.patientId);
          return updatedSelection;
        });
      }
    },
    [
      activeTab,
      searchText,
      selectedOption,
      selectedDateRanges,
      setCheckedLoader,
      setCheckedHeader,
      setSelectedRows,
    ],
  );

  useEffect(() => {
    if (activeTab) getMoveBack();
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageNo,
    sort,
    paginationFirst,
    activeTab,
  ]);

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    const hasSelection = selectedRows && selectedRows.length > 0;
    onSelectionChange?.(hasSelection);
  }, [selectedRows, onSelectionChange]);

  useEffect(() => {
    if (triggerTableCustomization?.moveback) {
      getMoveBack();
    }
  }, [triggerTableCustomization]);

  useEffect(() => {
    if (!allocateModal && activeTab && prevMoveBackModalRef.current === true)
      getMoveBack();
    prevMoveBackModalRef.current = allocateModal;
  }, [allocateModal]);
  return (
    <>
      <ContentLayout tabList={tabList} />

      <div className="content">
        <ReusableFilters
          showFilter={false}
          setActiveFilters={setActiveFilters}
          setSearchText={setSearchText}
          searchText={searchText}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          setSelectedDateRanges={setSelectedDateRanges}
          // selectedDateRanges={selectedDateRanges}
          FilterItems={activeFilters}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          activeFilters={activeFilters}
          setPageNo={setPageNo}
          tableLoader={tableLoader}
        />

        <ReusableTable
          data={tableData?.pageResponse?.content}
          column={tableData?.metaDataDTO?.filter(
            (item) => item?.active && item?.columnActive,
          )}
          loader={tableLoader}
          setSort={setSort}
          sort={sort}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={tableData?.pageResponse?.totalElements}
          row={row}
          onPageChange={onPageChange}
          isPagination={true}
          isRowSizabel={true}
          count={30}
          handleRowChange={handleRowChange}
          isCheckBox={{ show: true, value: "patientId" }}
          handleRowCheckboxChange={handleRowCheckboxChange}
          selectedRows={selectedRows}
          checkedHeader={
            selectedRows?.length === tableData?.pageResponse?.totalElements
          }
          checkBoxLoader={checkedLoader}
        />
      </div>

      <MoveBackModal
        openModal={allocateModal}
        setMoveBackModal={setAllocateModal}
        activeTab={activeTab}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
}

const connector = connect(
  (state: {
    productivityReducer: productivityReducerType;
    tableView: TableViewType<tinPatientReAllocationTableResposneType>;
  }) => ({
    allAllocationRoleData:
      state?.productivityReducer?.allRolesAllocation?.data?.response,
    allAllocationRoleLoading:
      state?.productivityReducer?.allRolesAllocationLoading,
    tableLoader: state?.tableView?.tableViewLoading,
    tableData: state?.tableView?.tableView?.data?.response,
  }),
  {
    getRolesTab: productivityAction?.getAllRoles,
    getTableView: tableAction?.tabelViewCall,
  },
);

export default connector(MoveBack);
