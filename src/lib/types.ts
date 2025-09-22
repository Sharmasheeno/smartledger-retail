export type Customer = {
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    lastPurchaseDate: string; // Using string to be compatible with date input `yyyy-mm-dd`
};

export type Sale = {
    id: string;
    customerName: string;
    product: string;
    amount: number;
    status: "Paid" | "Pending";
    date: string; // Changed to string to ensure serializability
};
