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
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Sale = {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: "Paid" | "Pending";
  date: Date;
};

export function SalesTracker() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

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

  const handleAddSale = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSale: Sale = {
      id: `S${(sales.length + 1).toString().padStart(3, "0")}`,
      customerName: formData.get("customerName") as string,
      product: formData.get("product") as string,
      amount: parseFloat(formData.get("amount") as string),
      status: formData.get("status") as "Paid" | "Pending",
      date: new Date(),
    };

    if (newSale.customerName && newSale.product && !isNaN(newSale.amount)) {
      setSales([newSale, ...sales]);
      setIsAddDialogOpen(false);
    }
  };

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSale = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSale) return;

    const formData = new FormData(event.currentTarget);
    const updatedSale: Sale = {
      ...editingSale,
      customerName: formData.get("customerName") as string,
      product: formData.get("product") as string,
      amount: parseFloat(formData.get("amount") as string),
      status: formData.get("status") as "Paid" | "Pending",
    };

    setSales(sales.map(s => s.id === updatedSale.id ? updatedSale : s));
    setEditingSale(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (saleToDelete) {
      setSales(sales.filter(s => s.id !== saleToDelete.id));
      setSaleToDelete(null);
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>A list of the most recent sales.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2" />
                Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Sale</DialogTitle>
                <DialogDescription>
                  Enter the details for the new sale. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSale}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerName" className="text-right">
                      Customer
                    </Label>
                    <Input id="customerName" name="customerName" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">
                      Product
                    </Label>
                    <Input id="product" name="product" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select name="status" defaultValue="Paid">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Sale</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
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
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(sale)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Sale</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => setSaleToDelete(sale)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Sale</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this sale record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setSaleToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Sale Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>
              Update the sale details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingSale && (
            <form onSubmit={handleUpdateSale}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-customerName" className="text-right">
                    Customer
                  </Label>
                  <Input id="edit-customerName" name="customerName" defaultValue={editingSale.customerName} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product" className="text-right">
                    Product
                  </Label>
                  <Input id="edit-product" name="product" defaultValue={editingSale.product} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-amount" className="text-right">
                    Amount
                  </Label>
                  <Input id="edit-amount" name="amount" type="number" step="0.01" defaultValue={editingSale.amount} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select name="status" defaultValue={editingSale.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
