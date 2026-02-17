import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as tableAction } from "@/state/table";
import {
  tinPatientsTabType,
  tinPatientTableResposneType,
} from "@/models/tenantadmin/tin/patients";
import TableViewType, { SortType } from "@/state/table/model";
import { patientAllocationPageId } from "@/util/pageIds";
import { getStorage } from "@/util/storage";
import ReusableFilters from "@/components/ReusbaleFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import productivityReducerType from "@/state/tenantadmin/productivity/model";
import ContentLayout from "@/components/layout/ContentLayout/page";
import { generateHeaderTab } from "@/util/reusableFunction";
import { actions as productivityAction } from "@/state/tenantadmin/productivity";
import { handleRowCheckboxChangeType } from "@/models/ReusabelTable";
import { getTable } from "@/state/table/network";
import {
  checkAllPatientIdType,
  tinPatientAllocationTableResposneType,
  tinPatientAllocationTabType,
} from "@/models/tenantadmin/tin/patientAllocation";
import AllocationModal from "./components/allocationModal";

type patientTabReduxType = ConnectedProps<typeof connector>;

type patientTabProps = tinPatientAllocationTabType & patientTabReduxType;
function PatientAllocation({
  activeFilters,
  setActiveFilters,
  getTableView,
  tableData,
  tableLoader,
  triggerTableCustomization,
  allAllocationRoleData,
  allAllocationRoleLoading,
  setTriggerTableCustomization,
  getAllRolesTab,
  onSelectionChange,
  allocateModal,
  setAllocateModal,
}: patientTabProps) {
  const tin = getStorage("tinNumber");
  const [selectedOption, setSelectedOption] = useState<
    Record<string, string | string[]>
  >({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [pageNo, setPageNo] = useState(0);
  const [sort, setSort] = useState<SortType>({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
  });
  const [selectedDates, setSelectedDates] = useState({});
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);
  const [activeTab, setActiveTab] = useState<string>("");
  const [roleAliasName, setRoleAliasName] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [checkedLoader, setCheckedLoader] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<
    checkAllPatientIdType[]
  >([]);
  const prevAllocateModalRef = useRef<boolean | undefined>(undefined);

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
    allAllocationRoleData,
    allAllocationRoleLoading,
    activeTab,
    handleTabChange,
  ]);
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
  const getAllRoles = useCallback(async () => {
    try {
      const res = await getAllRolesTab({ pageId: patientAllocationPageId });
      if (res?.status == "SUCCESS") {
        setActiveTab(res?.response?.allocationRoles?.[0]?.roleId);
      }
    } catch (e) {
      console.error("Error Occur while the role api in patient Allocation");
    }
  }, [getAllRolesTab]);

  const handleRowCheckboxChange = useCallback(
    async ({
      e,
      row,
      singleCheck,
      checked,
    }: handleRowCheckboxChangeType<checkAllPatientIdType>) => {
      if (!singleCheck) {
        if (checked) {
          setCheckedLoader(true);
          setCheckedHeader(true);
          const response = await getTable({
            allPatientIds: checked,
            pageId: patientAllocationPageId,
            pageNo: 0,
            pageSize: 15,
            roleId: activeTab,
            searchText,
            selectedOption,
            selectedDateRanges,
            isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
          });

          if (response?.status === "SUCCESS") {
            const result = response?.response?.patientIds?.map(
              (patient: checkAllPatientIdType) => ({
                patientId: patient.patientId,
                patientName: patient.patientName,
                fileName: patient?.fileName,
              }),
            );
            setSelectedRows(
              result.map((patient: checkAllPatientIdType) => patient.patientId),
            );
            setSelectedPatientDetails(result);
          }
          setCheckedLoader(false);
        } else {
          setSelectedRows([]);
          setSelectedPatientDetails([]);

          setCheckedLoader(false);
          setCheckedHeader(false);
        }
      } else {
        setSelectedRows((prev) => {
          const updatedSelection = e.target.checked
            ? [...prev, row.patientId]
            : prev.filter((id) => id !== row.patientId);
          setSelectedPatientDetails(
            updatedSelection.map((id) => ({
              patientId: id,
              patientName: row.patientName,
              fileName: row?.fileName,
            })),
          );
          return updatedSelection;
        });
      }
    },
    [
      activeTab,
      searchText,
      selectedOption,
      selectedDateRanges,
      roleAliasName,
      setCheckedLoader,
      setCheckedHeader,
      setSelectedRows,
      setSelectedPatientDetails,
    ],
  );

  const getAllPatientsAllocation = useCallback(async () => {
    try {
      await getTableView({
        pageId: patientAllocationPageId,
        pageNo,
        pageSize: 15,
        roleId: activeTab,
        tin,
        selectedOption,
        selectedDateRanges,
        searchText,
        sort,
        isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      });
      setTriggerTableCustomization((prev) => ({
        ...prev,
        patientallocation: false,
      }));
    } catch (e) {
      console.error(e, "Erorr Occur in the table Call View Patient Allocation");
    }
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    getTableView,
    tin,
    setTriggerTableCustomization,
    roleAliasName,
    activeTab,
  ]);
  useEffect(() => {
    getAllPatientsAllocation();
  }, [pageNo, selectedOption, searchText, selectedDateRanges, sort, activeTab]);

  useEffect(() => {
    const getRole = () => {
      getAllRoles();
    };
    getRole();
  }, []);

  useEffect(() => {
    const hasSelection = selectedRows && selectedRows.length > 0;
    onSelectionChange?.(hasSelection);
  }, [selectedRows, onSelectionChange]);

  useEffect(() => {
    if (triggerTableCustomization?.patientallocation) {
      getAllPatientsAllocation();
    }
  }, [triggerTableCustomization]);

  useEffect(() => {
    if (prevAllocateModalRef.current === true && !allocateModal) {
      getAllPatientsAllocation();
    }
    prevAllocateModalRef.current = allocateModal;
  }, [allocateModal, getAllPatientsAllocation]);

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

      <AllocationModal
        openAllocateModal={allocateModal}
        setAllocateModal={setAllocateModal}
        activeTab={activeTab}
        roleAliasName={roleAliasName}
        selectedRows={selectedRows}
        selectedPatientDetails={selectedPatientDetails}
      />
    </>
  );
}

const connector = connect(
  (state: {
    tableView: TableViewType<tinPatientAllocationTableResposneType>;
    productivityReducer: productivityReducerType;
  }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
    allAllocationRoleData:
      state?.productivityReducer?.allRolesAllocation?.data?.response,
    allAllocationRoleLoading:
      state?.productivityReducer?.allRolesAllocationLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    getAllRolesTab: productivityAction?.getAllRoles,
  },
);
export default connector(PatientAllocation);
