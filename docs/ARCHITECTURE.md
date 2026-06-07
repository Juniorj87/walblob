# Technical Architecture

WalBlob is designed as a secure, stateless frontend for the Walrus decentralized storage network.

## 🏗️ Tech Stack

- **Frontend**: React 19 (using the latest experimental features for performance)
- **Tooling**: Vite + TypeScript 5
- **Styling**: Tailwind CSS 4 (using the high-performance Rust engine)
- **Animations**: Framer Motion 12
- **State Management**: React Query 5 + React State
- **Encryption**: Web Crypto API (Native browser implementation)

## 🔐 Encryption Layer (AES-GCM)

WalBlob uses **AES-256-GCM** (Galois/Counter Mode) for all encryption.
- **Key Generation**: Cryptographically secure keys are generated per file.
- **Nonce (IV)**: A unique 12-byte initialization vector is used for every encryption operation.
- **Authentication Tag**: GCM provides an authentication tag that verifies data integrity and authenticity.

## 📦 Storage Layer (Walrus)

Direct integration with the Walrus Protocol.
- **Publisher**: Files are uploaded to Publisher nodes.
- **Aggregator**: Files are retrieved from Aggregator nodes.
- **Epochs**: Users can define storage duration (epochs).

## 🔄 Data Flow

### Upload Flow
1. **User selects file**.
2. **Encryption**: `encryptFile()` generates a key and IV, then seals the file.
3. **Metadata**: Original filename and type are packed into a metadata header.
4. **Upload**: The sealed blob is sent to the Walrus Publisher.
5. **Output**: User receives a Blob ID and the decryption Key.

### Retrieval Flow
1. **User provides Blob ID + Key**.
2. **Fetch**: The sealed blob is retrieved from the Walrus Aggregator.
3. **Verification**: The system checks the blob format.
4. **Decryption**: `decryptFile()` uses the provided Key and IV (extracted from the blob header) to unseal the data.
5. **Download**: The decrypted file is offered for download with its original name and type.

## 🛠️ Key Utilities

- `src/utils/encryption.ts`: Core cryptographic functions.
- `src/utils/metadata.ts`: Logic for packing/unpacking file metadata.
- `src/hooks/useWalrus.ts`: Custom hook for network operations.
