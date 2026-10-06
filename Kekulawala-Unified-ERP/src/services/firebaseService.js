// Kekulawala Unified ERP - Firebase Real-Time Service & Backend Layer
// Connects to Firebase project: kekulawala-erp

import { db, auth, storage } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

import {
  DEFAULT_COMPANY_SETTINGS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_MATERIALS,
  INITIAL_TOOLS,
  INITIAL_SUPPLIERS,
  INITIAL_EMPLOYEES,
  INITIAL_QUOTATIONS,
  INITIAL_LETTERS,
  INITIAL_TRANSACTIONS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_TRANSPORTS
} from '../data/initialData';

// Generic Collection Real-Time Subscription
export function subscribeCollection(collectionName, onData, onError) {
  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onData(items);
      },
      (error) => {
        console.warn(`[Firebase] Subscription error on "${collectionName}":`, error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error(`[Firebase] Failed to bind subscriber to "${collectionName}":`, err);
    return () => {};
  }
}

// Subscribe to a Single Document (e.g. settings/company)
export function subscribeDocument(collectionName, docId, onData, onError) {
  try {
    const docRef = doc(db, collectionName, String(docId));
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onData({ id: docSnap.id, ...docSnap.data() });
        } else {
          onData(null);
        }
      },
      (error) => {
        console.warn(`[Firebase] Doc subscription error on "${collectionName}/${docId}":`, error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error(`[Firebase] Failed to subscribe to "${collectionName}/${docId}":`, err);
    return () => {};
  }
}

// One-time Fetch
export async function fetchCollection(collectionName) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(`[Firebase] fetchCollection error (${collectionName}):`, err);
    return [];
  }
}

// Upsert Document (preserves or generates ID)
export async function saveDocument(collectionName, docId, data) {
  const finalId = String(docId || data.id || data.code || Date.now());
  const ref = doc(db, collectionName, finalId);
  const payload = {
    ...data,
    id: finalId,
    updatedAt: new Date().toISOString()
  };
  await setDoc(ref, payload, { merge: true });
  return payload;
}

// Delete Document
export async function removeDocument(collectionName, docId) {
  const ref = doc(db, collectionName, String(docId));
  await deleteDoc(ref);
  return docId;
}

// --- Specific Entity Helpers ---

// Company Settings
export async function saveCompanySettings(settings) {
  return saveDocument('settings', 'company', settings);
}

// Clients
export async function saveClient(client) {
  return saveDocument('clients', client.id, client);
}
export async function deleteClient(id) {
  return removeDocument('clients', id);
}

// Projects
export async function saveProject(project) {
  return saveDocument('projects', project.id || project.code, project);
}
export async function deleteProject(id) {
  return removeDocument('projects', id);
}

// Materials / Inventory
export async function saveMaterial(material) {
  return saveDocument('materials', material.id || material.code, material);
}
export async function deleteMaterial(id) {
  return removeDocument('materials', id);
}

// Tools
export async function saveTool(tool) {
  return saveDocument('tools', tool.id || tool.code, tool);
}
export async function deleteTool(id) {
  return removeDocument('tools', id);
}

// Suppliers
export async function saveSupplier(supplier) {
  return saveDocument('suppliers', supplier.id, supplier);
}
export async function deleteSupplier(id) {
  return removeDocument('suppliers', id);
}

// Employees & Subcontractors
export async function saveEmployee(employee) {
  return saveDocument('employees', employee.id || employee.code, employee);
}
export async function deleteEmployee(id) {
  return removeDocument('employees', id);
}

// Quotations
export async function saveQuotation(quotation) {
  return saveDocument('quotations', quotation.id || quotation.code, quotation);
}
export async function deleteQuotation(id) {
  return removeDocument('quotations', id);
}

// Letters & Agreements
export async function saveLetter(letter) {
  return saveDocument('letters', letter.id || letter.code, letter);
}
export async function deleteLetter(id) {
  return removeDocument('letters', id);
}

// Financial Transactions
export async function saveTransaction(tx) {
  return saveDocument('transactions', tx.id || tx.ref, tx);
}
export async function deleteTransaction(id) {
  return removeDocument('transactions', id);
}

