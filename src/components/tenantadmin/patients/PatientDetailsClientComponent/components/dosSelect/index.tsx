import {
  dosOptionsType,
  DosSelectType,
} from "@/models/tenantadmin/patients/details";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { getDateFormat, reusableEllipses } from "@/util/reusableFunction";
import { Empty, Select, Table, TableProps } from "antd";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import style from "./style.module.css";

type DosSelectReducType = ConnectedProps<typeof connector>;
type DosSelectPropsType = DosSelectType & DosSelectReducType;
export interface DosTableRow {
  key: string;
  dos: dosOptionsType;
  providerName: string;
  page: string;
}
function DosSelect({
  options,
  onHandleChangeDos,
  selectedDos,
}: DosSelectPropsType) {
  const columns = useMemo(
    () => [
      {
        title: "DOS",
        key: "dos",
        dataIndex: "dos",
        render: (item: dosOptionsType) => (
          <div className="flex gap-1">
            <span>
              {item?.stateIndicators?.includes("CHART") && (
                <span className={`p-1 rounded-1 ant-badge ${style?.chartIcon}`}>
                  C
                </span>
              )}
            </span>
            <span>{getDateFormat(item?.dos?.split("_")?.[0], true)}</span>
          </div>
        ),
      },
      {
        title: "Page",
        key: "page",
        dataIndex: "page",
      },
      {
        title: "Provider Name",
        key: "providerName",
        dataIndex: "providerName",
        render: (text: string) =>
          reusableEllipses({
            str: String(text),
            count: 10,
          }),
      },
    ],
    [options],
  );

  const [dataSoucre, setDataSoucre] = useState<DosTableRow[]>([]);
  const [selectRow, setSelctedRow] = useState<DosTableRow | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const data = options?.map((item, index) => ({
      key: (index + 1).toString(),
      dos: item,
      page: item?.page?.startPageNumber + " - " + item?.page?.endPagNumber,
      providerName: item?.providerName,
    }));
    setDataSoucre(data);
    if (selectedDos && options.length) {
      const matchedItem = options.find((item) => item.dos === selectedDos);

      if (matchedItem) {
        const row = {
          key: "1",
          dos: matchedItem,
          providerName: matchedItem.providerName,
          page:
            matchedItem.page?.startPageNumber +
            " - " +
            matchedItem.page?.endPagNumber,
        };

        setSelctedRow(row);
      }
    } else {
      setSelctedRow(null);
    }
  }, [options, selectedDos]);

  return (
    <Select
      value={selectRow?.dos?.dos}
      open={open}
      onOpenChange={setOpen}
      labelRender={() =>
        selectRow ? (
          <div className="flex gap-2">
            <span className={`flex gap-1 pe-2 ${style.dosBorderValue}`}>
              <span>
                {selectRow?.dos?.stateIndicators?.includes("CHART") && (
                  <span
                    className={`p-1 rounded-1 ant-badge ${style?.chartIcon}`}
                  >
                    C
                  </span>
                )}
              </span>
              Dos: {getDateFormat(selectRow.dos.dos?.split("_")[0], true)}
            </span>
            <span className={`pe-2 ${style.dosBorderValue}`}>
              Pages: {selectRow.page}
            </span>
            <span>
              {reusableEllipses({
                str: String(selectRow.providerName),
                count: 10,
              })}
            </span>
          </div>
        ) : null
      }
      placeholder={"-- Select DOS -- "}
      className="w-100"
      popupRender={() => (
        <div>
          {options?.length === 0 ? (
            <div>
              <Empty />
            </div>
          ) : (
            <Table
              size="small"
              columns={columns}
              dataSource={dataSoucre}
              pagination={false}
              onRow={(record) => ({
                style: { cursor: "pointer" },
                onClick: () => {
                  onHandleChangeDos({ record });
                  setSelctedRow(record);
                  setOpen(false);
                },
              })}
              className="max-h-[200px] overflow-auto"
            />
          )}
        </div>
      )}
    />
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    dosList: state?.patientDetailsReducer?.patientDosDetails?.data?.response,
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
  }),
  {},
);

export default connector(DosSelect);
