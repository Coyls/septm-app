import { Suspense } from "react";
import { DashboardContent } from "./_components/dashboard-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
