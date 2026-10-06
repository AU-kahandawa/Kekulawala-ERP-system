// Kekulawala Unified ERP - Central Master Backend Server
// Supports MAN Workstations, Firebase Cloud Sync, and Master REST API

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

import { runSeed } from '../scripts/seedFirebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Client Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ5CTpx5Xw-JSArb0rPjxGsxNJezIgNLc",
  authDomain: "kekulawala-erp.firebaseapp.com",
  projectId: "kekulawala-erp",
  storageBucket: "kekulawala-erp.firebasestorage.app",
  messagingSenderId: "560015673217",
  appId: "1:560015673217:web:da59e652f0bbfcecd84a80"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// 1. Health Check
app.get('/api/health', async (req, res) => {
  try {
    const clientsSnap = await getDocs(collection(db, 'clients'));
    res.json({
      status: 'healthy',
      serverTime: new Date().toISOString(),
      firebaseProject: firebaseConfig.projectId,
      firestoreConnected: true,
      clientCount: clientsSnap.size,
      version: '5.0.0'
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      error: err.message,
      firebaseProject: firebaseConfig.projectId,
      firestoreConnected: false
    });
  }
});

// 2. Database Collection Counts & Health
app.get('/api/db/stats', async (req, res) => {
  const collections = [
    'clients', 'projects', 'materials', 'tools',
    'suppliers', 'employees', 'quotations', 'letters',
    'transactions', 'orders', 'transports', 'settings', 'legal'
  ];
  try {
    const stats = {};
    for (const c of collections) {
      try {
        const snap = await getDocs(collection(db, c));
        stats[c] = snap.size;
      } catch {
        stats[c] = 0;
      }
    }
    res.json({
      success: true,
      projectId: firebaseConfig.projectId,
      collections: stats,
      totalDocuments: Object.values(stats).reduce((a, b) => a + b, 0)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Trigger Master Database Seeding
app.post('/api/db/seed', async (req, res) => {
  try {
    console.log('[Backend] Seeding database via API request...');
    await runSeed();
    res.json({
      success: true,
      message: 'Master database successfully seeded and synchronized with Firebase Firestore!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Full Database Backup Export
app.get('/api/db/backup', async (req, res) => {
  const collections = [
    'clients', 'projects', 'materials', 'tools',
    'suppliers', 'employees', 'quotations', 'letters',
    'transactions', 'orders', 'transports', 'settings'
  ];
  try {
    const dump = {
      exportedAt: new Date().toISOString(),
      firebaseProject: firebaseConfig.projectId,
      version: '5.0.0',
      data: {}
    };
    for (const c of collections) {
      const snap = await getDocs(collection(db, c));
      dump.data[c] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="kekulawala-backup-${Date.now()}.json"`);
    res.json(dump);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Generic Collection Fetch
app.get('/api/collections/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const snap = await getDocs(collection(db, name));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Generic Document Save (Upsert)
app.post('/api/collections/:name', async (req, res) => {
  const { name } = req.params;
  const payload = req.body;
  const docId = String(payload.id || payload.code || Date.now());
  try {
    const ref = doc(db, name, docId);
    const savedData = {
      ...payload,
      id: docId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, savedData, { merge: true });
    res.json({ success: true, id: docId, data: savedData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Generic Document Delete
app.delete('/api/collections/:name/:id', async (req, res) => {
  const { name, id } = req.params;
  try {
    await deleteDoc(doc(db, name, id));
    res.json({ success: true, message: `Deleted ${id} from ${name}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Serve Production Frontend if dist/ exists
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to SPA index.html or API info
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.json({
        message: 'Kekulawala Master Backend API is running.',
        endpoints: ['/api/health', '/api/db/stats', '/api/db/backup', '/api/db/seed']
      });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Kekulawala Master ERP Backend running on:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`   Firebase Project: ${firebaseConfig.projectId}`);
  console.log(`====================================================`);
});
