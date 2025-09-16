import { PageHeader } from "@/components/page-header";
import { ReportGenerator } from "@/components/report-generator";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate daily, weekly, and monthly sales reports."
      />
      <ReportGenerator />
    </>
  );
}
