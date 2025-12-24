"use client";

import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../../lib/msalInstance";
import { useEffect } from "react";
import { setStorage } from "./storage";
import { ssoLogout } from "../../lib/authService";
import { usePathname } from "next/navigation";

export default function MsalClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = usePathname();
  useEffect(() => {
    const init = () => {
      const account = msalInstance.getAllAccounts()[0];
      if (!account) return;

      let previousToken: string | null = null;
      const refreshToken = async () => {
        try {
          const tokenResponse = await msalInstance.acquireTokenSilent({
            account,
            scopes: ["User.Read", "offline_access"],
            forceRefresh: true,
          });
          const newToken = tokenResponse.accessToken;
          if (previousToken && previousToken !== newToken) {
            console.log("✅ Access token has been refreshed.");
          }
          setStorage("token", tokenResponse.idToken);
          previousToken = newToken;
        } catch (error) {
          console.error("❌ Silent token refresh failed. Logging out...");
          ssoLogout();
        }
      };

      refreshToken();
      const interval = setInterval(refreshToken, 16 * 30 * 1000);
      return () => clearInterval(interval);
    };
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => init());
      } else {
        setTimeout(() => init(), 2500);
      }
    }
  }, [router]);
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
