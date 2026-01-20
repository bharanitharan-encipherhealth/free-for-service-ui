import TinClientComponent from "@/components/tenantadmin/tin/TinClientComponent";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loafding</div>}>
      <TinClientComponent />
    </Suspense>
  );
}
