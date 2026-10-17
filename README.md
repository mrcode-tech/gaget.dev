# GaGet.dev

An extensible developer-toolbox built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, Lucide icons, and next-themes.

## Requirements

- Node.js 22 (used by CI for the built-in TypeScript test runner)
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Automated checks

Run these before opening a pull request:

```bash
npm run test:unit
npm run test:component
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The GitHub Actions workflow in `.github/workflows/ci.yml` runs unit and component tests, focused Photo Editor/sidebar regression tests, ESLint, TypeScript checks, a production build, HTTP smoke tests, and Playwright end-to-end tests. It runs on pushes to the active `main`, `stage`, and `feat/mobile-navigation-ux-fixes` branches, and on pull requests targeting `stage` or `main`. Feature changes should be proposed to `stage`; promote verified changes from `stage` to `main`.

**Known setup issue:** the existing `package-lock.json` is stale and omits the declared `@radix-ui/react-select` dependency and its transitive packages, so `npm ci` currently fails. CI temporarily uses `npm install` to regenerate the lockfile in its runner. Regenerate and commit `package-lock.json` from a local checkout before switching CI back to reproducible `npm ci` installs.

The suite is a baseline and does not guarantee full coverage of every tool. Continue expanding regression and browser coverage when features change.

## Deployment

1. Set `NEXT_PUBLIC_SITE_URL=https://gaget.dev` in the Vercel project.
2. Vercel can create preview deployments for feature branches and production deployments from `main`.
3. Review the preview and confirm GitHub Actions checks before merging.

**Important:** GitHub branch protection / required status checks are not enforced on the current plan. CI reports failures, but it cannot prevent a maintainer from merging or pushing to `main`. Treat a failed check as a stop sign and do not deploy that change.

## Architecture

- `app/`: routes, layouts, metadata, sitemap, and robots
- `components/ui/`: shared UI primitives
- `components/`: shared shell and tool workbenches
- `lib/tools/registry.ts`: central tool directory and navigation metadata
- `lib/i18n/messages.ts`: locale metadata and translations
- `tests/`: automated unit, component, smoke, and end-to-end tests
- `specification/design.md`: responsive homepage, shared sidebar, unified Photo Editor, feature inventory, and wireframes for all Tailwind breakpoints

## Security and privacy notes

- Implemented transformations are intended to run in the browser.
- JWT decoding does not verify a token's signature.
- Do not paste production secrets into tools unless you understand the risks.
