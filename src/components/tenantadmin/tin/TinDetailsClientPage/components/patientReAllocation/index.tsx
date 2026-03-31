import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as tableAction } from "@/state/table";
import TableViewType, { SortType } from "@/state/table/model";
import {
  patienReAllocationInPatientPageId,
  patienReAllocationOutPatientPageId,
  reAllocationPageId,
} from "@/util/pageIds";
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
import ReAllocationModal from "./components/reAllocationModal";
import {
  tinPatientReAllocationTableResposneType,
  tinPatientReAllocationTabType,
  checkAllPatientIdType,
  patientReAllocationContentArrayType,
} from "@/models/tenantadmin/tin/patientReAllocation";

type patientReAllocationTabReduxType = ConnectedProps<typeof connector>;

type patientReAllocationTabProps = tinPatientReAllocationTabType &
  patientReAllocationTabReduxType & {
    subActiveTab: string;
    setSubActiveTab: React.Dispatch<React.SetStateAction<string>>;
    activeRole: string;
    setActiveRole: React.Dispatch<React.SetStateAction<string>>;
  };
function PatientReAllocation({
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
  subActiveTab,
  setSubActiveTab,
  activeRole,
  setActiveRole,
}: patientReAllocationTabProps) {
  const prevReAllocateModalRef = useRef<boolean | undefined>(undefined);
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
  const [roleAliasName, setRoleAliasName] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [checkedLoader, setCheckedLoader] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<
    checkAllPatientIdType[]
  >([]);

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

  const handleRowCheckboxChange = useCallback(
    async ({
      e,
      row,
      singleCheck,
      checked,
    }: handleRowCheckboxChangeType<patientReAllocationContentArrayType>) => {
      if (!singleCheck) {
        if (checked) {
          setCheckedLoader(true);
          setCheckedHeader(true);
          const response = await getTable({
            allPatientIds: checked,
            pageId: reAllocationPageId,
            pageNo: 0,
            pageSize: 15,
            roleId: activeRole,
            searchText,
            selectedOption,
            selectedDateRanges,
            isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
          });

          if (response?.status === "SUCCESS") {
            const result = response?.response?.patientIds?.map(
              (patient: checkAllPatientIdType) => ({
                patientId: patient?.patientId,
                username: patient?.username,
                roleId: patient?.roleId,
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
          const current = row as patientReAllocationContentArrayType & {
            currentStatus?: { allocatedTo?: string; roleId?: string };
            fileName?: string;
          };
          setSelectedPatientDetails(
            updatedSelection.map(
              (id) =>
                ({
                  patientId: id,
                  username: current.currentStatus?.allocatedTo ?? "",
                  roleId: current.currentStatus?.roleId ?? "",
                  fileName: current.fileName,
                }) as checkAllPatientIdType,
            ),
          );
          return updatedSelection;
        });
      }
    },
    [
      activeRole,
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

  const getAllPatientsReAllocation = useCallback(async () => {
    let currentPageId = reAllocationPageId;
    if (subActiveTab === "Inpatient") {
      currentPageId = patienReAllocationInPatientPageId;
    } else if (subActiveTab === "Outpatient") {
      currentPageId = patienReAllocationOutPatientPageId;
    }
    try {
      await getTableView({
        pageId: activeRole || currentPageId,
        pageNo,
        pageSize: 15,
        roleId: activeRole,
        tin,
        selectedOption,
        selectedDateRanges,
        searchText,
        sort,
        isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      });
      setTriggerTableCustomization((prev) => ({
        ...prev,
        patientreallocation: false,
      }));
    } catch (e) {
      console.error("Error Occur While table call in the Re Allocation page");
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
    activeRole,
    subActiveTab,
  ]);
  useEffect(() => {
    getAllPatientsReAllocation();
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    activeRole,
    subActiveTab,
  ]);

  useEffect(() => {
    if (triggerTableCustomization?.patientreallocation) {
      getAllPatientsReAllocation();
    }
  }, [triggerTableCustomization]);

  useEffect(() => {
    if (prevReAllocateModalRef.current === true && !allocateModal) {
      getAllPatientsReAllocation();
    }
    prevReAllocateModalRef.current = allocateModal;
  }, [allocateModal]);

  return (
    <>
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

      <ReAllocationModal
        openAllocateModal={allocateModal}
        setAllocateModal={setAllocateModal}
        activeTab={activeRole}
        roleAliasName={roleAliasName}
        selectedRows={selectedRows}
        selectedPatientDetails={selectedPatientDetails}
      />
    </>
  );
}

const connector = connect(
  (state: {
    tableView: TableViewType<tinPatientReAllocationTableResposneType>;
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
export default connector(PatientReAllocation);
