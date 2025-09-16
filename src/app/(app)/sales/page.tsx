import { PageHeader } from "@/components/page-header";
import { SalesTracker } from "@/components/sales-tracker";

export default function SalesPage() {
  return (
    <>
      <PageHeader
        title="Sales"
        description="Log and track your retail sales transactions in real-time."
      />
      <SalesTracker />
    </>
  );
}
