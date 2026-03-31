"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Layout, ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./theme-provider";
import AppHeader from "./appHeader/page";
import AppSideBar from "./appSideBar";
import ConnectWebSocket from "../websocket";

const { Content } = Layout;

interface LayoutPageProps {
  role?: "admin" | "reviewer" | "owner";
  children?: ReactNode;
}

const LayoutPage = ({ children }: LayoutPageProps) => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Memoize theme config to prevent recreation on every render
  const themeConfig = useMemo(
    () => ({
      algorithm: antdTheme.defaultAlgorithm,
      token: {
        colorBgContainer: "#ffffff",
        colorText: "#111827",
      },
    }),
    [],
  );

  if (!mounted) return null;

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className="h-screen overflow-hidden">
        <AppHeader />

        <Layout>
          <AppSideBar />
          <Content className="overflow-auto">{children}</Content>
          <ConnectWebSocket />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutPage;
