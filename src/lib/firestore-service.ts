import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  query,
} from "firebase/firestore";
import type { Customer, Sale } from "./types";

// Customer Functions
export const getCustomers = async (userId: string): Promise<Customer[]> => {
  const customersCol = collection(db, "users", userId, "customers");
  const q = query(customersCol, orderBy("lastPurchaseDate", "desc"));
  const customerSnapshot = await getDocs(q);
  const customerList = customerSnapshot.docs.map(doc => {
    const data = doc.data();
    const lastPurchaseDate = data.lastPurchaseDate instanceof Timestamp 
      ? data.lastPurchaseDate.toDate().toISOString()
      : new Date().toISOString();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      totalSpent: data.totalSpent,
      lastPurchaseDate: lastPurchaseDate,
    } as Customer;
  });
  return customerList;
};

export const addCustomer = async (userId: string, customerData: Omit<Customer, "id">) => {
    const customersCol = collection(db, "users", userId, "customers");
    const docRef = await addDoc(customersCol, {
      ...customerData,
      lastPurchaseDate: new Date(customerData.lastPurchaseDate),
    });
    return docRef.id;
};

export const updateCustomer = async (userId: string, customerId: string, customerData: Partial<Omit<Customer, "id">>) => {
  const customerDocRef = doc(db, "users", userId, "customers", customerId);
  const updateData: { [key: string]: any } = { ...customerData };
  if (customerData.lastPurchaseDate) {
    updateData.lastPurchaseDate = new Date(customerData.lastPurchaseDate);
  }
  await updateDoc(customerDocRef, updateData);
};


export const deleteCustomer = async (userId: string, customerId: string) => {
  const customerDocRef = doc(db, "users", userId, "customers", customerId);
  await deleteDoc(customerDocRef);
};


// Sales Functions
export const getSales = async (userId: string): Promise<Sale[]> => {
  const salesCol = collection(db, "users", userId, "sales");
  const q = query(salesCol, orderBy("date", "desc"));
  const salesSnapshot = await getDocs(q);
  const salesList = salesSnapshot.docs.map(doc => {
    const data = doc.data();
    const date = data.date instanceof Timestamp 
        ? data.date.toDate().toISOString() 
        : new Date().toISOString();
    return {
      id: doc.id,
      customerName: data.customerName,
      product: data.product,
      amount: data.amount,
      status: data.status,
      date: date,
    } as Sale;
  });
  return salesList;
};

export const addSale = async (userId: string, saleData: Omit<Sale, "id" | "date"> & { date: Date }) => {
  const salesCol = collection(db, "users", userId, "sales");
  const docRef = await addDoc(salesCol, {
    ...saleData,
    date: Timestamp.fromDate(saleData.date),
  });
  return docRef.id;
};


export const updateSale = async (userId: string, saleId: string, saleData: Partial<Omit<Sale, "id">>) => {
  const saleDocRef = doc(db, "users", userId, "sales", saleId);
  const updateData: { [key: string]: any } = { ...saleData };
    if (saleData.date) {
        updateData.date = new Date(saleData.date);
    }
  await updateDoc(saleDocRef, updateData);
};

export const deleteSale = async (userId: string, saleId: string) => {
  const saleDocRef = doc(db, "users", userId, "sales", saleId);
  await deleteDoc(saleDocRef);
};
