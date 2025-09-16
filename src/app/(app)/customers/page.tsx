import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        title="Customers"
        description="View customer data and generate insights."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Check back later for customer insights and reporting.</p>
        </CardContent>
      </Card>
    </>
  );
}
