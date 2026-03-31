"use client";

import { connect } from "react-redux";

import ContentLayout from "@/components/layout/ContentLayout/page";
import { actions as tableAction } from "@/state/table";
import { actions as usersAction } from "@/state/tenantadmin/users";
import { useCallback, useEffect, useMemo, useState } from "react";
import { assignUserPageId } from "@/util/pageIds";
import {
  UserContentType,
  userPropsType,
  userTabelType,
} from "@/models/tenantadmin/users";
import ReusabelTable from "@/components/ReusabelTable";
import TableViewType, { metaDataType, SortType } from "@/state/table/model";
import {
  CreateIdGens,
  findItemWithTrueKey,
  findMatchesByField,
  getResponePopup,
} from "@/util/reusableFunction";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import UserAssignModal from "@/components/tenantadmin/users/assignUserModal";
import ReusableFilters from "@/components/ReusbaleFilter";

import { getStorage } from "@/util/storage";
import { Button, Select } from "antd";
import UserReducerType from "@/state/tenantadmin/users/model";
import AddUser from "@/components/tenantadmin/users/addUser";
import EditUser from "@/components/tenantadmin/users/editUser";

function Users({
  getTableView,
  getUserEnable,
  tabelData,
  tableLoader,
  tableCustomizationCall,
  allRoles,
  getAllRole,
  setUserEditRoles,
  editUsersLoader,
  createUser,
  addUserLoading,
}: userPropsType) {
  const aliasName = getStorage("aliasName");
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

  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [tableCustomization, setTableCustomization] = useState<boolean>(false);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  const [assignUserModal, setAssignUserModal] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<string>("");

  const [selectedRole, setSelectedRole] = useState<string[] | null>(null);

  const [visiblePopoverKey, setVisiblePopoverKey] = useState<boolean | string>(
    "",
  );

  const [editingUser, setEditingUser] = useState<UserContentType | null>(null);

  const [selectedRoleList, setSelectedRoleList] = useState<string[] | null>(
    null,
  );

  const [addUser, setAddUserModal] = useState<boolean>(false);

  const layoutList = useMemo(
    () => [
      {
        isFilter: true,
        data: tabelData?.metaDataDTO,
        loading: tableLoader,
      },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: () => setTableCustomization(!tableCustomization),
        loading: tableLoader,
      },
      // {
      //   isBtn: true,
      //   btnTitle: "Assign User",
      //   onClick: () => setAssignUserModal(!assignUserModal),
      //   loading: tableLoader,
      // },
      {
        isBtn: true,
        btnTitle: "Add User",
        onClick: () => setAddUserModal(!addUser),
        loading: tableLoader,
      },
    ],
    [
      tabelData?.metaDataDTO,
      tableCustomization,
      setTableCustomization,
      setAssignUserModal,
      assignUserModal,
      tableLoader,
      addUser,
      setAddUserModal,
    ],
  );

  const getUserRole = useCallback(async () => {
    await getAllRole();
  }, [getAllRole]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
      setPageSize(e.rows);
    },
    [setPaginationFirst, setPageNo, setPageSize],
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
      cilentBased: false,
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

  const handleAction = (item: UserContentType) => {
    setSelectedItem(item?.userName);
  };

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
    [tableCustomizationCall, getUsersAPi],
  );

  const handleCloseMoadl = () => {
    setAssignUserModal(false);
  };

  const roles = allRoles?.map((item) => ({
    value: item?.roleId,
    label: item?.roleName?.split("_")?.join(" "),
  }));

  const handleRoleSubmit = async () => {
    const payload = {
      userName: selectedItem,
      roles: selectedRole,
      isEdit: true,
    };
    const response = await setUserEditRoles(payload);
    if (response?.status === "SUCCESS") {
      getUsersAPi();
      setVisiblePopoverKey(false);
      setEditingUser(null);
      getResponePopup(response);
    } else {
      getResponePopup(response);
    }
  };

  const handleEditUserClose = useCallback(() => {
    setEditingUser(null);
    setSelectedRole(selectedRoleList);
    setVisiblePopoverKey(false);
  }, [selectedRoleList]);

  const onCloseIconClick = () => {
    handleEditUserClose();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getUsersAPi();
    }
  }, [selectedOption, selectedDateRanges, searchText, pageSize, pageNo, sort]);

  useEffect(() => {
    const switchStatus = () => {
      const accountStatus: { [key: string]: boolean } = {};
      tabelData?.pageResponse?.content.forEach((user) => {
        accountStatus[user.userName] = user.accountStatus;
      });
      setSwitchStates(accountStatus);
    };
    switchStatus();
  }, [tabelData?.pageResponse?.content]);

  useEffect(() => {
    const callActiveFilter = () => {
      if (
        tabelData?.metaDataDTO ||
        !findMatchesByField(activeFilters, tabelData?.metaDataDTO)
      ) {
        setActiveFilters(
          tabelData?.metaDataDTO.filter(
            (item) => item.active && item?.filter?.style,
          ),
        );
        setSelectedColumns(tabelData?.metaDataDTO);
        // setIsFilter(false);
      }
    };
    callActiveFilter();
  }, [tabelData?.metaDataDTO]);

  const handleCloseUser = useCallback(() => {
    setAddUserModal(false);
  }, [setAddUserModal, addUser]);

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    const setRole = () => {
      if (editingUser && allRoles) {
        const selectedRoleIds = allRoles
          ?.filter((role) => editingUser.roleNames?.includes(role.roleName))
          ?.map((role) => role.roleId) || [];

        setSelectedRole(selectedRoleIds);
        setSelectedRoleList(selectedRoleIds);
      }
    };
    setRole();
  }, [editingUser, allRoles]);

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
        <div className="flex">
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
            //customize table
            tableLoader={tableLoader}
          />
        </div>
        <ReusabelTable
          data={tabelData?.pageResponse?.content}
          column={tabelData?.metaDataDTO?.filter(
            (item) => item?.active && item?.columnActive,
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
          isEdit={{
            show: findItemWithTrueKey(tabelData?.staticDesign, "edit"),
            value: "patientId",
          }}
          handleAction={handleAction}
          visiblePopoverKey={visiblePopoverKey}
          setVisiblePopoverKey={setVisiblePopoverKey}
          setEditingUser={setEditingUser}
          selectedRole={selectedRole}
          onCloseIconClick={onCloseIconClick}
        />
      </div>

      <UserAssignModal
        openSelectUser={assignUserModal}
        handleCloseMoadl={handleCloseMoadl}
        setAssignUserModal={setAssignUserModal}
        getUsersAPi={getUsersAPi}
      />

      <AddUser
        openAddUser={addUser}
        handleCloseModal={handleCloseUser}
        roles={roles}
        createUser={createUser}
        addUserLoading={addUserLoading}
        getUsersAPi={getUsersAPi}
      />

      <EditUser
        editingUser={editingUser}
        handleEditUserClose={handleEditUserClose}
        roles={roles || []}
        aliasName={aliasName || ""}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        handleRoleSubmit={handleRoleSubmit}
        editUsersLoader={editUsersLoader}
      />
    </>
  );
}

const connector = connect(
  (state: {
    tableView: TableViewType<userTabelType>;
    userReducer: UserReducerType;
  }) => ({
    tableLoader: state?.tableView?.tableViewLoading,
    tabelData: state?.tableView?.tableView?.data?.response,
    allRoles: state?.userReducer?.alluserRoleList?.data?.response?.content,
    editUsersLoader: state?.userReducer?.userRoleEditLoading,
    addUserLoading: state?.userReducer?.addUserLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    getUserEnable: usersAction?.usersSoftDelete,
    tableCustomizationCall: tableAction?.tableDynamicColumn,
    getAllRole: usersAction?.getRole,
    setUserEditRoles: usersAction?.userEditRoles,
    createUser: usersAction?.createUser,
  },
);

export default connector(Users);
