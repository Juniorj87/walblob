# Contributing to WalBlob

We welcome contributions from the community! To maintain the premium quality of the codebase, please follow these guidelines.

## Development Workflow

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Juniorj87/walblob.git
   cd walblob
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Code Style**:
   - We use **Tailwind CSS 4** for all styling.
   - We use **Framer Motion** for animations.
   - Follow **SOLID** principles and maintain clean component boundaries.
   - Ensure all new components are **responsive**.

4. **Linting & Verification**:
   Before submitting a PR, ensure there are no lint or type errors:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```

## Pull Request Process

1. Create a feature branch (`feat/your-feature` or `fix/your-fix`).
2. Commit your changes with **Conventional Commits**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `refactor:` for code changes that neither fix a bug nor add a feature
   - `perf:` for performance improvements
   - `chore:` for maintenance tasks
3. Ensure documentation is updated if necessary.
4. Submit the PR using the provided template with a clear description and screenshots.

## Security

If you discover a security vulnerability, please do NOT open a public issue. Contact the maintainers privately.
