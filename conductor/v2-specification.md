# WalBlob v2 - Product Specification

## 1. Product Vision
WalBlob is a premium, consumer-facing encrypted storage platform powered by Walrus. It hides all blockchain complexity behind a world-class SaaS interface (Linear/Vercel style).

**Tagline:** Encrypted. Anonymous. Permanent.
**Target:** 10/10 Visual Quality.

---

## 2. Design System

### Color Palette (Deep Space & Accents)
- **BG Primary:** `#050816` (Deep Midnight)
- **BG Surface:** `rgba(255, 255, 255, 0.03)` (Glassmorphism 3.0)
- **Primary:** `#00D1FF` (Electric Cyan - Actions)
- **Secondary:** `#7B61FF` (Modern Purple - Accents)
- **Success:** `#00FFA3` (Cyber Emerald - Verified)
- **Text:** `#FFFFFF` (Heading), `#94A3B8` (Muted/Body)

### Typography System
- **Display:** `Space Grotesk` (Bold/Black, -4% tracking) - Headlines
- **UI/Body:** `Inter` (Medium/Regular) - Interface & Labels
- **Monospace:** `JetBrains Mono` - File IDs & Hashes (only where needed)

### Spacing & Geometry
- **Scale:** 4px | 8px | 16px | 32px | 64px | 128px
- **Radius:** 24px (Cards), 100px (Pills/Buttons)
- **Borders:** Ultra-fine `rgba(255,255,255,0.05)` or simple Box Shadows.

---

## 3. Wireframes (ASCII)

### Desktop (1280px Grid)
```text
_______________________________________________________________________________
|  [Logo] WALBLOB          Features   Docs   FAQ          [Connect Wallet]    |  (Navbar - Glass)
|_____________________________________________________________________________|
|                                                                             |
|          STORE FILES ON WALRUS             [   3D Visualization    ]        |
|          WITHOUT TRUSTING ANYONE           [   Floating Blobs      ]        |
|                                            [   Network Particles   ]        |
|          Encrypted. Anonymous. Permanent.                                   |
|                                                                             |
|          [Upload File]  [Connect Wallet]                                   |  (Hero - 100vh)
|_____________________________________________________________________________|
|                                                                             |
|     [   Encrypted   ] [   Anonymous   ] [   Permanent   ]                   |
|     [     Card      ] [     Card      ] [     Card      ]                   |  (Features - Row 1)
|                                                                             |
|     [   Fast Ret.   ] [ Decentralized ] [ Wallet Powered]                   |
|     [     Card      ] [     Card      ] [     Card      ]                   |  (Features - Row 2)
|_____________________________________________________________________________|
|                                                                             |
|                       ____________________________________                  |
|                      |        UPLOAD SECURE ZONE          |                 |
|                      |    (Drag & Drop Area / Preview)    |                 |
|                      |____________________________________|                 |
|                      | [Retention] [Encryption: ON] [Cost]|                 |  (Upload Zone)
|                      |_________ [ START UPLOAD ] _________|                 |
|_____________________________________________________________________________|
```

### Mobile (375px)
```text
_________________________
| [=]   WALBLOB   [Icon]|
|_______________________|
|                       |
|   STORE FILES ON      |
|   WALRUS...           |
|                       |
|   [3D VISUAL]         |
|                       |
|   [Upload File]       |
|   [Connect Wallet]    |
|_______________________|
|                       |
|   [ Encrypted Card ]  |
|   [ Anonymous Card ]  |
|_______________________|
```

---

## 4. Component Hierarchy & Folder Structure

### Folder Structure (`/frontend-v2`)
```text
/src
  /assets        (SVG Icons, 3D Assets)
  /components
    /ui          (Shared: Button, Input, GlassCard, Accordion)
    /sections    (Hero, Features, UploadZone, Calculator, FAQ)
    /animations  (OrbitalParticles, FloatingBlobs)
  /hooks         (useWalrus, useEncryption, useWallet)
  /styles        (DesignSystem.css, Tailwind.config.js)
  /utils         (EncryptionEngine, WalrusUploader)
```

### Component Hierarchy
- **AppShell** (Main Layout)
  - **Navbar** (Sticky Glass)
  - **HeroSection** (100vh)
    - **HeadlineGroup**
    - **HeroAnimation** (Framer Motion Canvas/Elements)
  - **FeatureGrid**
    - **PremiumCard** (x6)
  - **UnifiedUploadExperience**
    - **DropZone**
    - **FilePreview**
    - **UploadConfig** (Retention, Pricing)
  - **ProcessTimeline** (How it Works)
  - **FAQAccordion**
  - **Footer** (Minimal)

---

## 5. Animation System (Framer Motion)
- **Reveals:** Staggered `y: 20, opacity: 0` -> `y: 0, opacity: 1`.
- **Floating:** `animate={{ y: [-10, 10] }}` with `infinity` loop for Hero blobs.
- **Magnetic:** Header links and buttons respond to mouse proximity.
- **Glass Shimmer:** Subtle diagonal highlight sweep on cards.

---

## 6. User Flow
1. **Landing:** User arrives, 100vh Hero builds trust in 3 seconds.
2. **Action:** Clicks "Upload File" -> Smooth scroll to `UploadZone`.
3. **Selection:** Drops file. UI shows immediate preview and encryption status.
4. **Auth:** User connects wallet (if not connected).
5. **Finalize:** User selects retention -> "Finalize & Store".
6. **Confirmation:** Success animation -> "Encrypted Link Copied".

---

## 7. Development Requirements
- **Framework:** React 19 + TypeScript.
- **Styling:** Tailwind CSS (Modern Engine).
- **Motion:** Framer Motion.
- **Icons:** Lucide React (Premium usage).
