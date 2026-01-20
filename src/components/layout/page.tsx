"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Layout, ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./theme-provider";
import AppHeader from "./appHeader/page";
import AppSideBar from "./appSideBar";

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
      algorithm:
        theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorBgContainer: theme === "dark" ? "#1f2937" : "#ffffff",
        colorText: theme === "dark" ? "#f3f4f6" : "#111827",
      },
    }),
    [theme]
  );

  if (!mounted) return null;

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className="h-screen overflow-hidden">
        <AppHeader />

        <Layout>
          <AppSideBar />
          <Content className="overflow-auto">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutPage;
