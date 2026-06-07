# Changelog - WalBlob

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-06-07

### Added
- Metadata packaging utility (`src/utils/metadata.ts`) for original filename preservation.
- Sequential Batch Upload support with queue management.
- `.walblob` recovery package generation and import.
- Local History Vault using browser localStorage (Metadata only, keys excluded).
- QR code generation for mobile recovery (Local implementation).
- URL-based Blob ID auto-fill for the recovery screen.
- Advanced recovery status indicators (Fetch -> Verify -> Decrypt -> Ready).

### Changed
- Refactored `encryptFile` and `decryptFile` to support the V2.1 Metadata Protocol.
- Updated Dashboard UI to support batch processing and history management.
- Replaced external QR service with `qrcode` library for improved privacy.

### Optimized
- Implemented `React.lazy` for secondary pages to reduce initial bundle size.
- Cleaned up `lucide-react` imports across the codebase.
- Stabilized recovery workflow for high-volume data.

## [2.0.0] - Initial Release
- Core Walrus integration.
- Client-side AES-256 encryption.
- Standalone retrieval page.
- Premium SaaS design language.
