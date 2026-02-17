import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { metaDataType, SortType } from "@/state/table/model";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { ReactNode } from "react";
import { TrackingContentArrayType } from "../tenantadmin/tracking";
import { UserContentType } from "../tenantadmin/users";

type btnType = {
  show: boolean;
  value: string;
  title?: string;
  onClick?: ({ item }: { item: string }) => void;
  id?: string;
};

export interface handleRowCheckboxChangeType<T = Record<string, unknown>> {
  e: React.ChangeEvent<HTMLInputElement> | CheckboxChangeEvent;
  row: T;
  singleCheck: boolean;
  checked?: boolean;
}
export interface AppTableType<T> {
  column: metaDataType[];
  data: T[];
  switchStates?: { [key: string]: boolean };
  onSwitchToggle?: ({
    item,
    checked,
  }: {
    item: string;
    checked: boolean;
  }) => void;
  loader: boolean;
  isPagination: boolean;
  row: number;
  isRowSizabel: boolean;
  setSort?: React.Dispatch<React.SetStateAction<SortType>>;
  sort?: SortType;
  first: number;
  totalRecords: number;
  onPageChange: (e: PaginatorPageChangeEvent) => void;
  handleRowChange?: ({ value }: { value: number }) => void;
  count?: number;
  isBtnShow?: btnType;
  isCheckBox?: btnType;
  isEdit?: btnType;
  isGenerateReport?: btnType;
  isUpload?: btnType;
  isTrigger?: btnType;
  isGenerateReportDownload?: btnType;
  tableId?: string;
  handleAction?: (item: T) => void;
  content?: (item: T) => ReactNode;
  visiblePopoverKey?: boolean | string;
  setVisiblePopoverKey?: React.Dispatch<React.SetStateAction<boolean | string>>;
  setEditingUser?: React.Dispatch<React.SetStateAction<T | null>>;
  selectedRole?: string[] | null;
  onCloseIconClick?: () => void;
  id?: string;
  checkedHeader?: boolean;
  disabled?: boolean;
  handleRowCheckboxChange?: (
    args: handleRowCheckboxChangeType<T>,
  ) => void;
  checkBoxLoader?: boolean;
  selectedRows?: string[];
  onRowClick?: ({ record }: { record: T }) => void;
  checkedLoader?: boolean;
}

export interface tableItemType {
  item: UserContentType & TrackingContentArrayType;
  actualField: keyof (UserContentType & TrackingContentArrayType);
}
