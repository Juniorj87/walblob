# WalBlob v3.0

**Zero-Knowledge Encrypted Storage powered by Seal + Walrus on Sui Mainnet.**

WalBlob is a production-grade decentralized storage application that combines Mysten's **Seal threshold encryption** with the **Walrus decentralized storage network** on Sui. Your data is encrypted with 5-of-N threshold cryptography, stored across 97+ storage nodes, and access-controlled entirely on-chain.

---

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Browser   │───▶│  Seal Encrypt │───▶│  Walrus Store   │
│  (Client)   │    │  (5-of-N)    │    │  (Decentralized)│
└─────────────┘    └──────────────┘    └─────────────────┘
                          │
                   ┌──────▼──────┐
                   │ BlobRegistry │
                   │  (Sui Chain) │
                   └─────────────┘
```

### Seal Protocol (Live on Mainnet)
- **Package ID**: `0x51b58964d35455e6c6821f7f6219d085a25e5acb5d4482f10c6d95d7715eb611`
- **BlobRegistry**: `0x4fe089ef9e2c984a8ed7ee5418047a2ab17736f61789d935ff71be6e8e8a64d8`
- **Threshold**: 5-of-N key server consensus
- **Network**: Sui Mainnet

### Walrus Storage
- **Nodes**: 97+ independent storage nodes
- **Shards**: 1000 shards with erasure coding
- **Epochs**: 14 days per epoch (max 53 epochs)
- **Cost**: $0.023/GB/month

## Features

| Feature | Description |
|---|---|
| **Seal Threshold Encryption** | 5-of-N threshold cryptography via Mysten Seal |
| **On-Chain Access Control** | BlobRegistry smart contract on Sui Mainnet |
| **Walrus Decentralized Storage** | 97+ nodes, 1000 shards, erasure coding |
| **Session Key Recovery** | Decrypt with Sui wallet + seal_approve |
| **Recovery Packages** | Export `.walblob` files for offline backup |
| **Blob Explorer** | Inspect blob availability across the network |
| **Local Vault** | Browser-side upload history |
| **QR Recovery** | Mobile-to-desktop recovery via QR codes |
| **Batch Upload** | Queue multiple files for processing |
| **Premium UI** | Terminal-themed SaaS interface |

## Supported File Types

Seal encrypts any file type at the byte level:
- **Documents**: PDF, DOCX, TXT, MD, JSON
- **Images**: PNG, JPG, SVG, GIF, WebP
- **Videos**: MP4, WebM, MOV
- **Audio**: MP3, WAV, OGG
- **Archives**: ZIP, TAR, GZ
- **Code**: JS, TS, PY, RS, SOL
- **Data**: CSV, SQL, DB, BIN

## How It Works

### Upload Flow
```
1. SELECT  → Choose files to encrypt
2. SEAL    → Seal threshold encryption (5-of-N)
3. UPLOAD  → Encrypted blob to Walrus
4. REGISTER → On-chain access control (BlobRegistry)
5. RECOVER → Session key + seal_approve
```

### Recovery Flow
```
1. Connect Sui wallet
2. Enter Blob ID
3. Seal verifies on-chain identity via BlobRegistry
4. Session key decrypts the blob
5. Original file reconstructed in browser
```

## Installation

```bash
git clone https://github.com/Juniorj87/walblob.git
cd walblob
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

```env
# Seal Configuration (Mainnet)
VITE_SEAL_PACKAGE_ID=0x51b58964d35455e6c6821f7f6219d085a25e5acb5d4482f10c6d95d7715eb611
VITE_SEAL_REGISTRY_ID=0x4fe089ef9e2c984a8ed7ee5418047a2ab17736f61789d935ff71be6e8e8a64d8

# Walrus Network (optional overrides)
# VITE_WALRUS_MAINNET_PUBLISHER_URL=https://publisher.walrus.space
# VITE_WALRUS_MAINNET_AGGREGATOR_URL=https://aggregator.walrus.space
```

## Security Model

| Layer | Mechanism |
|---|---|
| **Encryption** | Seal threshold cryptography (5-of-N) |
| **Key Management** | Split across multiple Seal key servers |
| **Access Control** | On-chain BlobRegistry contract |
| **Storage** | Walrus erasure-coded decentralized network |
| **Recovery** | Sui wallet + session key (no seed phrase) |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Encryption**: Mysten Seal SDK (`@mysten/seal`)
- **Blockchain**: Sui (`@mysten/sui`, `@mysten/dapp-kit`)
- **Storage**: Walrus Network
- **Move Contract**: `walblob_access` (access_control module)

## Contract Source

```move
module walblob_access::access_control;

public struct BlobRegistry has key, store {
    id: UID,
}

entry fun seal_approve(id: vector<u8>, registry: &BlobRegistry) {
    assert!(dynamic_field::exists<vector<u8>>(&registry.id, id), EBlobNotRegistered);
}

public fun register_blob(registry: &mut BlobRegistry, blob_id: vector<u8>, ctx: &TxContext) { ... }
public fun transfer_blob(registry: &mut BlobRegistry, blob_id: vector<u8>, new_owner: address, ctx: &TxContext) { ... }
public fun unregister_blob(registry: &mut BlobRegistry, blob_id: vector<u8>, ctx: &TxContext) { ... }
```

## Deployment

### Walrus Sites (Mainnet)
- **Site Object ID**: `0x99068ee1ea5ef40d0e958ff673d7c34712e2081045b1dfd7d14c722534eb8e60`
- **Storage**: 26 epochs (~6 months)
- **Portal**: Requires SuiNS name for `wal.app` access

### Deploy Your Own
```bash
# Install tools
suiup install sui
suiup install walrus

# Deploy contract
sui client publish move/walblob_access --gas-budget 50000000

# Build and deploy site
npm run build
site-builder --context=mainnet deploy dist --epochs 26
```

## Roadmap

### v3.1
- [ ] SuiNS domain (`walblob.wal.app`)
- [ ] Multi-file batch encryption
- [ ] Shared recovery links with expiry

### v3.2
- [ ] Team vaults with role-based access
- [ ] Webhook notifications for blob expiry
- [ ] Advanced blob analytics dashboard

## License

MIT License. See `LICENSE` for details.

---

Built with Seal + Walrus on Sui Mainnet.
