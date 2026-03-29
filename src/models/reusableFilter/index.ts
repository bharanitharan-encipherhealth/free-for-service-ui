import { metaDataType } from "@/state/table/model";
import { Dayjs } from "dayjs";

export type FilterValue =
  | string
  | Dayjs[]
  | { startDate: string; endDate: string }
  | null;

export type DateRange = {
  startDate?: string;
  endDate?: string;
};
export interface filterType {
  FilterItems: metaDataType[];
  setSearchText?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  searchText?: Record<string, string>;
  setPageNo?: React.Dispatch<React.SetStateAction<number>>;
  setSelectedOption?: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >;
  selectedOption?: Record<string, string | string[]>;
  setSelectedDateRanges?: React.Dispatch<
    React.SetStateAction<Record<string, DateRange>>
  >;
  setSelectedDates?: React.Dispatch<
    React.SetStateAction<Record<string, string | Dayjs[] | null>>
  >;
  selectedDates?: Record<string, string | Dayjs[] | null>;
  activeFilters: metaDataType[];
  setActiveFilters: React.Dispatch<React.SetStateAction<metaDataType[]>>;
  setClear?: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  search?: Record<string, string>;
  setSearch?: React.Dispatch<
    React.SetStateAction<Record<string, string | unknown>>
  >;
  columns?: string;
  tableLoader: boolean;
}

export interface inputType {
  setPageNumber?: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
  placeholder: string;
  value: string;
  isSearch: boolean;
  handleInputStr?: (val: string) => void;
  setSearchText?:
    | ((value: string | null) => void)
    | React.Dispatch<
        React.SetStateAction<Record<string, string | null> | string | unknown>
      >;
  props?: string[];
  testId?: string;
  id?: string;
  isMrnNumber?: boolean;
  isIntAllow?: boolean;
  autoComplete?: string;
}
