import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    WhereFilterOp
} from 'firebase/firestore';
import { db } from './firebase';

// Generic function to get all documents from a collection
export const getCollection = async (collectionName: string): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    throw error;
  }
};

// Get a single document by ID
export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document ${docId}:`, error);
    throw error;
  }
};

// Add a new document to a collection
export const addDocument = async (collectionName: string, data: DocumentData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (
  collectionName: string, 
  docId: string, 
  data: Partial<DocumentData>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId}:`, error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId}:`, error);
    throw error;
  }
};

// Query documents with conditions
export const queryDocuments = async (
  collectionName: string, 
  field: string, 
  operator: WhereFilterOp, 
  value: unknown
): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
};
