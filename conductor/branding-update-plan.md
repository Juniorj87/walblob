# Branding Update: Walrus+Blob Identity

This plan outlines the replacement of all current WalBlob branding (Database/Storage/Server icons) with the new Walrus+Blob primary identity across the entire application.

## Objective
Replace all occurrences of legacy storage-themed icons (Lucide Database, HardDrive, Server) with the new Walrus+Blob logo and ensure consistent brand messaging.

## Assets
- Logo: `/walblob-logo.png`
- Favicon: `/favicon.png`
- (Optional SVG): `/walblob-logo.svg`

## Key Files & Context

### 1. Root & Metadata
- `index.html`: Update favicon, title, OpenGraph, and Twitter meta tags.

### 2. Core Navigation & Layout
- `src/components/ui/Header.tsx`: Replace `Database` icon with the new logo image. Update height to 40px (desktop) / 32px (mobile). Remove white background container.
- `src/components/ui/Footer.tsx`: Replace `Database` icon with the new logo.

### 3. Feature Sections
- `src/App.tsx`: Update `LoadingFallback` (Suspense fallback) to use the new logo instead of `Loader2`.
- `src/components/sections/Dashboard.tsx`: Update `ShowcaseCardMock` header branding.
- `src/components/ui/ShowcaseCard.tsx`: Update branding in the header.
- `src/components/sections/VisualSecurityModel.tsx`: Replace `Database` icon in "Phase 01: RAW FILE".
- `src/components/sections/Status.tsx`: Replace `Server` icons with a neutral utility icon (e.g., `Activity`).
- `src/components/ui/UploadAnalyticsCard.tsx`: Replace `HardDrive` with a neutral icon (e.g., `Package`).

## Implementation Steps

### Phase 1: Global Branding & Metadata
- [ ] Update `index.html` title to: `WalBlob — Zero-Knowledge Storage on Walrus`.
- [ ] Replace `/favicon.svg` with `/favicon.png` in all link/meta tags.
- [ ] Update `og:image` and `twitter:image` to point to `/favicon.png`.

### Phase 2: Header & Footer
- [ ] **Header.tsx**:
    - Remove `Database` import.
    - Replace `Database` div with `img` tag: `src="/walblob-logo.png"`.
    - Apply classes: `h-8 md:h-10 w-auto object-contain`.
    - Remove `bg-white rounded-xl flex items-center justify-center shadow-2xl`.
- [ ] **Footer.tsx**:
    - Replace `Database` div with `img` tag: `src="/walblob-logo.png"`.
    - Apply classes: `h-12 w-auto object-contain`.
    - Remove background box.

### Phase 3: UI Components & Sections
- [ ] **App.tsx**: Update `LoadingFallback` to show the logo with a subtle pulse animation instead of a spinning loader.
- [ ] **Dashboard.tsx** & **ShowcaseCard.tsx**: Replace `Database` with the new logo image in the "Upload History" showcase headers.
- [ ] **VisualSecurityModel.tsx**: Replace `Database` in the protocol flow with a generic `File` icon or similar, adhering to the "No generic storage icons" rule for branding, but ensuring Phase 1 (Raw File) is still clear. *Recommendation: Use Lucide `File` icon.*
- [ ] **Status.tsx**: Replace `Server` with `Activity` to avoid "server icons" as per requirements.
- [ ] **UploadAnalyticsCard.tsx**: Replace `HardDrive` with `Layers` or `Package`.

### Phase 4: Final Cleanup
- [ ] Search for any remaining `lucide-react` imports of `Database`, `HardDrive`, `Server` and remove them if they were used for branding.
- [ ] Verify that "WalBlob" text remains consistent next to the logo.

## Verification
- [ ] Check Header logo responsiveness (40px desktop / 32px mobile).
- [ ] Verify favicon shows up in browser tab.
- [ ] Inspect mobile tab branding and title.
- [ ] Ensure no legacy database/storage/server icons remain.
