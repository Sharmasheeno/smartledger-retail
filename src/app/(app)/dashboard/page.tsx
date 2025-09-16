import { DashboardClient } from "@/components/dashboard-client";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Get a complete overview of your retail business at a glance."
      />
      <DashboardClient />
    </>
  );
}
