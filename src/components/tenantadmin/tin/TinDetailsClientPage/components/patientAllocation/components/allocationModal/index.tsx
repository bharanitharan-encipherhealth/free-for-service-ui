import {
  tinPatientAllocationModalType,
  userListType,
} from "@/models/tenantadmin/tin/patientAllocation";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Select,
  Skeleton,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

import { actions as tinDetailsAction } from "@/state/tenantadmin/tin/tinDetails/patientAllocation";
import { connect, ConnectedProps } from "react-redux";
import styles from "@/components/tenantadmin/users/style.module.css";
import {
  disablePastDate,
  formatDateForIndex,
  getRoleIdByRole,
  priorityOptions,
} from "@/util/reusableFunction";
import style from "../../style.module.css";
import { getStorage } from "@/util/storage";
import patinetAllocationReducerType from "@/state/tenantadmin/tin/tinDetails/patientAllocation/model";

const Search = Input;

type patientAllocationModalReduxType = ConnectedProps<typeof connector>;

type patientAllocationProps = tinPatientAllocationModalType &
  patientAllocationModalReduxType;
function AllocationModal({
  openAllocateModal,
  setAllocateModal,
  getAllUser,
  activeTab,
  allocateUserList,
  alocateUserListLoading,
  selectedRows,
  selectedPatientDetails,
  getAllocateUsers,
  roleAliasName,
}: patientAllocationProps) {
  const allocatedBy = getStorage("userId");
  const [search, setSearch] = useState<string>("");
  const [userName, setUserName] = useState<string[]>([]);
  const [userId, setUserId] = useState<string[]>([]);
  const [allocateFileModal, setAllocateFileModal] = useState<boolean>(false);
  const [allocateDueDate, setAllocatedDueDate] = useState<string | string[]>(
    "",
  );
  const [allocatePriority, setAllocatePriority] = useState<string>("");
  const [isAllocate, setIsAllocate] = useState<boolean>(false);

  const handleSelectUser = useCallback(
    ({ item }: { item: userListType }) => {
      if (userName?.includes(item?.userName))
        setUserName((prev) =>
          prev?.filter((name: string) => name != item?.userName),
        );
      else setUserName((prev) => [...prev, item?.userName]);

      if (userId?.includes(item?.proxyId))
        setUserId((prev) => prev?.filter((id: string) => id != item?.proxyId));
      else setUserId((prev) => [...prev, item?.proxyId]);
    },
    [setUserName, userName, setUserId, userId],
  );

  const handleChangePriority = (value: string) => {
    setAllocatePriority(value);
  };

  const getAllUserList = useCallback(async () => {
    await getAllUser({
      roleId: getRoleIdByRole(activeTab) || "",
      search: search || "",
      masterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
    });
  }, [getAllUser, activeTab, search, roleAliasName]);

  const handleSelectAll = useCallback(
    ({ checked }: { checked: boolean }) => {
      if (checked) {
        const allIds = allocateUserList.map((user: userListType) => user.proxyId);
        const allUserName = allocateUserList.map((user: userListType) => user?.userName);
        setUserName(allUserName);
        setUserId(allIds);
      } else {
        setUserId([]);
        setUserName([]);
      }
    },
    [allocateUserList],
  );

  const handleCancelModal = useCallback(() => {
    setAllocateModal(false);
    setAllocateFileModal(false);
    setUserName([]);
    setUserId([]);
    setAllocatedDueDate("");
    setAllocatePriority("");
  }, [
    setAllocateModal,
    setAllocateFileModal,
    setUserName,
    setUserId,
    setAllocatedDueDate,
    setAllocatePriority,
  ]);

  const handleAllocateFile = useCallback(async () => {
    try {
      setIsAllocate(true);
      let data;
      const mappedRoleId = getRoleIdByRole(activeTab) || "";
      if (roleAliasName === "MASTER_AUDIT") {
        data = {
          roleId: mappedRoleId,
          usersWithRole: userName,
          dueDate: formatDateForIndex({ date: allocateDueDate, index: 1 }),
          allocatedBy,
          patientIdList: selectedRows,
          priority: allocatePriority,
          masterAudit: true,
        };
      } else {
        data = {
          roleId: mappedRoleId,
          userIdList: userName,
          dueDate: formatDateForIndex({ date: allocateDueDate, index: 1 }),
          allocatedBy,
          patientIdList: selectedRows,
          priority: allocatePriority,
        };
      }

      const response = await getAllocateUsers({ data });
      if (response?.status == "SUCCESS") {
        handleCancelModal();
      }
    } catch (e) {
      console.error(e, "While The Alocation");
    } finally {
      setIsAllocate(false);
    }
  }, [
    activeTab,
    userName,
    allocateDueDate,
    getAllocateUsers,
    handleCancelModal,
    setIsAllocate,
    allocatePriority,
    allocatedBy,
    selectedRows,
    roleAliasName,
  ]);

  useEffect(() => {
    if (activeTab) getAllUserList();
  }, [activeTab, search]);

  return (
    <>
      {
        <Modal
          open={openAllocateModal}
          title={
            openAllocateModal && !allocateFileModal
              ? `Select User`
              : allocateFileModal && `Chart Selected : ${selectedRows?.length}`
          }
          onCancel={handleCancelModal}
          footer={
            <>
              {openAllocateModal && !allocateFileModal && (
                <div
                  className="text-center pt-4"
                  onClick={() => {
                    setAllocateFileModal(true);
                  }}
                >
                  <Button
                    className="btnColor"
                    disabled={userName?.length == 0 && userId?.length == 0}
                  >
                    Next
                  </Button>
                </div>
              )}

              {allocateFileModal && (
                <div className="text-center pt-4" onClick={handleAllocateFile}>
                  <Button
                    className="btnColor"
                    disabled={
                      allocateDueDate?.length == 0 &&
                      allocatePriority?.length == 0
                    }
                    loading={isAllocate}
                  >
                    Allocate
                  </Button>
                </div>
              )}
            </>
          }
        >
          {openAllocateModal && !allocateFileModal && (
            <div>
              <div className="flex gap-2">
                <div className="w-full">
                  <Search
                    placeholder="Search"
                    prefix={<CiSearch className="text-lg" />}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <Select className="w-full" placeholder="Select Role" />
                </div>
              </div>

              <div className="flex justify-end mt-4 pe-2">
                <Checkbox
                  className="custom-checkbox"
                  onChange={(e) =>
                    handleSelectAll({ checked: e?.target?.checked })
                  }
                  checked={
                    allocateUserList?.length === userId?.length &&
                    allocateUserList?.length === userName?.length
                  }
                >
                  Select All
                </Checkbox>
              </div>

              <div className="max-h-[69vh] overflow-scroll pe-3">
                {alocateUserListLoading ? (
                  <div className="skeleton-table my-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="skeleton-row my-1">
                        <Skeleton.Input block={true} active />
                      </div>
                    ))}
                  </div>
                ) : allocateUserList?.length ? (
                  allocateUserList?.map((item: userListType, index: number) => (
                    <div
                      className={`flex justify-between items-center my-4 ${styles.userList}`}
                      key={index}
                    >
                      <div className="flex gap-2 items-center">
                        <div className={`${styles.userIndex}`}>
                          {item?.firstName?.at(0)?.toUpperCase() +
                            "" +
                            item?.lastName?.at(0)?.toUpperCase() || ""}
                        </div>
                        <div>
                          {item?.name
                            ? item?.name
                            : item?.firstName + " " + item?.lastName}
                        </div>
                      </div>

                      <div>
                        <Checkbox
                          className="custom-checkbox"
                          onClick={() => handleSelectUser({ item })}
                          checked={
                            userId?.includes(item?.proxyId) &&
                            userName?.includes(item?.userName)
                          }
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="my-4 text-center">
                    No users available. Please create and assign users.
                  </div>
                )}
              </div>
            </div>
          )}
          {allocateFileModal && (
            <div className="flex gap-5 my-4 content-start">
              <div className="flex flex-col gap-4">
                <div>
                  <div>
                    <label className="text-sm font-bold px-1" htmlFor="dueDate">
                      Due date <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <DatePicker
                      placeholder="Select Due Date"
                      id="dueDate"
                      className="w-50"
                      onChange={(date, dateS) => {
                        setAllocatedDueDate(dateS || "");
                      }}
                      disabledDate={(current) => disablePastDate(current)}
                      format="MM-DD-YYYY"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="text-sm font-bold px-1" htmlFor="dueDate">
                      Set Priority <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <Select
                      options={priorityOptions}
                      className="w-50"
                      onChange={handleChangePriority}
                      placeholder="Select Priority"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Selected Charts</div>
                <div className="flex flex-col gap-2 my-2 overflow-scroll max-h-[100px] pe-2">
                  {selectedPatientDetails?.map((item, index) => (
                    <div
                      key={index}
                      className={`${style.selectedFileShow} text-xs font-medium`}
                    >
                      {item?.fileName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      }
    </>
  );
}

const connector = connect(
  (state: {
    tinDetailsReducer: {
      patientAllocationReducer: patinetAllocationReducerType;
    };
  }) => ({
    allocateUserList:
      state?.tinDetailsReducer?.patientAllocationReducer?.getUserList?.data
        ?.response,
    alocateUserListLoading:
      state?.tinDetailsReducer?.patientAllocationReducer?.getUsersLoading,
  }),
  {
    getAllUser: tinDetailsAction?.getUserList,
    getAllocateUsers: tinDetailsAction?.getAllocateUsers,
  },
);

export default connector(AllocationModal);
