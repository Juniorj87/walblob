# Implementation Plan - WalBlob Premium Redesign

## Objective
Rebuild the WalBlob frontend from scratch to achieve a 10/10 visual target (Linear/Vercel/Stripe level). Transition from a technical dashboard to a premium consumer storage platform.

## Design System
- **Background**: `#050816`
- **Primary**: `#00D1FF` (Cyan)
- **Secondary**: `#7B61FF` (Indigo/Purple)
- **Accent**: `#00FFA3` (Emerald)
- **Text**: `#FFFFFF`, Muted: `#94A3B8`
- **Philosophy**: Layered lighting, 32px blur glassmorphism, premium shadows, no borders, fluid motion.

## Component Architecture
1. **Layout**: `AppContainer` (Absolute Black/Indigo base, floating light orbs).
2. **Navigation**: `Header` (Minimal, sticky, glass).
3. **Sections**:
   - `Hero`: 100vh immersive section with 3D-inspired CSS/Motion blobs.
   - `FeatureGrid`: 6 cards (Encrypted, Anonymous, Permanent, Decentralized, Fast, Wallet-Powered).
   - `UploadZone`: The core experience. Better than Dropbox.
   - `Timeline`: How it works.
   - `Calculator`: Live storage estimator.
   - `FAQ`: Premium accordion.
   - `Footer`: Minimal.

## Phased Implementation

### Phase 1: Infrastructure Reset
- [ ] Update `tailwind.config.js` with the new color palette, animations, and typography.
- [ ] Clean `index.css` for a "Premium Dark" baseline.

### Phase 2: Immersive Hero & Navigation
- [ ] Build the `MassiveHero` using Framer Motion (reveal animations).
- [ ] Create `OrbitalVisualization` - animated floating blobs/network particles.

### Phase 3: The Upload Experience
- [ ] Implement `UnifiedUploadExperience` - drag & drop, file preview, retention selection.
- [ ] Integrate existing Walrus and Encryption logic into the new UI.

### Phase 4: Supporting Premium Blocks
- [ ] Build `FeatureGrid` with hover-glow effects.
- [ ] Build `InteractiveTimeline` for the "How it Works" section.
- [ ] Build `LiveStorageEstimator` with interactive inputs.

### Phase 5: Final Polish
- [ ] Global lighting effects (mouse interaction).
- [ ] Smooth section reveals (Intersection Observer / Framer Motion).
- [ ] Mobile optimization.

## Verification
- [ ] Zero presence of old terminal UI or admin dashboard styles.
- [ ] 100vh Hero impact check.
- [ ] Animation smoothness (10/10).
- [ ] Logic integrity (Wallet, Upload, Retrieval).
