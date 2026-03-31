import { userListType } from "@/models/tenantadmin/tin/patientAllocation";
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

import { actions as tinDetailsAction } from "@/state/tenantadmin/tin/tinDetails/patientReAllocation";
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
import { tinPatientReAllocationModalType } from "@/models/tenantadmin/tin/patientReAllocation";
import patinetReAllocationReducerType from "@/state/tenantadmin/tin/tinDetails/patientReAllocation/model";

const Search = Input;

type patientAllocationModalReduxType = ConnectedProps<typeof connector>;

type patientAllocationProps = tinPatientReAllocationModalType &
  patientAllocationModalReduxType;
function ReAllocationModal({
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
  const [isChangedNeed, SetIsChangeNeed] = useState<boolean>(false);

  const handleSelectUser = useCallback(
    ({ item }: { item: userListType }) => {
      if (userName?.includes(item?.userName))
        setUserName((prev) =>
          prev?.filter((name: string) => name != item?.userName),
        );
      else setUserName((prev) => [...prev, item?.userName]);

      if (userId?.includes(item?.roleId))
        setUserId((prev) => prev?.filter((id: string) => id != item?.roleId));
      else setUserId((prev) => [...prev, item?.roleId]);
    },
    [setUserName, userName, setUserId, userId],
  );

  const handleChangePriority = (value: string) => {
    setAllocatePriority(value);
  };

  console.log(selectedPatientDetails,"selectedPatientDetails");

  const getAllUserList = useCallback(async () => {
    const data = {
      roleId: getRoleIdByRole(activeTab) || "",
      searchString: search || "",
      masterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      userRoleDTOList: selectedPatientDetails.map(({ username, roleId }) => ({
        username,
        roleId,
      })),
    };
    await getAllUser({ data });
  }, [getAllUser, activeTab, search, selectedPatientDetails, roleAliasName]);

  const handleSelectAll = useCallback(
    ({ checked }: { checked: boolean }) => {
      if (checked) {
        const allIds = allocateUserList.map((user) => user.proxyId);
        const allUserName = allocateUserList.map((user) => user?.userName);
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
      const mappedRoleId = Number(getRoleIdByRole(activeTab) || 0);
      if (roleAliasName === "MASTER_AUDIT") {
        data = {
          roleId: mappedRoleId,
          reallocateUserName: userName.toString(),
          dueDate: formatDateForIndex({ date: allocateDueDate, index: 1 }),
          patientId: selectedRows,
          priority: allocatePriority,
          masterAudit: true,
          changesNeeded: isChangedNeed,
        };
      } else {
        data = {
          roleId: mappedRoleId,
          reallocateUserName: userName.toString(),
          dueDate: formatDateForIndex({ date: allocateDueDate, index: 1 }),
          patientId: selectedRows,
          priority: allocatePriority,
          changesNeeded: isChangedNeed,
        };
      }

      const response = await getAllocateUsers({ data });
      if (response?.status == "SUCCESS") {
        handleCancelModal();
      }
    } catch (e) {
      console.error(e, "while Reallocate");
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
    selectedRows,
    roleAliasName,
    isChangedNeed,
  ]);

  const handleChangeNeed = useCallback(() => {
    SetIsChangeNeed(!isChangedNeed);
  }, [isChangedNeed, SetIsChangeNeed]);

  useEffect(() => {
    if (activeTab && openAllocateModal) getAllUserList();
  }, [activeTab, search, openAllocateModal]);

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
                <div
                  className="text-center pt-4"
                  onClick={() => handleAllocateFile()}
                >
                  <Button
                    className="btnColor"
                    disabled={
                      allocateDueDate?.length == 0 &&
                      allocatePriority?.length == 0
                    }
                    loading={isAllocate}
                  >
                    Re Allocate
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

              <div className="max-h-[70vh] overflow-scroll pe-3">
                {alocateUserListLoading ? (
                  <div className="skeleton-table my-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="skeleton-row my-1">
                        <Skeleton.Input block={true} active />
                      </div>
                    ))}
                  </div>
                ) : allocateUserList?.length ? (
                  allocateUserList?.map((item, index) => (
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
                            userId?.includes(item?.roleId) &&
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
            <>
              <div className="flex gap-5 my-4 content-start">
                <div className="flex flex-col gap-4">
                  <div>
                    <div>
                      <label
                        className="text-sm font-bold px-1"
                        htmlFor="dueDate"
                      >
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
                      <label
                        className="text-sm font-bold px-1"
                        htmlFor="dueDate"
                      >
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
              <div className="my-4">
                <span className="fontWeight2">Note:</span> If you choose
                &apos;Delete Codes and Reallocate&apos;, the codes will be
                permanently deleted. Otherwise, the codes will be retained and
                reallocated.
                <div className="mt-1">
                  <Checkbox
                    className="ant-badge"
                    checked={isChangedNeed}
                    onChange={handleChangeNeed}
                  >
                    Delete Codes and Reallocate
                  </Checkbox>
                </div>
              </div>
            </>
          )}
        </Modal>
      }
    </>
  );
}

const connector = connect(
  (state: {
    tinDetailsReducer: {
      patinetReAllocationReducer: patinetReAllocationReducerType;
    };
  }) => ({
    allocateUserList:
      state?.tinDetailsReducer?.patinetReAllocationReducer?.getUserList?.data
        ?.response,
    alocateUserListLoading:
      state?.tinDetailsReducer?.patinetReAllocationReducer?.getUsersLoading,
  }),
  {
    getAllUser: tinDetailsAction?.getReAllocateUserList,
    getAllocateUsers: tinDetailsAction?.getAllocateUsers,
  },
);

export default connector(ReAllocationModal);
