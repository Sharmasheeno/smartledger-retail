import type { IntelligentStockAlertsInput } from "@/ai/flows/intelligent-stock-alerts";

export const dashboardMetrics = {
  totalSales: {
    value: 45231.89,
    change: 12.5,
  },
  inventoryLevels: {
    value: 1205,
    change: -5.2,
  },
  customerEngagement: {
    value: 89,
    change: 8,
  },
  newOrders: {
    value: 345,
    change: 15,
  },
};

export const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
  { month: "Jul", sales: 7000 },
];

export const inventoryStatusData = [
    { name: 'In Stock', value: 850, fill: 'var(--color-inStock)' },
    { name: 'Low Stock', value: 250, fill: 'var(--color-lowStock)' },
    { name: 'Out of Stock', value: 105, fill: 'var(--color-outOfStock)' },
];

export const stockAlertsData: IntelligentStockAlertsInput = {
  currentStockLevels: {
    "P001": 15,
    "P002": 50,
    "P003": 5,
    "P004": 120,
    "P005": 8
  },
  historicalSalesData: {
    "P001": [
      { date: "2023-06-01", quantitySold: 10 },
      { date: "2023-06-02", quantitySold: 12 },
      { date: "2023-06-03", quantitySold: 8 },
    ],
    "P002": [
      { date: "2023-06-01", quantitySold: 5 },
      { date: "2023-06-02", quantitySold: 7 },
      { date: "2023-06-03", quantitySold: 6 },
    ],
    "P003": [
      { date: "2023-06-01", quantitySold: 20 },
      { date: "2023-06-02", quantitySold: 25 },
      { date: "2023-06-03", quantitySold: 30 },
    ],
    "P005": [
        { date: "2023-12-15", quantitySold: 5 },
        { date: "2023-12-16", quantitySold: 8 },
        { date: "2023-12-17", quantitySold: 10 },
    ]
  },
  seasonalTrends: {
    "P005": 2.5 // Christmas holiday trend
  }
};

export const mockCustomers = [
  { id: "C001", name: "Alice Johnson", email: "alice@example.com", totalSpent: 1250.75, lastPurchaseDate: "2024-05-15" },
  { id: "C002", name: "Bob Williams", email: "bob@example.com", totalSpent: 850.50, lastPurchaseDate: "2024-05-20" },
  { id: "C003", name: "Charlie Brown", email: "charlie@example.com", totalSpent: 2300.00, lastPurchaseDate: "2024-05-01" },
  { id: "C004", name: "Diana Miller", email: "diana@example.com", totalSpent: 450.25, lastPurchaseDate: "2024-01-10" },
  { id: "C005", name: "Ethan Davis", email: "ethan@example.com", totalSpent: 1800.00, lastPurchaseDate: "2024-05-18" },
  { id: "C006", name: "Fiona Garcia", email: "fiona@example.com", totalSpent: 300.00, lastPurchaseDate: "2023-11-22" },
];
