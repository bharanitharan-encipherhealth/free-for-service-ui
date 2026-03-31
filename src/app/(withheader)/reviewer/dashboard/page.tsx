import React from "react";
import dynamic from "next/dynamic";

import DynamicDashboard from "@/components/tenantadmin/dashboard"

export default function Index() {
  return <DynamicDashboard />;
}
