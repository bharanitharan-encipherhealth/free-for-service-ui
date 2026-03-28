import ReusabelTable from "@/components/ReusabelTable";
import React from "react";

export default function Dashboard() {
  const columns = [
    {
      headerName: "Batch Name",
      columnActive: true,
      actualField: "name",
      active: true,
      design: [""],
    },
    {
      headerName: "Count",
      columnActive: true,
      actualField: "totalFileCount",
      active: true,
      design: ["fileCount"],
    },
    {
      headerName: "Initiated Date & Time",
      columnActive: true,
      actualField: "createdDate",
      design: ["DATE_TIME"],
      active: true,
    },
    {
      headerName: "Processed Date & Time",
      columnActive: true,
      actualField: "endTime",
      active: true,
      design: ["DATE_TIME"],
    },
    {
      headerName: "Status",
      columnActive: true,
      actualField: "batchUploadStatus",
      design: ["COMPUTATION_STATUS"],
      active: true,
    },
  ];

  const tableData = [
    {
      name: "Batch_001",
      totalFileCount: 52,
      createdDate: "2025-01-10T09:30:25Z",
      endTime: "2025-01-10T10:15:43Z",
      batchUploadStatus: "COMPLETED",
    },
    {
      name: "Batch_002",
      totalFileCount: 17,
      createdDate: "2025-01-12T14:05:11Z",
      endTime: "2025-01-12T14:40:56Z",
      batchUploadStatus: "FAILED",
    },
    {
      name: "Batch_003",
      totalFileCount: 88,
      createdDate: "2025-01-18T08:22:01Z",
      endTime: null,
      batchUploadStatus: "PROCESSING",
    },
    {
      name: "Batch_004",
      totalFileCount: 34,
      createdDate: "2025-01-19T12:45:21Z",
      endTime: "2025-01-19T13:10:10Z",
      batchUploadStatus: "COMPLETED",
    },
    {
      name: "Batch_005",
      totalFileCount: 5,
      createdDate: "2025-01-20T16:02:48Z",
      endTime: "2025-01-20T16:20:15Z",
      batchUploadStatus: "PARTIAL",
    },
  ];

  return <div>Dashboard</div>;
}
