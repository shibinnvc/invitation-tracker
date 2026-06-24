import { useEffect } from 'react';
import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db, authReady } from '../firebase/config';

const DEFAULT_CATEGORIES = [
  { id: 'my-friends', name: 'My Friends', order: 1, subcategories: [] },
  { id: 'relatives', name: 'Relatives', order: 2, subcategories: [] },
  { id: 'neighbours', name: 'Neighbours', order: 3, subcategories: [] },
  { id: 'fathers-friends', name: "Father's Friends", order: 4, subcategories: [] },
  { id: 'mothers-friends', name: "Mother's Friends", order: 5, subcategories: [] },
  { id: 'shiyas-friends', name: "Shiyas' Friends", order: 6, subcategories: [] },
  { id: 'shibilas-friends', name: "Shibila's Friends", order: 7, subcategories: [] },
  { id: 'shafnas-friends', name: "Shafna's Friends", order: 8, subcategories: [] },
];

// Guards against React StrictMode (dev) running the effect twice in the same
// session, which would otherwise race the emptiness check and double-seed.
let seedStarted = false;

export function useSeed() {
  useEffect(() => {
    if (seedStarted) return;
    seedStarted = true;

    async function seed() {
      await authReady; // ensure we have an auth token before reading/writing
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) return;

      // Deterministic IDs make seeding idempotent: even if this runs more than
      // once concurrently, every category maps to the same document instead of
      // creating duplicates.
      const batch = writeBatch(db);
      for (const { id, ...cat } of DEFAULT_CATEGORIES) {
        batch.set(doc(db, 'categories', id), {
          ...cat,
          createdAt: new Date(),
        });
      }
      await batch.commit();

      // Seed default PIN = 1234
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.empty) {
        await setDoc(doc(db, 'settings', 'app'), { pin: '1234' });
      }
    }

    seed().catch((err) => {
      seedStarted = false; // allow a retry if seeding failed
      console.error(err);
    });
  }, []);
}
