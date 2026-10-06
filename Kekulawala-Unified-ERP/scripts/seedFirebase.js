import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  writeBatch
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
} from '../src/data/initialData.js';

import { DAILY_LEGAL_TIPS, SRI_LANKA_LEGAL_ACTS } from '../src/config/legalKnowledge.js';

const firebaseConfig = {
  apiKey: "AIzaSyBJ5CTpx5Xw-JSArb0rPjxGsxNJezIgNLc",
  authDomain: "kekulawala-erp.firebaseapp.com",
  projectId: "kekulawala-erp",
  storageBucket: "kekulawala-erp.firebasestorage.app",
  messagingSenderId: "560015673217",
  appId: "1:560015673217:web:da59e652f0bbfcecd84a80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedCollection(name, items, idKey = 'id') {
  console.log(`\nChecking collection "${name}"...`);
  const snap = await getDocs(collection(db, name));
  console.log(`Current items in "${name}": ${snap.size}`);

  let added = 0;
  for (const item of items) {
    const docId = String(item[idKey] || item.code || Math.random().toString(36).substring(2, 9));
    const ref = doc(db, name, docId);
    await setDoc(ref, {
      ...item,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    added++;
  }
  console.log(`✓ Synchronized ${added} document(s) in "${name}".`);
}

async function seedCompanySettings() {
  console.log('\nChecking "settings/company"...');
  const ref = doc(db, 'settings', 'company');
  await setDoc(ref, {
    ...DEFAULT_COMPANY_SETTINGS,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log('✓ Company settings synchronized.');
}

async function seedLegalKnowledge() {
  console.log('\nChecking "legal" collection...');
  for (let i = 0; i < DAILY_LEGAL_TIPS.length; i++) {
    const tip = DAILY_LEGAL_TIPS[i];
    await setDoc(doc(db, 'legal', `tip-${i + 1}`), {
      type: 'tip',
      index: i,
      tipText: tip,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  for (let i = 0; i < SRI_LANKA_LEGAL_ACTS.length; i++) {
    const topic = SRI_LANKA_LEGAL_ACTS[i];
    await setDoc(doc(db, 'legal', `topic-${topic.id || i + 1}`), {
      type: 'topic',
      ...topic,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
  console.log('✓ Legal knowledge database synchronized.');
}

export async function runSeed() {
  console.log('====================================================');
  console.log('Starting Kekulawala ERP Firebase Master Database Seeder');
  console.log(`Target Firebase Project: ${firebaseConfig.projectId}`);
  console.log('====================================================');

  try {
    await seedCompanySettings();
    await seedCollection('clients', INITIAL_CLIENTS, 'id');
    await seedCollection('projects', INITIAL_PROJECTS, 'id');
    await seedCollection('materials', INITIAL_MATERIALS, 'id');
    await seedCollection('tools', INITIAL_TOOLS, 'id');
    await seedCollection('suppliers', INITIAL_SUPPLIERS, 'id');
    await seedCollection('employees', INITIAL_EMPLOYEES, 'id');
    await seedCollection('quotations', INITIAL_QUOTATIONS, 'id');
    await seedCollection('letters', INITIAL_LETTERS, 'id');
    await seedCollection('transactions', INITIAL_TRANSACTIONS, 'id');
    await seedCollection('orders', INITIAL_PURCHASE_ORDERS, 'id');
    await seedCollection('transports', INITIAL_TRANSPORTS, 'id');
    await seedLegalKnowledge();

    console.log('\n====================================================');
    console.log('🎉 Firebase Database Seeding & Schema Setup COMPLETE!');
    console.log('====================================================');
    return true;
  } catch (err) {
    console.error('Seed Error:', err);
    throw err;
  }
}

// Run directly if script is executed from command line
if (process.argv[1]?.endsWith('seedFirebase.js')) {
  runSeed().then(() => process.exit(0)).catch(() => process.exit(1));
}
