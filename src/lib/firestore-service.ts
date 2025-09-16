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
  where,
} from "firebase/firestore";
import type { Customer, Sale } from "./types";

// Note: We are using a simplified model where we pass the userId to each function.
// In a more complex app, you might handle this in a more abstract way.

// Generic function to get a collection reference for a user
const getUserCollection = (userId: string, collectionName: string) => {
  return collection(db, "users", userId, collectionName);
};


// Customer Functions
export const getCustomers = async (userId: string): Promise<Customer[]> => {
  const customersCol = getUserCollection(userId, "customers");
  const q = query(customersCol, orderBy("lastPurchaseDate", "desc"));
  const customerSnapshot = await getDocs(q);
  const customerList = customerSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to string for client-side consistency
      lastPurchaseDate: (data.lastPurchaseDate as Timestamp).toDate().toISOString().split('T')[0],
    } as Customer;
  });
  return customerList;
};

export const addCustomer = async (userId: string, customerData: Omit<Customer, "id">) => {
    const customersCol = getUserCollection(userId, "customers");
    const docRef = await addDoc(customersCol, {
      ...customerData,
      lastPurchaseDate: new Date(customerData.lastPurchaseDate),
    });
    return docRef.id;
};

export const updateCustomer = async (userId: string, customerId: string, customerData: Partial<Omit<Customer, "id">>) => {
  const customerDoc = doc(db, "users", userId, "customers", customerId);
  const updateData: { [key: string]: any } = { ...customerData };
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
      // Convert Firestore Timestamp to Date object
      date: (data.date as Timestamp).toDate(),
    } as Sale;
  });
  return salesList;
};

export const addSale = async (userId: string, saleData: Omit<Sale, "id" | "date"> & { date?: Date }) => {
  const salesCol = getUserCollection(userId, "sales");
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
