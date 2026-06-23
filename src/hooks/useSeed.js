import { useEffect } from 'react';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DEFAULT_CATEGORIES = [
  { name: 'My Friends', order: 1, subcategories: [] },
  { name: 'Relatives', order: 2, subcategories: [] },
  { name: 'Neighbours', order: 3, subcategories: [] },
  { name: "Father's Friends", order: 4, subcategories: [] },
  { name: "Mother's Friends", order: 5, subcategories: [] },
  { name: "Shiyas' Friends", order: 6, subcategories: [] },
  { name: "Shibila's Friends", order: 7, subcategories: [] },
  { name: "Shafna's Friends", order: 8, subcategories: [] },
];

export function useSeed() {
  useEffect(() => {
    async function seed() {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) return;

      for (const cat of DEFAULT_CATEGORIES) {
        await addDoc(collection(db, 'categories'), {
          ...cat,
          createdAt: new Date(),
        });
      }

      // Seed default PIN = 1234
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.empty) {
        await setDoc(doc(db, 'settings', 'app'), { pin: '1234' });
      }
    }

    seed().catch(console.error);
  }, []);
}
