# GaGet.dev

An extensible developer-toolbox starter built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, Lucide icons, and next-themes.

## Included

- Consistent light/dark/system theme support
- Responsive sidebar and header search
- Tool registry for categories and navigation
- SEO metadata per implemented tool
- Generated `robots.txt` and `sitemap.xml`
- JSON formatter / minifier / validator
- URL component encoder / decoder
- UTF-8 Base64 encoder / decoder
- JWT header and claims decoder (does not verify signatures)
- UUID v4 generator
- Reusable shadcn-style Button, Card, Input, Textarea, and Badge components
- TypeScript strict mode

Some tools listed in the directory are roadmap entries, not yet implemented. They are marked Planned and should not be presented as functional tools.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Check before deployment

```bash
npm run typecheck
npm run build
```

The `lint` script is a placeholder for the project's chosen ESLint command. With ESLint 9, configure `eslint.config.mjs` before enabling a CI lint step.

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repository into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://gaget.dev`.
4. Deploy and verify the production build.
5. Add the domain in Vercel and configure DNS as instructed by Vercel.

## Architecture

- `app/`: routes, layouts, metadata, sitemap, and robots
- `components/ui/`: shared shadcn-style UI primitives
- `components/`: shared shell, cards, tool layouts, and workbenches
- `lib/tools/registry.ts`: central directory and navigation metadata
- `features/`: reserved for extracting larger feature modules as the project grows

## Notes

- All implemented transformations run in the browser.
- JWT decoding is not JWT signature verification.
- Do not paste production secrets into tools unless you understand the risks.
- Add automated unit and accessibility tests before treating this as a production release.
