import {
  FilterKey,
  FilterPropstype,
} from "@/models/tenantadmin/patients/DiagnosisDetails";
import { Drawer, Modal, Tooltip } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import {
  PiChatCircleText,
  PiClockCounterClockwiseLight,
  PiTreeStructureLight,
} from "react-icons/pi";
import MyWorkQueue from "../myWorkQueue";
import Timeline from "../timeline";
import Comments from "../comments";
import Notes from "../notes";
import VersionHistory from "../versionHistory";

const Filter = React.memo(() => {
  const [openFilters, setOpenFilters] = useState<{
    open: boolean;
    title: string;
  }>({ open: false, title: "" });
  const filterList = useMemo<{ name: string; icon: React.ReactNode }[]>(
    () => [
      {
        name: "My Work Queue",
        icon: <CiFilter />,
      },
      {
        name: "Timeline",
        icon: <PiTreeStructureLight />,
      },
      {
        name: "Comments",
        icon: <PiChatCircleText />,
      },
      {
        name: "Notes",
        icon: <IoDocumentTextOutline />,
      },
      {
        name: "Version History",
        icon: <PiClockCounterClockwiseLight />,
      },
    ],
    [],
  );

  const handleCloseModal = useCallback(() => {
    setOpenFilters({ open: false, title: "" });
  }, [openFilters]);
  return (
    <div className="h-full border-l border-gray-400 p-2 flex flex-col gap-6 bg-white py-5">
      {filterList?.map((item, index) => {
        return (
          <Tooltip
            key={index}
            className="text-2xl text-[#4F5762] font-bold cursor-pointer"
            title={item?.name}
            placement="left"
          >
            <div
              onClick={() => setOpenFilters({ open: true, title: item?.name })}
            >
              {item?.icon}
            </div>
          </Tooltip>
        );
      })}

      <Drawer
        open={openFilters?.open}
        onClose={handleCloseModal}
        title={openFilters?.title}
        placement="right"
        closable={{ placement: "end" }}
      >
        {openFilters?.title?.split(" ")?.join("")?.toLowerCase() ==
          "myworkqueue" && <MyWorkQueue handleCloseModal={handleCloseModal} />}
        {openFilters?.title?.split(" ")?.join("")?.toLowerCase() ===
          "timeline" && <Timeline />}
        {openFilters?.title?.split(" ")?.join("")?.toLowerCase() ===
          "comments" && <Comments />}
        {openFilters?.title?.split(" ")?.join("")?.toLowerCase() ===
          "notes" && <Notes />}
        {openFilters?.title?.split(" ")?.join("")?.toLowerCase() ===
          "versionhistory" && <VersionHistory />}
      </Drawer>
    </div>
  );
});

Filter.displayName = "Filter";
export default Filter;
