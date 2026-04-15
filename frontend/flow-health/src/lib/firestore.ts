import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Appointments ──────────────────────────────────────────────────────────────
export const appointmentsRef = collection(db, 'appointments');

export async function getAppointments() {
  const q = query(appointmentsRef, orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAppointment(data: DocumentData) {
  const docRef = await addDoc(appointmentsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function updateAppointment(id: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, 'appointments', id), data);
}

export function subscribeToAppointments(callback: (data: DocumentData[]) => void) {
  const q = query(appointmentsRef, orderBy('date', 'asc'));
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Tokens / Queue ────────────────────────────────────────────────────────────
export const tokensRef = collection(db, 'tokens');

export async function getTokens() {
  const snapshot = await getDocs(tokensRef);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addToken(data: DocumentData) {
  const docRef = await addDoc(tokensRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function updateToken(id: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, 'tokens', id), data);
}

export function subscribeToTokens(callback: (data: DocumentData[]) => void) {
  return onSnapshot(tokensRef, snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Complaints ────────────────────────────────────────────────────────────────
export const complaintsRef = collection(db, 'complaints');

export async function getComplaints() {
  const snapshot = await getDocs(complaintsRef);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addComplaint(data: DocumentData) {
  const docRef = await addDoc(complaintsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function updateComplaint(id: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, 'complaints', id), data);
}

export function subscribeToComplaints(callback: (data: DocumentData[]) => void) {
  return onSnapshot(complaintsRef, snapshot => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort by createdAt descending (newest first)
    docs.sort((a: any, b: any) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
    callback(docs);
  });
}

export async function deleteComplaint(id: string) {
  await deleteDoc(doc(db, 'complaints', id));
}
