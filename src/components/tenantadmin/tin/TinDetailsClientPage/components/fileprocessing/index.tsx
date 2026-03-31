"use client";

import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as fileProcessingActions } from "@/state/tenantadmin/fileProcessing";
import FileProcessingTable from "./FileProcessingTable";
import ContentLayout from "@/components/layout/ContentLayout/page";
import { getStorage } from "@/util/storage";

const mapState = (state: any) => ({
  fileProcessingData: state.tinDetailsReducer.fileProcessingReducer.allProcessing,
  webSocketData: state.webSocketReducer.webSocketDetails?.data,
});

const mapDispatch = {
  getUsers: fileProcessingActions.getUsers,
  getAllProcessingData: fileProcessingActions.getAllFileProcessing,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const FileProcessing: React.FC<PropsFromRedux> = ({
  getUsers,
  getAllProcessingData,
}) => {
  const tinId = getStorage("tinNumber");

  useEffect(() => {
    if (tinId) {
      // Fetching initial patient list for the selected TIN
      getUsers({ pageNo: 0, pageSize: 15, selectOrgList: tinId });
      // Fetching initial processing status map
      getAllProcessingData({ tinId: tinId });
    }
  }, [tinId, getUsers, getAllProcessingData]);

  return (
    // <ContentLayout pageTitle="File Processing">
    <div className="bg-white p-4 rounded-lg">
      <FileProcessingTable />
    </div>
    // </ContentLayout >
  );
};

export default connector(FileProcessing);
