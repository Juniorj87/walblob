# WalBlob Release Notes — v2.1.0 (Enhancement Release)

## 🚀 Overview
WalBlob v2.1.0 introduces major enhancements to the end-to-end data preservation and recovery experience. This release moves beyond simple blob storage to a complete metadata-aware encrypted ecosystem.

## ✨ New Features

### 1. Metadata Preservation Protocol
Recovered files now maintain their original properties.
- **Original Filename Restoration**: No more generic `walblob-xxx` names.
- **MIME Type Detection**: Automatic recognition of images, videos, and documents.
- **Precision Recovery**: File size and integrity verified locally.

### 2. Sequential Batch Uploads
Process multiple files in a single session.
- **Sequential Queue**: Encrypts and uploads files one by one for maximum reliability.
- **Independent Keys**: Each file in the batch receives its own unique AES-256-GCM key.
- **Real-time Status**: Granular progress tracking per file.

### 3. The ".walblob" Recovery Package
A new standard for secure credential management.
- **Single-file Recovery**: Download a `.walblob` package containing all access metadata.
- **Drag & Drop Import**: Simply drop your package into the recovery zone to auto-fill credentials.
- **URL Portability**: Shareable links (`/retrieve?blob=xxx`) for mobile-ready recovery.

### 4. Local History Vault
A private, browser-only record of your activity.
- **Persistence**: Keep track of your last 50 uploads.
- **Zero-Knowledge**: Keys are NEVER stored in history.
- **Wipe Command**: One-click deletion of all local records.

## 🛡️ Security & Hardening
- **Local QR Generation**: External QR service removed; codes are now generated 100% locally.
- **Zero-Knowledge Audit**: Verified that encryption keys never touch `localStorage` or session logs.
- **Performance**: Bundle size optimized to <250kB gzip via aggressive code splitting.

## 🛠️ Technical Specs
- **Encryption**: AES-GCM 256-bit (Browser Native)
- **Protocol**: WALBLOB-V2.1 Binary Wrapper
- **Storage**: Walrus (Sui Ecosystem)
- **Framework**: React 19 + Vite 8
