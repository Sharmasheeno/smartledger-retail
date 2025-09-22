
"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, FileText } from "lucide-react";
import Link from "next/link";
import { getSales } from "@/lib/firestore-service";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Sale } from "@/lib/types";

type ReportData = {
  totalSales: number;
  numberOfSales: number;
  sales: Sale[];
  startDate: Date;
  endDate: Date;
};

export function ReportGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [report, setReport] = useState<ReportData | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchSales();
    }
  }, [user]);

  const fetchSales = async () => {
    if (!user) return;
    try {
      const userSales = await getSales(user.uid);
      setAllSales(userSales);
    } catch (error) {
      console.error("Error fetching sales for report:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sales data for reports.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleGenerateReport = () => {
    if (!date || !date.from || !date.to) {
      return;
    }

    const filteredSales = allSales.filter(sale => {
      const saleDate = new Date(sale.date);
      // Adjust timezone differences by comparing dates only
      const fromDate = new Date(date.from!);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new date.to!;
      toDate.setHours(23, 59, 59, 999);
      
      return saleDate >= fromDate && saleDate <= toDate;
    });

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);

    setReport({
      totalSales,
      numberOfSales: filteredSales.length,
      sales: filteredSales,
      startDate: date.from,
      endDate: date.to,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Report Generator</CardTitle>
          <CardDescription>
            Select a date range to generate a sales report.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button onClick={handleGenerateReport} disabled={!date?.from || !date?.to}>
            <FileText className="mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {report ? (
        <Card>
          <CardHeader>
            <CardTitle>Report for {format(report.startDate, "LLL dd, y")} - {format(report.endDate, "LLL dd, y")}</CardTitle>
            <CardDescription>
              A summary of sales activity for the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(report.totalSales)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Number of Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.numberOfSales}</div>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Transactions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <Link href="/customers" className="hover:underline text-primary">
                        {sale.customerName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href="/inventory" className="hover:underline text-primary">
                        {sale.product}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={sale.status === "Paid" ? "default" : "secondary"}
                        className={sale.status === "Paid" ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"}
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
         <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <BarChart className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No Report Generated</h3>
            <p>Select a date range and click "Generate Report" to see your sales data.</p>
        </div>
      )}
    </div>
  );
}
