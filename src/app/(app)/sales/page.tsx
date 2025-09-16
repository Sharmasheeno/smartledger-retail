import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesPage() {
  return (
    <>
      <PageHeader
        title="Sales"
        description="Log and track your retail sales transactions in real-time."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Check back later for sales tracking features.</p>
        </CardContent>
      </Card>
    </>
  );
}
