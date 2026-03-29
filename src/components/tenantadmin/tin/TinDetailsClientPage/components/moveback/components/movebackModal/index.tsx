import { moveBackModalType } from "@/models/tenantadmin/tin/moveback";
import { Button, Modal, Select, Switch } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { actions as moveBackActions } from "@/state/tenantadmin/tin/tinDetails/moveBack";
import patinetMovebackReducerType from "@/state/tenantadmin/tin/tinDetails/moveBack/model";
import style from "../../style.module.css";

type MoveBackModalReduxProps = ConnectedProps<typeof connector>;
type MoveBackModalPropsType = moveBackModalType & MoveBackModalReduxProps;
function MoveBackModal({
  openModal,
  setMoveBackModal,
  getLevelOptionsAction,
  activeTab,
  levelOptions,
  moveBack,
  selectedRows,
  setSelectedRows,
}: MoveBackModalPropsType) {
  const [selectLevel, setSelectLevel] = useState<string>("");
  const [isRevertChecked, setIsRevertChecked] = useState<boolean>(false);
  const options = levelOptions?.map((org, index) => ({
    value: org?.status,
    label: org?.status?.split("_")?.join(" "),
  }));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getLevelOptions = useCallback(async () => {
    await getLevelOptionsAction({ roleId: activeTab });
  }, [getLevelOptionsAction, activeTab]);

  const handleChangeLevel = useCallback(
    (value: string) => {
      setSelectLevel(value);
    },
    [setSelectLevel, levelOptions]
  );

  const handleCancel = useCallback(() => {
    setMoveBackModal(false);
    setSelectLevel("");
    setIsRevertChecked(false);
  }, [setMoveBackModal, setSelectLevel, setIsRevertChecked]);
  const handleSubmitMoveBack = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await moveBack({
        patientIdList: selectedRows,
        roleDetailsToMoveBack: selectLevel,
        revertSelected: isRevertChecked,
      });
      if (res?.status == "SUCCESS") {
        handleCancel();
        setSelectedRows([]);
      }
    } catch (e) {
      console.error(e, "While Move Back Submit");
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedRows,
    selectLevel,
    isRevertChecked,
    handleCancel,
    setSelectedRows,
    moveBack,
  ]);

  useEffect(() => {
    if (activeTab.length) getLevelOptions();
  }, [openModal, activeTab]);
  return (
    <Modal
      open={openModal}
      onCancel={handleCancel}
      title={"Move Back"}
      footer={
        <div className="text-center pt-4" onClick={handleSubmitMoveBack}>
          <Button
            className="btnColor"
            disabled={selectLevel?.length == 0}
            loading={isLoading}
          >
            Done
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 my-3">
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-xs font-bold px-1" htmlFor="selectLevel">
              Select Level <span className="text-red-500">*</span>
            </label>
          </div>
          <div>
            <Select
              id="selectLevel"
              placeholder="Select Level"
              options={options}
              className="w-50"
              onChange={handleChangeLevel}
              value={selectLevel}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold px-1" htmlFor="revert">
            Revert
          </label>
          <Switch
            id="revert"
            checked={isRevertChecked}
            onChange={() => setIsRevertChecked(!isRevertChecked)}
            className="custom-switch"
          />
          <div className={`${style.enableOptions} text-xs px-1 my-2`}>
            Enabling this option will revert the changes done by previous coders
          </div>
        </div>
      </div>
    </Modal>
  );
}

const connector = connect(
  (state: {
    tinDetailsReducer: { patinetMoveBackReducer: patinetMovebackReducerType };
  }) => ({
    levelOptions:
      state?.tinDetailsReducer?.patinetMoveBackReducer?.getMoveBackLevelOptions
        ?.data?.response,
  }),
  {
    getLevelOptionsAction: moveBackActions?.getMoveBackLevel,
    moveBack: moveBackActions?.postMoveBack,
  }
);

export default connector(MoveBackModal);
