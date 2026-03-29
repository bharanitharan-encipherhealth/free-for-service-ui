import ReviewerPatientClient from "@/components/reviewer/patients/reviewerPatientClient";
import { workQueuePageId } from "@/util/pageIds";
import { Suspense } from "react";

export default function ReviewerPatients() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <ReviewerPatientClient
        pageId={workQueuePageId}
        isReAssigned={false}
        isQueried={false}
        routeTo="/reviewer/patients/details"
        routeBack="/reviewer/patients"
      />
    </Suspense>
  );
}
