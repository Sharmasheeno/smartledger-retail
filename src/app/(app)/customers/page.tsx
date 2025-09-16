import { CustomerAnalysis } from "@/components/customer-analysis";
import { PageHeader } from "@/components/page-header";

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        title="Customers"
        description="View customer data and generate AI-powered insights."
      />
      <CustomerAnalysis />
    </>
  );
}
