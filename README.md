# Mobile

> The vcassist mobile app.

## Quick start

```bash
# install dependencies
git submodule update --init --recursive
git submodule foreach --recursive "pnpm install"

pnpm build
pnpm cap sync (ios|android)
pnpm cap build (ios|android)
pnpm cap open (ios|android)
```

## Commands

- `git submodule update --remote` - updates all submodules
- `git submodule foreach --recursive "pnpm install"` - installs node modules for all submodules
- `pnpm build` - build the web frontend
- `pnpm cap build (ios|android)` - build the capacitor app wrapper for a given platform
- `pnpm cap open (ios|android)` - open the built capacitor app wrapper for the given platform
- `pnpm cap sync (ios|android)` - sync native dependencies and capacitor plugins for a given platform

