"use client";

import { useState } from "react";
import {
  intelligentStockAlerts,
  type IntelligentStockAlertsOutput,
} from "@/ai/flows/intelligent-stock-alerts";
import { stockAlertsData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Bot, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function IntelligentStockAlerts() {
  const [alerts, setAlerts] =
    useState<IntelligentStockAlertsOutput["alerts"]>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAlerts = async () => {
    setLoading(true);
    setAlerts(undefined);
    try {
      const result = await intelligentStockAlerts(stockAlertsData);
      setAlerts(result.alerts);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate stock alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              Intelligent Stock Alerts
            </CardTitle>
            <CardDescription className="mt-2">
              Use AI to predict when you will run low on stock based on
              historical sales and seasonal trends.
            </CardDescription>
          </div>
          <Button onClick={handleGenerateAlerts} disabled={loading}>
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Stock Levels
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">
              AI is analyzing your data...
            </p>
          </div>
        )}
        {alerts && alerts.length > 0 && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.productId}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Low Stock Alert: {alert.productId}</AlertTitle>
                <AlertDescription>{alert.reason}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        {alerts && alerts.length === 0 && (
          <div className="text-center text-muted-foreground p-8">
            <p>No immediate stock issues found. All products seem to be well-stocked.</p>
          </div>
        )}
        {!alerts && !loading && (
            <div className="text-center text-muted-foreground p-8">
                <p>Click "Analyze Stock Levels" to generate predictions.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
