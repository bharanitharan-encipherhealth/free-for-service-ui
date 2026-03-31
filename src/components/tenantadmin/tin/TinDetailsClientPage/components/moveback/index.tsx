import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as productivityAction } from "@/state/tenantadmin/productivity";
import {
  moveBackPageId,
  moveInPatientPageId,
  moveOutPatientId,
} from "@/util/pageIds";
import productivityReducerType from "@/state/tenantadmin/productivity/model";
import { generateHeaderTab, getRoleIdByRole } from "@/util/reusableFunction";
import ContentLayout from "@/components/layout/ContentLayout/page";
import TableViewType, { SortType } from "@/state/table/model";
import { MovebackParamsType } from "@/models/tenantadmin/tin/moveback";
import { actions as tableAction } from "@/state/table";
import { getStorage } from "@/util/storage";
import ReusableFilters from "@/components/ReusbaleFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { handleRowCheckboxChangeType } from "@/models/ReusabelTable";
import { getTable } from "@/state/table/network";
import {
  tinPatientsTabType,
  tinPatientTableResposneType,
} from "@/models/tenantadmin/tin/patients";
import { checkAllPatientIdType } from "@/models/tenantadmin/tin/patientAllocation";
import MoveBackModal from "./components/movebackModal";
import { tinNumber } from "@/util/config";

type patientMoveBackTabReduxType = ConnectedProps<typeof connector>;
type patientMoveBackTabProps = MovebackParamsType &
  patientMoveBackTabReduxType & {
    subActiveTab: string;
    setSubActiveTab: React.Dispatch<React.SetStateAction<string>>;
    activeRole: string;
    setActiveRole: React.Dispatch<React.SetStateAction<string>>;
  };

function MoveBack({
  activeFilters,
  setActiveFilters,
  triggerTableCustomization,
  setTriggerTableCustomization,
  getAllRolesTab,
  onSelectionChange,
  allocateModal,
  setAllocateModal,
  allAllocationRoleData,
  allAllocationRoleLoading,
  getTableView,
  tableData,
  tableLoader,
  subActiveTab,
  setSubActiveTab,
  activeRole,
  setActiveRole,
}: patientMoveBackTabProps) {
  const prevMoveBackModalRef = useRef<boolean | undefined>(undefined);
  const tin = tinNumber;
  const [roleAliasName, setRoleAliasName] = useState("");
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
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectedDates, setSelectedDates] = useState({});
  const [row, setRow] = useState<number>(15);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [checkedLoader, setCheckedLoader] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(false);

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

  const currentPageId = useMemo(() => {
    let id = moveBackPageId;
    if (subActiveTab === "Inpatient") {
      id = moveInPatientPageId;
    } else if (subActiveTab === "Outpatient") {
      id = moveOutPatientId;
    }
    return id;
  }, [subActiveTab]);

  const getAllPatientsMoveBack = useCallback(async () => {
    try {
      await getTableView({
        pageId: currentPageId,
        pageNo,
        pageSize: 15,
        roleId: getRoleIdByRole(activeRole) || "",
        tin,
        selectedOption,
        selectedDateRanges,
        searchText,
        sort,
        isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      });
      setTriggerTableCustomization((prev: Record<string, boolean>) => ({
        ...prev,
        moveback: false,
      }));
    } catch (e) {
      console.error("Error Occur while table call in the move back");
    }
  }, [
    getTableView,
    pageNo,
    activeRole,
    currentPageId,
    selectedOption,
    selectedDateRanges,
    searchText,
    sort,
    setTriggerTableCustomization,
    tin,
    roleAliasName,
  ]);

  useEffect(() => {
    const hasSelection = selectedRows && selectedRows.length > 0;
    onSelectionChange?.(hasSelection);
  }, [selectedRows, onSelectionChange]);

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
            pageId: currentPageId,
            pageNo: 0,
            pageSize: 15,
            roleId: getRoleIdByRole(activeRole) || "",
            searchText,
            selectedOption,
            selectedDateRanges,
            isAdmin: true,
            sort,
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
      activeRole,
      searchText,
      selectedOption,
      selectedDateRanges,
      setCheckedLoader,
      setCheckedHeader,
      setSelectedRows,
      currentPageId,
      sort,
    ],
  );

  useEffect(() => {
    getAllPatientsMoveBack();
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    paginationFirst,
    activeRole,
    subActiveTab,
  ]);

  useEffect(() => {
    if (triggerTableCustomization?.moveback) {
      getAllPatientsMoveBack();
    }
  }, [triggerTableCustomization]);

  useEffect(() => {
    if (prevMoveBackModalRef.current === true && !allocateModal) {
      getAllPatientsMoveBack();
    }
    prevMoveBackModalRef.current = allocateModal;
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

      <MoveBackModal
        openModal={allocateModal}
        setMoveBackModal={setAllocateModal}
        activeTab={activeRole}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
}

const connector = connect(
  (state: {
    tableView: TableViewType<tinPatientTableResposneType>;
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

export default connector(MoveBack);
