import { IntelligentStockAlerts } from "@/components/intelligent-stock-alerts";
import { PageHeader } from "@/components/page-header";

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        description="Monitor and manage your inventory levels with AI-powered alerts for low stock."
      />
      <IntelligentStockAlerts />
    </>
  );
}
