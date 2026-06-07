# WalBlob v2 - Visual Layout Mockups (Usability Focus)

## 1. Desktop Layout (1280px Grid)
*Goal: Minimalist, clean, "Upload within 5 seconds".*

```text
_______________________________________________________________________________
| [Logo] WALBLOB          Features   Security   FAQ           [Connect Wallet] | (Navbar - Clean Glass)
|_____________________________________________________________________________|
|                                                                             |
|   [ HERO SECTION - 80vh ]                                                   |
|                                                                             |
|      STORE FILES PRIVATELY ON WALRUS                                        |
|      Encrypted. Anonymous. Decentralized.                                   |
|                                                                             |
|      ___________________________________________________________            |
|     |                                                           |           |
|     |                    [ UPLOAD ZONE ]                        |           |
|     |                                                           |           |
|     |            Drop files here or Click to browse             |           |
|     |           (Images, Videos, Documents - Up to 2GB)         |           |
|     |___________________________________________________________|           |
|     |  [Retention: 30D v]    [Encryption: AES-256]    [Cost: --] |           |
|     |___________________________________________________________|           |
|                                                                             |
|_____________________________________________________________________________|
|                                                                             |
|   [ HOW IT WORKS - Minimal Timeline ]                                       |
|                                                                             |
|     1. Upload  ----->  2. Encrypt  ----->  3. Store  ----->  4. Share       |
|                                                                             |
|_____________________________________________________________________________|
|                                                                             |
|   [ FEATURES - Clean 3x2 Grid ]                                             |
|                                                                             |
|   +-------------------+   +-------------------+   +-------------------+     |
|   | [Icon] Encrypted  |   | [Icon] Anonymous  |   | [Icon] Permanent  |     |
|   +-------------------+   +-------------------+   +-------------------+     |
|   | [Icon] Fast Ret.  |   | [Icon] Decentral. |   | [Icon] Wallet Dr. |     |
|   +-------------------+   +-------------------+   +-------------------+     |
|                                                                             |
|_____________________________________________________________________________|
|                                                                             |
|   [ STORAGE CALCULATOR ]                                                    |
|                                                                             |
|      Size: [----------o----------] 500 GB                                   |
|      Days: [------o--------------] 365 Days                                 |
|      Result: 0.45 SUI                                                       |
|                                                                             |
|_____________________________________________________________________________|
|                                                                             |
|   [ FAQ - Clean Accordion ]                                                 |
|                                                                             |
|      > What is Walrus?                                                      |
|      > How safe is my data?                                                 |
|      > Do I need a wallet?                                                  |
|                                                                             |
|_____________________________________________________________________________|
|                                                                             |
|   [ FOOTER - Minimal ]                                                      |
|                                                                             |
|   WalBlob © 2026      Docs  GitHub  Twitter  Privacy  Terms                 |
|_____________________________________________________________________________|
```

## 2. Mobile Layout (375px Grid)
*Goal: Stacked, vertical scrolling, thumb-friendly buttons.*

```text
_________________________
| [=]   WALBLOB   [Icon]|
|_______________________|
|                       |
|   STORE FILES         |
|   PRIVATELY...        |
|                       |
|  +-----------------+  |
|  |                 |  |
|  |  [ DROP ZONE ]  |  |
|  |                 |  |
|  +-----------------+  |
|  | Select File     |  |
|  +-----------------+  |
|                       |
|   [ HOW IT WORKS ]    |
|    1. Upload          |
|    2. Encrypt         |
|    3. Store           |
|    4. Share           |
|                       |
|   [ FEATURES ]        |
|   [ Card 1 ]          |
|   [ Card 2 ]          |
|   ...                 |
|                       |
|   [ FOOTER ]          |
|_______________________|
```

## 3. Hierarchy & Placement Logic
1. **Upload Zone (Star of the show)**: Placed directly in the Hero, visible immediately "Above the Fold". It is the largest interactive element.
2. **Value Prop**: Large headline + minimal subheadline supporting the Upload Zone.
3. **Validation**: "How it Works" and "Features" follow to build trust once the user has seen the primary action.
4. **Interactive Utility**: Calculator and FAQ are placed lower as secondary tools for committed users.

## 4. Visual Adjustments (Reduction of Noise)
- **Particles**: Reduced by 80%. Only 5-10 subtle, slow-moving "data blobs" in the deep background.
- **Animations**: Reduced by 70%. Focus on functional transitions (hover states, file drop feedback, accordion expansion).
- **Borders**: Using soft inner glows and box-shadows for card depth instead of high-contrast white borders.
- **Typography**: Inter (UI) and Space Grotesk (Headers) for a professional, high-end SaaS feel.
