"use client";

import { connect } from "react-redux";

import ContentLayout from "@/components/layout/ContentLayout/page";
import { actions as tableAction } from "@/state/table";
import { actions as usersAction } from "@/state/tenantadmin/users";
import { useCallback, useEffect, useMemo, useState } from "react";
import { assignUserPageId } from "@/util/pageIds";
import tableViewType from "@/state/tenantadmin/users/model";
import { userPropsType } from "@/models/tenantadmin/users";
import ReusabelTable from "@/components/ReusabelTable";
import { metaDataType, SortType } from "@/state/table/model";
import { findMatchesByField } from "@/util/reusableFunction";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import UserAssignModal from "@/components/users/assignUserModal";

function Users({
  getTableView,
  getUserEnable,
  tabelData,
  tableLoader,
  tableCustomizationCall,
}: userPropsType) {
  const [sort, setSort] = useState<SortType>({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
  });
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [tableCustomization, setTableCustomization] = useState<boolean>(false);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  const [assignUserModal, setAssignUserModal] = useState<boolean>(false);
  const layoutList = useMemo(
    () => [
      {
        isFilter: true,
        data: tabelData?.metaDataDTO,
      },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: () => setTableCustomization(!tableCustomization),
      },
      {
        isBtn: true,
        btnTitle: "Assign User",
        onClick: () => setAssignUserModal(!assignUserModal),
      },
    ],
    [
      tabelData?.metaDataDTO,
      tableCustomization,
      setTableCustomization,
      setAssignUserModal,
      assignUserModal,
    ]
  );

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
      setPageSize(e.rows);
    },
    [setPaginationFirst, setPageNo, setPageSize]
  );

  const onSwitchToggle = async ({
    item,
    checked,
  }: {
    item: string;
    checked: boolean;
  }) => {
    setSwitchStates((prev) => ({ ...prev, [item]: checked }));
    const data = {
      userName: item,
      isActive: checked ? true : false,
      isClientBased: true,
    };
    try {
      const res = await getUserEnable({ data });
      if (res?.status == "SUCCESS") {
        await getUsersAPi();
      }
    } catch (e) {
      console.error("Error while calling onSwitchToggle api", e);
    }
  };

  const getUsersAPi = useCallback(async () => {
    const res = await getTableView({
      pageNo,
      pageSize: pageSize || 15,
      selectedOption,
      sort: sort,
      selectedDateRanges,
      searchText: searchText,
      pageId: assignUserPageId,
      cilentBased: true,
      qaLead: true,
      projectLead: true,
    });
  }, [
    pageNo,
    pageSize,
    selectedOption,
    sort,
    selectedDateRanges,
    searchText,
    getTableView,
  ]);

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      const payload = {
        pageId: assignUserPageId,
        headerNames: data,
      };

      const res = await tableCustomizationCall({ payload });
      if (res?.status == "SUCCESS") {
        await getUsersAPi();
      }
    },
    [tableCustomizationCall, getUsersAPi]
  );

  const handleCloseMoadl = () => {
    setAssignUserModal(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getUsersAPi();
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageSize,
    pageNo,
    sort,
    getUsersAPi,
  ]);

  useEffect(() => {
    const accountStatus: { [key: string]: boolean } = {};
    tabelData?.pageResponse?.content.forEach((user) => {
      accountStatus[user.userName] = user.accountStatus;
    });
    setSwitchStates(accountStatus);
  }, [tabelData?.pageResponse?.content]);

  useEffect(() => {
    if (
      tabelData?.metaDataDTO ||
      !findMatchesByField(activeFilters, tabelData?.metaDataDTO)
    ) {
      setActiveFilters(
        tabelData?.metaDataDTO.filter(
          (item) => item.active && item?.filter?.style
        )
      );
      setSelectedColumns(tabelData?.metaDataDTO);
      // setIsFilter(false);
    }
  }, [tabelData?.metaDataDTO]);

  return (
    <>
      <ContentLayout
        pageTitle={"Users"}
        layoutList={layoutList}
        setActiveFilters={setActiveFilters}
        activeFilters={activeFilters}
        tableCustomization={tableCustomization}
        tableCustomizationData={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        handleInsert={handleInsert}
        setTableCustomization={setTableCustomization}
      />
      <div className="content">
        <ReusabelTable
          data={tabelData?.pageResponse?.content}
          column={tabelData?.metaDataDTO?.filter(
            (item) => item?.active && item?.columnActive
          )}
          switchStates={switchStates}
          onSwitchToggle={onSwitchToggle}
          loader={tableLoader}
          setSort={setSort}
          sort={sort}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={tabelData?.pageResponse?.totalElements}
          row={15}
          onPageChange={onPageChange}
          isPagination={true}
          isRowSizabel={false}
          count={30}
        />
      </div>

      <UserAssignModal
        openSelectUser={assignUserModal}
        handleCloseMoadl={handleCloseMoadl}
        setAssignUserModal={setAssignUserModal}
        getUsersAPi={getUsersAPi}
      />
    </>
  );
}

const connector = connect(
  (state: { tableView: tableViewType }) => ({
    tableLoader: state?.tableView?.tableViewLoading,
    tabelData: state?.tableView?.tableView?.data?.response,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    getUserEnable: usersAction?.usersSoftDelete,
    tableCustomizationCall: tableAction?.tableDynamicColumn,
  }
);

export default connector(Users);
