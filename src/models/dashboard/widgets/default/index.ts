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

  top10Codes?: any;
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
