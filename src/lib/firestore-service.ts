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

// Note: We are using a simplified model where we pass the userId to each function.
// In a more complex app, you might handle this in a more abstract way.

// Generic function to get a collection reference for a user
const getUserCollection = (userId: string, collectionName: string) => {
  // This correctly points to a subcollection under the user's document.
  // e.g., /users/{userId}/customers
  return collection(db, "users", userId, collectionName);
};


// Customer Functions
export const getCustomers = async (userId: string): Promise<Customer[]> => {
  const customersCol = getUserCollection(userId, "customers");
  const q = query(customersCol, orderBy("lastPurchaseDate", "desc"));
  const customerSnapshot = await getDocs(q);
  const customerList = customerSnapshot.docs.map(doc => {
    const data = doc.data();
    // Safely handle Timestamp to Date conversion if data comes from server
    const lastPurchaseDate = data.lastPurchaseDate instanceof Timestamp
      ? data.lastPurchaseDate.toDate()
      : new Date(data.lastPurchaseDate);
    
    return {
      id: doc.id,
      ...data,
      // Convert Date to string for client-side consistency (e.g., for date inputs)
      lastPurchaseDate: lastPurchaseDate.toISOString().split('T')[0],
    } as Customer;
  });
  return customerList;
};

export const addCustomer = async (userId: string, customerData: Omit<Customer, "id">) => {
    const customersCol = getUserCollection(userId, "customers");
    // Ensure the date is stored as a Firestore Timestamp for proper ordering
    const docRef = await addDoc(customersCol, {
      ...customerData,
      lastPurchaseDate: customerData.lastPurchaseDate ? new Date(customerData.lastPurchaseDate) : new Date(),
    });
    return docRef.id;
};

export const updateCustomer = async (userId: string, customerId: string, customerData: Partial<Omit<Customer, "id">>) => {
  const customerDoc = doc(db, "users", userId, "customers", customerId);
  const updateData: { [key: string]: any } = { ...customerData };
  // If date is being updated, convert it to a Date object for Firestore
  if (customerData.lastPurchaseDate) {
    updateData.lastPurchaseDate = new Date(customerData.lastPurchaseDate);
  }
  await updateDoc(customerDoc, updateData);
};


export const deleteCustomer = async (userId: string, customerId: string) => {
  const customerDoc = doc(db, "users", userId, "customers", customerId);
  await deleteDoc(customerDoc);
};


// Sales Functions
export const getSales = async (userId: string): Promise<Sale[]> => {
  const salesCol = getUserCollection(userId, "sales");
  const q = query(salesCol, orderBy("date", "desc"));
  const salesSnapshot = await getDocs(q);
  const salesList = salesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to Date object for use in the client
      date: (data.date as Timestamp).toDate(),
    } as Sale;
  });
  return salesList;
};

export const addSale = async (userId: string, saleData: Omit<Sale, "id" | "date"> & { date?: Date }) => {
  const salesCol = getUserCollection(userId, "sales");
  // Store dates as Firestore Timestamps
  const docRef = await addDoc(salesCol, {
    ...saleData,
    date: saleData.date || new Date(), // Use provided date or now
  });
  return docRef.id;
};


export const updateSale = async (userId: string, saleId: string, saleData: Partial<Omit<Sale, "id">>) => {
  const saleDoc = doc(db, "users", userId, "sales", saleId);
  await updateDoc(saleDoc, saleData);
};

export const deleteSale = async (userId: string, saleId: string) => {
  const saleDoc = doc(db, "users", userId, "sales", saleId);
  await deleteDoc(saleDoc);
};
