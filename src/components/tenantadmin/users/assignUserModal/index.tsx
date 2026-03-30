"use client";
import { Button, Checkbox, Empty, Modal, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import { UserAssignModalType, UserListType } from "@/models/tenantadmin/users";
import { actions as usersAction } from "@/state/tenantadmin/users";
import styles from "../style.module.css";
import { getStorage } from "@/util/storage";
import { getResponePopup } from "@/util/reusableFunction";
import UserReducerType from "@/state/tenantadmin/users/model";

function UserAssignModal({
  openSelectUser,
  getAllUser,
  handleCloseMoadl,
  setAssignUserModal,
  getAllRole,
  allRoleData,
  allRoleDataLoading,
  setAssignUserRole,
  getUsersAPi,
  allUserListLoading,
}: UserAssignModalType) {
  const [userList, setUserList] = useState<UserListType[]>([]);
  const [userId, setUserId] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string[]>([]);
  const [userRoleId, setUserRoleId] = useState<string[]>([]);

  const [userAssignRoleModal, setUserAssignRoleModal] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getAlllUser = useCallback(async () => {
    const res = await getAllUser();
    if (res?.status == "SUCCESS") {
      const user = res?.response?.map((item) => {
        return {
          userName: item?.name,
          email: item?.userName,
          id: item?.id,
          role: item?.roleNames,
          firstName: item?.firstName,
          lastName: item?.lastName,
        };
      });
      setUserList(user);
    }
  }, [getAllUser]);

  const getUserRole = useCallback(async () => {
    await getAllRole();
  }, [getAllRole]);

  const handleSelctUser = useCallback(
    ({ user }: { user: UserListType }) => {
      if (userId?.includes(user?.id)) {
        setUserId((prev) => prev?.filter((item) => item != user?.id));
      } else {
        setUserId([...userId, user?.id]);
      }
      if (userEmail?.includes(user?.email)) {
        setUserEmail((prev) => prev?.filter((item) => item != user?.email));
      } else {
        setUserEmail([...userEmail, user?.email]);
      }
    },
    [setUserId, setUserEmail, userEmail, userId]
  );

  const handleSelectAllUser = useCallback(
    ({ checked }: { checked: boolean }) => {
      if (checked) {
        setUserId(
          userList?.map((item) => {
            return item?.id;
          })
        );
        setUserEmail(
          userList?.map((item) => {
            return item?.email;
          })
        );
      } else {
        setUserEmail([]);
        setUserId([]);
      }
    },
    [userList]
  );

  const handleRoleSelect = useCallback(
    ({ id }: { id: string }) => {
      if (userRoleId?.includes(id)) {
        setUserRoleId((prev) => prev?.filter((item) => item != id));
      } else {
        setUserRoleId([...userRoleId, id]);
      }
    },
    [setUserRoleId, userRoleId]
  );

  const handleRoleSelectAll = useCallback(
    ({ checked }: { checked: boolean }) => {
      if (checked) {
        setUserRoleId(
          allRoleData?.map((item) => {
            return item?.roleId;
          })
        );
      } else {
        setUserRoleId([]);
      }
    },
    [setUserRoleId, allRoleData]
  );
  const handleAssignuser = useCallback(async () => {
    setIsLoading(true);
    const clientId = getStorage("client");
    const projectId = getStorage("project");

    const payload = {
      userNames: userEmail,
      authorizedDetails: [
        {
          clientId: clientId || "",
          projects: [
            {
              projectId: projectId || "",
              roles: userRoleId,
            },
          ],
        },
      ],
    };

    const assignUser = await setAssignUserRole({ data: payload });
    if (assignUser?.status === "SUCCESS") {
      setIsLoading(false);
      setUserAssignRoleModal(false);
      getUsersAPi();
      getResponePopup(assignUser);
    } else {
      getResponePopup(assignUser);
      setIsLoading(false);
    }
  }, [setAssignUserRole, userEmail, userRoleId, getUsersAPi]);

  useEffect(() => {
    if (userAssignRoleModal) {
      getUserRole();
    }
  }, [userAssignRoleModal]);

  useEffect(() => {
    if (openSelectUser) getAlllUser();
  }, [openSelectUser]);
  return (
    <>
      <Modal
        title={"Select User"}
        open={openSelectUser}
        onCancel={() => {
          handleCloseMoadl();
          setUserRoleId([]);
          setUserEmail([]);
          setUserId([]);
          setUserList([]);
        }}
        footer={
          <div
            className="text-center pt-4"
            onClick={() => {
              setUserAssignRoleModal(true);
              setAssignUserModal(false);
            }}
          >
            <Button
              className="btnColor"
              disabled={userId?.length < 1 && userEmail?.length < 1}
            >
              Next
            </Button>
          </div>
        }
      >
        <div className="my-2">
          <div className="flex justify-end">
            <Checkbox
              className="custom-checkbox"
              onChange={(e) =>
                handleSelectAllUser({ checked: e?.target?.checked })
              }
              checked={
                userList?.length == userId.length && userList?.length > 0
              }
            >
              Select All
            </Checkbox>
          </div>

          <div>
            {allUserListLoading ? (
              <div className="skeleton-table">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="skeleton-row ">
                    <Skeleton.Input block={true} active />
                  </div>
                ))}
              </div>
            ) : userList.length ? (
              userList?.map((item, index) => (
                <div
                  className={`flex justify-between items-center my-4 ${styles.userList}`}
                  key={index}
                >
                  <div className="flex gap-2 items-center">
                    <div className={`${styles.userIndex}`}>{index + 1}</div>
                    <div>
                      {item?.userName
                        ? item?.userName
                        : item?.firstName + " " + item?.lastName}
                    </div>
                  </div>

                  <div>
                    <Checkbox
                      className="custom-checkbox"
                      onClick={() => handleSelctUser({ user: item })}
                      checked={
                        userId?.includes(item?.id) &&
                        userEmail?.includes(item?.email)
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                <Empty />
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={userAssignRoleModal}
        onCancel={() => {
          handleCloseMoadl();
          setUserAssignRoleModal(false);
          setUserRoleId([]);
          setUserEmail([]);
          setUserId([]);
          setUserList([]);
        }}
        title={"Select Role"}
        footer={
          <div className="flex justify-center gap-2 pt-3">
            <Button
              disabled={userId?.length < 1 && userEmail?.length < 1}
              onClick={() => {
                setUserAssignRoleModal(false);
                setAssignUserModal(true);
              }}
            >
              Back
            </Button>
            <Button
              className="btnColor"
              disabled={userId?.length < 1 && userEmail?.length < 1}
              onClick={handleAssignuser}
              loading={isLoading}
            >
              Assign
            </Button>
          </div>
        }
      >
        <div className="my-3">
          <div className="flex justify-end">
            <Checkbox
              className="custom-checkbox"
              onChange={(e) =>
                handleRoleSelectAll({ checked: e?.target?.checked })
              }
              checked={
                allRoleData?.length == userRoleId?.length &&
                allRoleData?.length > 0
              }
            >
              Select All
            </Checkbox>
          </div>

          <div>
            {allRoleDataLoading ? (
              <div className="skeleton-table">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="skeleton-row">
                    <Skeleton.Input block={true} active />
                  </div>
                ))}
              </div>
            ) : allRoleData?.length ? (
              allRoleData?.map((item, index) => (
                <div
                  className={`flex justify-between items-center my-4 ${styles.userList}`}
                  key={index}
                >
                  <div className="flex gap-2 items-center">
                    <div className={`${styles.userIndex}`}>{index + 1}</div>
                    <div>{item?.aliasName}</div>
                  </div>

                  <div>
                    <Checkbox
                      className="custom-checkbox"
                      onClick={() => handleRoleSelect({ id: item?.roleId })}
                      checked={userRoleId?.includes(item?.roleId)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                <Empty />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

const connector = connect(
  (state: { userReducer: UserReducerType }) => ({
    allRoleData: state?.userReducer?.alluserRoleList?.data?.response?.content,
    allRoleDataLoading: state?.userReducer?.alluserRoleList?.loading,
    allUserListLoading: state?.userReducer?.allUserList?.loading,
  }),
  {
    getAllUser: usersAction?.getUsers,
    getAllRole: usersAction?.getRole,
    setAssignUserRole: usersAction?.usersAssigned,
  }
);

export default connector(UserAssignModal);
