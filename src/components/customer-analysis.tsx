
"use client";

import { useState, useEffect } from "react";
import {
  generateCustomerInsights,
  type CustomerInsightsOutput,
} from "@/ai/flows/customer-insights";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader, User, Zap, TrendingUp, ShoppingBag, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAuth } from "@/context/auth-context";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "@/lib/firestore-service";
import type { Customer } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

export function CustomerAnalysis() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [insights, setInsights] = useState<CustomerInsightsOutput | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return; // Guard against undefined user
      setLoadingData(true);
      try {
        const userCustomers = await getCustomers(user.uid);
        setCustomers(userCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error",
          description: "Failed to fetch customer data. Please check permissions.",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchCustomers();
    } else {
      setLoadingData(false); // If no user, stop loading
    }
  }, [user, toast]);


  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    setInsights(null);
    try {
      const result = await generateCustomerInsights({ customers });
      setInsights(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate customer insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingInsights(false);
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
      day: 'numeric',
      timeZone: 'UTC' // To prevent off-by-one day errors
    });
  }

  const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const formData = new FormData(event.currentTarget);
    const newCustomerData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      totalSpent: parseFloat(formData.get("totalSpent") as string) || 0,
      lastPurchaseDate: new Date(),
    };

    if (newCustomerData.name && newCustomerData.email) {
       try {
        const id = await addCustomer(user.uid, newCustomerData);
        setCustomers([{ id, ...newCustomerData, lastPurchaseDate: newCustomerData.lastPurchaseDate.toISOString() }, ...customers]);
        setIsAddDialogOpen(false);
        toast({ title: "Success", description: "Customer added successfully." });
      } catch (error) {
        console.error("Error adding customer:", error);
        toast({ title: "Error", description: "Failed to add customer.", variant: "destructive" });
      }
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer || !user) return;

    const formData = new FormData(event.currentTarget);
    const updatedData: Partial<Customer> = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      totalSpent: parseFloat(formData.get("totalSpent") as string),
    };
    
    try {
      await updateCustomer(user.uid, editingCustomer.id, updatedData);
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...updatedData } : c));
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      toast({ title: "Success", description: "Customer updated successfully." });
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({ title: "Error", description: "Failed to update customer.", variant: "destructive" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete && user) {
      try {
        await deleteCustomer(user.uid, customerToDelete.id);
        setCustomers(customers.filter(c => c.id !== customerToDelete.id));
        setCustomerToDelete(null);
        toast({ title: "Success", description: "Customer deleted successfully." });
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast({ title: "Error", description: "Failed to delete customer.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              A list of all customers in your system.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter the details for the new customer. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCustomer}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" name="email" type="email" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalSpent" className="text-right">Total Spent</Label>
                    <Input id="totalSpent" name="totalSpent" type="number" step="0.01" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                  <Button type="submit">Save Customer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
           {loadingData ? (
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(customer)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Customer</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => setCustomerToDelete(customer)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Customer</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this customer record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCustomerToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           )}
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
            <Button onClick={handleGenerateInsights} disabled={loadingInsights || customers.length === 0} size="sm">
              {loadingInsights && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingInsights && (
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
          ) : !loadingInsights && (
            <div className="text-center text-muted-foreground p-8">
              <Zap className="mx-auto h-8 w-8 mb-2" />
              <p>Click "Generate" to get AI insights.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <form onSubmit={handleUpdateCustomer}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingCustomer.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={editingCustomer.email} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-totalSpent" className="text-right">Total Spent</Label>
                  <Input id="edit-totalSpent" name="totalSpent" type="number" step="0.01" defaultValue={editingCustomer.totalSpent} className="col-span-3" required />
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
    </div>
  );
}

    