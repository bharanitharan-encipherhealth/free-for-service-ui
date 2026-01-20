import { getReportTabReduxType } from "@/models/tenantadmin/report";

export default class reportReducerType {
  reportTabsList: getReportTabReduxType;
  reportTabListLoading: boolean;

  constructor(
    reportTabsList: {
      data: {
        message: "fails";
        status: "fail";
        response: {
          title: null;
          tabMenuList: [""];
          tabMenuList2: [""];
          active: false;
        };
      };
      loading: false;
      error: "fail";
    },
    reportTabListLoading: false
  ) {
    this.reportTabsList = reportTabsList;
    this.reportTabListLoading = reportTabListLoading;
  }
}
