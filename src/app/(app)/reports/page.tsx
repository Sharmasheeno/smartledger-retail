import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate daily, weekly, and monthly sales reports."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Check back later for detailed reporting features.</p>
        </CardContent>
      </Card>
    </>
  );
}
