import { Suspense } from "react";
import TinDetailsClientPage from "@/components/tenantadmin/tin/TinDetailsClientPage";
export default function TinDetails() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <TinDetailsClientPage />
    </Suspense>
  );
}
