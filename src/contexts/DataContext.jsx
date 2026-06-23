import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [invitees, setInvitees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const unsubCats = onSnapshot(
      query(collection(db, 'categories'), orderBy('order')),
      (snap) => {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Firestore categories error:', err);
        setDbError(err.message);
        setLoading(false);
      }
    );

    const unsubInv = onSnapshot(
      query(collection(db, 'invitees'), orderBy('createdAt', 'desc')),
      (snap) => {
        setInvitees(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.error('Firestore invitees error:', err);
      }
    );

    return () => {
      unsubCats();
      unsubInv();
    };
  }, []);

  // --- Invitees ---
  async function addInvitee(data) {
    await addDoc(collection(db, 'invitees'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateInvitee(id, data) {
    await updateDoc(doc(db, 'invitees', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async function deleteInvitee(id) {
    await deleteDoc(doc(db, 'invitees', id));
  }

  // --- Categories ---
  async function addCategory(name) {
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.order || 0), 0);
    await addDoc(collection(db, 'categories'), {
      name,
      order: maxOrder + 1,
      subcategories: [],
      createdAt: serverTimestamp(),
    });
  }

  async function updateCategory(id, data) {
    await updateDoc(doc(db, 'categories', id), data);
  }

  async function deleteCategory(id) {
    await deleteDoc(doc(db, 'categories', id));
  }

  // --- PIN ---
  async function getPin() {
    const snap = await getDoc(doc(db, 'settings', 'app'));
    return snap.exists() ? snap.data().pin : null;
  }

  async function updatePin(newPin) {
    await setDoc(doc(db, 'settings', 'app'), { pin: newPin }, { merge: true });
  }

  return (
    <DataContext.Provider
      value={{
        categories,
        invitees,
        loading,
        dbError,
        addInvitee,
        updateInvitee,
        deleteInvitee,
        addCategory,
        updateCategory,
        deleteCategory,
        getPin,
        updatePin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
