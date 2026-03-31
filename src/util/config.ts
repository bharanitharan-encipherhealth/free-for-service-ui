export const portalUrl = process.env.NEXT_PUBLIC_PORTAL_BASE_URL as string;
export const portalUrl1 = process.env.NEXT_PUBLIC_PORTAL_BASE_URL_1 as string;
export const portalPdfUrl = process.env
  .NEXT_PUBLIC_PDF_PORTAL_BASE_URL as string;
export const webSocketUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL as string;
export const isEncrypted = process.env.NEXT_PUBLIC_IS_ENCRYPT as string;
export const tokenKey = "token" as string;
export const serverControl = process.env.NEXT_PUBLIC_NODE_ENV as string;
export const pdfControl = (process.env.NEXT_PUBLIC_PORTAL_BASE_URL +
  "management/patient/report/getfile/bytes") as string;
export const salt = process.env.NEXT_PUBLIC_SALT as string;
export const companyDeatils = (process.env.NEXT_PUBLIC_COMPANY_LOGO ||
  "abha") as string;
export const isLocalEdit = true as boolean;
export const portalMockoon = process.env
  .NEXT_PUBLIC_PORTAL_BASE_URL_MOCKKON as string;
export const protalClientId = process.env.NEXT_PUBLIC_PORTAL_CLIENTID as string;
export const portalRedirectUrl = process.env
  .NEXT_PUBLIC_PORTAL_REDIRECT_URI as string;
export const analyticsTag = process.env
  .NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG as string;
export const tinNumber = process.env.NEXT_PUBLIC_TIN_NUMBER as string;
