export type ChartType =
  | "bar"
  | "line"
  | "area"
  | "donut"
  | "card"
  | "stepline";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardWidget {
  widgetId: string;
  widgetName: string;
  title?: string;
  size: string;
  orderValue: number;
  active: boolean;
  selectedChart: ChartType;
}

export interface GetChartsParams {
  type: string;
  chartType: ChartType;
  pagesLoader: boolean;

  top10Codes?: DefaultTop10CodesResponse;
  top10CodesLoading?: boolean;

  top10OIG?: any;
  top10OIGLoading?: boolean;

  tinTableData?: any;
  tinTableDataLoading?: boolean;

  fileDosCount?: any;
  fileDosCountLoading?: boolean;

  rafTotal?: any;
  rafTotalLoading?: boolean;

  rafHcc?: any;
  rafHccLoading?: boolean;

  rafCareGap?: any;
  rafCareGapLoading?: boolean;

  rafPotential?: any;
  rafPotentialLoading?: boolean;

  filesCountData?: any;
  filesCountDataLoading?: boolean;

  allocatedStatusCountData?: any;
  allocatedStatusCountDataLoading?: boolean;

  dates: string[];
  selectedValue?: string;
  customDate?: string[];
}

export interface DefaultProps {
  dispatch: any;

  getSelectedWidgets: DashboardWidget[];
  getSelectedWidgetsLoader: boolean;

  dateRange: {
    startDate: string;
    endDate: string;
  };

//   top10Codes?: any;
//   top10CodesLoading?: boolean;

//   top10OIG?: any;
//   top10OIGLoading?: boolean;

//   tinTableData?: any;
//   tinTableDataLoading?: boolean;

//   fileDosCount?: any;
//   fileDosCountLoading?: boolean;

//   rafTotal?: any;
//   rafTotalLoading?: boolean;

//   rafHcc?: any;
//   rafHccLoading?: boolean;

//   rafCareGap?: any;
//   rafCareGapLoading?: boolean;

//   rafPotential?: any;
//   rafPotentialLoading?: boolean;

//   filesCountData?: any;
//   filesCountDataLoading?: boolean;

//   allocatedStatusCountData?: any;
//   allocatedStatusCountDataLoading?: boolean;

//   selectedValue?: string;
//   customDate?: string[];
}

export interface DefaultTop10CodesResponse {
  topDiseaseDTOList:any[];
  totalCount:number;
  topDiseaseTotalCount:number;
}

export interface DefaultTop10Codes {
  message: string;
  status: string;
  response: DefaultTop10CodesResponse;
}

export interface defaultFileDosCountResponse {
  codesAndRafSummaryDTOList: any[] | null; // replace `any` with actual DTO type if known
  dosCount: number;
  fileCount: number;
  overallCodesCount: number;
  overallPremium: number;
  overallRaf: number;
  pageCount: number;
  tinCount: number;
  tinStatisticsResponseDtoList: any[] | null; // replace `any` with actual DTO type if known
}

export interface defaultFileDosCount{
  message: string;
  status: string;
  response: defaultFileDosCountResponse;
}

export interface defaultRafTotalResponse {
  codesAndRafSummaryDTOList: any[];
  dosCount: number;
  fileCount: number;
  overallCodesCount: number;
  overallPremium: number;
  overallRaf: number;
  pageCount: number;
  tinCount: number;
  tinStatisticsResponseDtoList: any[] | null;
}

export interface defaultRafTotal{
  message: string;
  status: string;
  response: defaultRafTotalResponse;
}

// Individual item in codesAndRafSummaryDTOList
export interface CodesAndRafSummaryDTO {
  date: string;
  totalCount: number | null;
  hccCount: number | null;
  suggestedCount: number | null;
  potentialCount: number | null;
  totalRaf: number | null;
  hccRafScore: number | null;
  suggestedRafScore: number | null;
  potentialRafScore: number | null;
  totalPremium: number | null;
  hccPremium: number | null;
  suggestedPremium: number | null;
  potentialPremium: number | null;
}

export interface TinStatisticsResponseDTO {
  [key: string]: any;
}

export interface DefaultRafCarGapResponse {
  fileCount: number;
  dosCount: number;
  pageCount: number;
  codesAndRafSummaryDTOList: CodesAndRafSummaryDTO[];
  overallCodesCount: number;
  overallRaf: number;
  overallPremium: number;
  tinStatisticsResponseDtoList: TinStatisticsResponseDTO[] | null;
  tinCount: number;
}

// Full API response
export interface DefaultRafCarGapCount {
  message: string;
  status: string;
  response: DefaultRafCarGapResponse;
}
