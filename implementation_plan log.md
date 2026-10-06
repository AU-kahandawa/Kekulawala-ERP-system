# Implementation Plan - Centralized 4th PC Master Server Architecture

Streamlined **Single Central Master Server Architecture** where the **4th PC** hosts the primary ERP server, manages all local MAN client workstations, and handles all Web/Cloud & CMSys synchronization.

---

## 🏛️ Centralized Master Server Topology

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                      4th PC (CENTRAL MAIN MASTER SERVER)                    │
 │                                                                             │
 │  ┌─────────────────────────┐        ┌───────────────────────────────────┐   │
 │  │ Next.js ERP App Server  │  <───> │ Master Database (SQLite/Postgres) │   │
 │  └────────────┬────────────┘        └───────────────────────────────────┘   │
 └───────────────┼─────────────────────────────────────────────────────────────┘
                 │
       ┌─────────┴───────────────────────┬─────────────────────────┐
       │ MAN / LAN Local Network         │ Low-Bandwidth Web       │ Direct Sync
       ▼                                 ▼                         ▼
┌─────────────────────────┐   ┌────────────────────┐   ┌──────────────────────┐
│ 3rd PC (MAN Workstation)│   │ Web Cloud Server   │   │ CMSys Logistics DB   │
│ Browser Client Only     │   │ (Firebase/Cloud DB)│   │ Integration Bridge   │
└─────────────────────────┘   └────────────────────┘   └──────────────────────┘
```

---

## 🔑 Architecture Highlights & Advantages

1. **Single Source of Truth (Zero Sync Conflicts on MAN)**:
   - All MAN workstations (PC 3, PC 2, PC 1, mobile devices on MAN) open the app via browser (`http://<4th-PC-IP>:8000`).
   - Everyone reads and writes directly to the 4th PC's Master Database. No local DB management or background node sync needed on PC 3.

2. **Centralized Low-Bandwidth Web Sync**:
   - Only the **4th PC** connects to the internet to sync compressed JSON deltas (~2KB - 10KB Gzipped) with the Web/Cloud Database (Firebase) and CMSys.
   - If the 4th PC's internet connection slows down or drops, MAN workstation users experience **zero disruption**—they continue working on MAN at 100% local network speed.

3. **Simplified Maintenance & Antigravity (AG) Management**:
   - Antigravity (AG) runs directly on the 4th PC to automate database backups, CMSys background sync, and system maintenance.
   - Updating or patching the app is done once on the 4th PC. All MAN clients instantly get the latest features when refreshing their browser.

---

## 📋 4th PC Migration Roadmap

### Phase 1: Deploy 4th PC as Main Server

1. **Install Prerequisites on PC 4**:
   - Install Node.js LTS (v20+).
   - Assign a static MAN/LAN IP address to PC 4 (e.g. `192.168.1.100`).
   - Add Windows Firewall Rule for inbound TCP traffic on Port **8000**.

2. **Transfer Application & Database**:
   - Copy project folder and database (`C:\Projects\CE-Logistic panel\CE-Logistic Panel\db\custom.db`) to PC 4.

3. **Start Master Server on PC 4**:
   - Create 1-click launcher `start-main-server.bat`:
     ```cmd
     @echo off
     title CE Logistic Panel - Central Main Server (PC 4)
     echo Launching Central Master Server on 0.0.0.0:8000...
     set PORT=8000
     set HOSTNAME=0.0.0.0
     node .next/standalone/server.js
     pause
     ```
   - Double-click to launch on PC 4.

---

### Phase 2: Connect Web/Cloud & CMSys to PC 4

1. **Configure Web/Cloud Sync on PC 4**:
   - Enable Firebase / Cloud Sync worker on PC 4 to push background micro-deltas to the Web DB over the low-bandwidth web connection.

2. **Configure CMSys Integration Bridge on PC 4**:
   - Connect PC 4's sync bridge to CMSys API endpoints or shared file watch directory (`C:\CMSys_Sync`).

---

### Phase 3: Transition 3rd PC to Client Workstation

1. **Switch PC 3 to Web Client**:
   - On PC 3 (and any other workstation), open Google Chrome or Edge and navigate to:
     👉 **`http://192.168.1.100:8000`**
   - Create a desktop browser shortcut for daily use.
2. **Decommission Local DB on PC 3**:
   - PC 3 no longer runs a local database server, simplifying its setup and saving system resources.

---

## ⚡ Comparison: Before vs. Streamlined PC 4 Architecture

| Feature | Distributed Multi-DB Setup | **Streamlined PC 4 Master Architecture** |
| :--- | :--- | :--- |
| **Main Database** | Replicated on PC 3 & PC 4 | **Single Master DB on PC 4** |
| **PC 3 Workstation Role** | Heavy DB Node | **Lightweight Web Client Browser** |
| **Web Sync Authority** | Split across PCs | **100% Handled by PC 4** |
| **CMSys Integration** | Split | **Centralized on PC 4** |
| **Conflict Risk** | Moderate | **Zero (Single Source of Truth)** |
| **Maintenance Effort** | Multi-point | **Single Machine (PC 4)** |
