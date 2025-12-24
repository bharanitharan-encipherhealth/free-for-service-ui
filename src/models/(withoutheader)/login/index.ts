import { mfaValidationType } from "@/state/auth/model";

interface MFAValidationResponse {
  status: string;
}

export interface loginTypes {
  getMFAValidation: (
    params: mfaValidationType
  ) => Promise<MFAValidationResponse>;
  loginResponse: boolean;
}
