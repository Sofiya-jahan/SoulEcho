import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { AnalysisResult } from './nlpEngine';

export interface DiaryEntry {
  id?: string;
  userId: string;
  date: string; // ISO string for the day
  entryText: string;
  analysis: AnalysisResult;
  createdAt: Timestamp;
}

const ENTRIES_COLLECTION = 'entries';

export const saveEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      ...entry,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving entry:", error);
    throw error;
  }
};

export const getUserEntries = async (userId: string) => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DiaryEntry[];
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

export const getEntryByDate = async (userId: string, date: string) => {
    try {
      const q = query(
        collection(db, ENTRIES_COLLECTION),
        where('userId', '==', userId),
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as DiaryEntry;
      }
      return null;
    } catch (error) {
      console.error("Error fetching entry by date:", error);
      throw error;
    }
  };
