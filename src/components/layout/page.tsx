"use client";

import {  useMemo } from "react";
import { Layout, ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./theme-provider";
import AppHeader from "./appHeader/page";
import AppSideBar from "./appSideBar";

const { Content } = Layout;

interface LayoutPageProps {
  role?: "admin" | "reviewer" | "owner";
  children?: React.ReactNode;
}

const LayoutPage = ({ role = "admin", children }: LayoutPageProps) => {
  const { theme } = useTheme();

  // Memoize theme config to prevent recreation on every render
  const themeConfig = useMemo(
    () => ({
      algorithm:
        theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorBgContainer: theme === "dark" ? "#1f2937" : "#ffffff",
        colorText: theme === "dark" ? "#f3f4f6" : "#111827",
      },
    }),
    [theme]
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className="min-h-screen">
        <AppHeader />

        <Layout>
          <AppSideBar />

          <Content>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutPage;
