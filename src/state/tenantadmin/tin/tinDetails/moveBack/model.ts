import { levelOptionType } from "@/models/tenantadmin/tin/moveback";
import { userListResponseType } from "@/models/tenantadmin/tin/patientAllocation";

export default class patinetMovebackReducerType {
  getMoveBackLevelOptions: {
    loading: boolean;
    error: string;
    data: levelOptionType;
  };

  constructor(getMoveBackLevelOptions: {
    data: {
      status: "fail";
      message: "fail";
      response: [{ status: "Processed"; revertDescription: "" }];
    };
    loading: false;
    error: "fail";
  }) {
    this.getMoveBackLevelOptions = getMoveBackLevelOptions;
  }
}
