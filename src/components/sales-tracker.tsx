"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockSales } from "@/lib/mock-data";
import { PlusCircle } from "lucide-react";

export function SalesTracker() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>A list of the most recent sales.</CardDescription>
        </div>
        <Button size="sm">
          <PlusCircle className="mr-2" />
          Add Sale
        </Button>
      </CardHeader>
      <CardContent>
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
            {mockSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>{sale.product}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sale.status === "Paid" ? "default" : "secondary"
                    }
                    className={
                        sale.status === "Paid" ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"
                    }
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sale.amount)}
                </TableCell>
                <TableCell>{formatDate(sale.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
