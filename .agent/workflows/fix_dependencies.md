---
description: Fix package manager conflicts and reinstall dependencies with pnpm
---

# Fix Dependencies & Switch to pnpm

This workflow resolves the `EPERM` and package manager conflict errors by cleaning the environment and reinstalling everything with `pnpm`.

> [!IMPORTANT]
> **Stop `npx convex dev`**: You MUST stop any running development servers (Ctrl+C) before running this workflow, or the file deletion will fail with `EPERM`.

1. Remove mixed package manager locks and existing modules.
   ```powershell
   Remove-Item -Recurse -Force node_modules, package-lock.json, pnpm-lock.yaml -ErrorAction SilentlyContinue
   ```

2. Reinstall all dependencies using pnpm (this respects the package.json).
   // turbo
   pnpm install

3. Verify and install missing Convex components to ensure everything is consistent.
   // turbo
   pnpm add @convex-dev/stripe @convex-dev/rate-limiter @convex-dev/action-retrier @convex-dev/resend @convex-dev/crons

4. Generate Convex types.
   // turbo
   npx convex codegen
