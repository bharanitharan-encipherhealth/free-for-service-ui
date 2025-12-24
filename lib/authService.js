import { msalInstance } from "./msalInstance";
import { removeStorage } from "@/util/storage";

export const ssoLogout = () => {
  removeStorage();
  msalInstance.logoutRedirect({
    postLogoutRedirectUri: "/",
  });
};

export const acquireTokenSilent = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    console.log("No account found.");
    ssoLogout();
    return null;
  }

  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: accounts[0],
      scopes: ["User.Read", "offline_access"],
    });

    return tokenResponse.idToken;
  } catch (error) {
    console.error("Silent token acquisition failed:", error);

    const criticalErrors = [
      "invalid_grant",
      "AADSTS50173",
      "AADSTS70008",
      "AADSTS90072",
      "AADSTS54005",
    ];

    if (criticalErrors.some((e) => error.message?.includes(e))) {
      console.log("Token invalid or expired — logging out.");
      ssoLogout();
    }

    return null;
  }
};