// Purchase Orders
export async function savePurchaseOrder(order) {
  return saveDocument('orders', order.id || order.code, order);
}
export async function deletePurchaseOrder(id) {
  return removeDocument('orders', id);
}

// Transport Logistics
export async function saveTransport(trip) {
  return saveDocument('transports', trip.id, trip);
}
export async function deleteTransport(id) {
  return removeDocument('transports', id);
}

// Attendance
export async function saveAttendanceEntry(empId, dayKey, status) {
  const docRef = doc(db, 'attendance', String(empId));
  await setDoc(docRef, { [dayKey]: status, updatedAt: new Date().toISOString() }, { merge: true });
}

// Database Health & Live Stats
export async function getDatabaseStats() {
  const collections = [
    'clients', 'projects', 'materials', 'tools',
    'suppliers', 'employees', 'quotations', 'letters',
    'transactions', 'orders', 'transports'
  ];
  const stats = {};
  for (const c of collections) {
    try {
      const snap = await getDocs(collection(db, c));
      stats[c] = snap.size;
    } catch {
      stats[c] = 0;
    }
  }
  return stats;
}

// Trigger Client-Side Full Seeder
export async function seedDatabaseClientSide() {
  await saveCompanySettings(DEFAULT_COMPANY_SETTINGS);
  for (const c of INITIAL_CLIENTS) await saveClient(c);
  for (const p of INITIAL_PROJECTS) await saveProject(p);
  for (const m of INITIAL_MATERIALS) await saveMaterial(m);
  for (const t of INITIAL_TOOLS) await saveTool(t);
  for (const s of INITIAL_SUPPLIERS) await saveSupplier(s);
  for (const e of INITIAL_EMPLOYEES) await saveEmployee(e);
  for (const q of INITIAL_QUOTATIONS) await saveQuotation(q);
  for (const l of INITIAL_LETTERS) await saveLetter(l);
  for (const tx of INITIAL_TRANSACTIONS) await saveTransaction(tx);
  for (const po of INITIAL_PURCHASE_ORDERS) await savePurchaseOrder(po);
  for (const tr of INITIAL_TRANSPORTS) await saveTransport(tr);
  return true;
}

// Export Full Database to JSON Dump
export async function exportDatabaseBackupJSON() {
  const collections = [
    'clients', 'projects', 'materials', 'tools',
    'suppliers', 'employees', 'quotations', 'letters',
    'transactions', 'orders', 'transports', 'settings'
  ];
  const dump = {
    exportedAt: new Date().toISOString(),
    firebaseProject: 'kekulawala-erp',
    data: {}
  };
  for (const c of collections) {
    dump.data[c] = await fetchCollection(c);
  }
  return dump;
}

// Compare and synchronise state mutations with Firestore
export function syncListState(collectionName, currentItems, nextItems, saveItemFn, deleteItemFn) {
  if (!Array.isArray(currentItems) || !Array.isArray(nextItems)) return;
  const currentMap = new Map(currentItems.map((i) => [String(i.id || i.code), i]));
  const nextMap = new Map(nextItems.map((i) => [String(i.id || i.code), i]));

  // Check for deleted items
  for (const [id] of currentMap.entries()) {
    if (!nextMap.has(id)) {
      deleteItemFn(id).catch((e) => console.warn(`[Firebase] Delete failed for ${collectionName}/${id}:`, e));
    }
  }

  // Check for added or modified items
  for (const [id, item] of nextMap.entries()) {
    const existing = currentMap.get(id);
    if (!existing || JSON.stringify(existing) !== JSON.stringify(item)) {
      saveItemFn(item).catch((e) => console.warn(`[Firebase] Save failed for ${collectionName}/${id}:`, e));
    }
  }
}

// --- Storage & Authentication Helpers ---

// Upload letterhead, logo, watermark, stamp, or document to Firebase Storage
export async function uploadAsset(storagePath, file) {
  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (err) {
    console.error(`[Firebase Storage] Upload failed for ${storagePath}:`, err);
    throw err;
  }
}

// Real-time Authentication State Listener
export function subscribeAuth(onUserChange) {
  return onAuthStateChanged(auth, onUserChange);
}

// User Sign In
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// User Sign Out
export async function logoutUser() {
  return await signOut(auth);
}


