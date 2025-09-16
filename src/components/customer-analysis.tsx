"use client";

import { useState } from "react";
import {
  generateCustomerInsights,
  type CustomerInsightsOutput,
} from "@/ai/flows/customer-insights";
import { mockCustomers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader, User, Zap, TrendingUp, ShoppingBag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CustomerAnalysis() {
  const [insights, setInsights] = useState<CustomerInsightsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const result = await generateCustomerInsights({ customers: mockCustomers });
      setInsights(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate customer insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            A list of all customers in your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription className="mt-2">
                Generate insights on customer behavior and get marketing suggestions.
              </CardDescription>
            </div>
            <Button onClick={handleGenerateInsights} disabled={loading} size="sm">
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {insights ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Spending Customers
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                  {insights.topSpendingCustomers.map((c) => (
                    <li key={c.customerId}>
                      {c.name} - {formatCurrency(c.totalSpent)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  Potential Churn Risk
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                  {insights.potentialChurnCustomers.map((c) => (
                    <li key={c.customerId}>
                      {c.name} (Last purchase: {formatDate(c.lastPurchaseDate)})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Marketing Suggestions
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  {insights.marketingSuggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : !loading && (
            <div className="text-center text-muted-foreground p-8">
              <Zap className="mx-auto h-8 w-8 mb-2" />
              <p>Click "Generate" to get AI insights.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
