# nafisazizir.com

Personal site of Nafis Riza — projects, blog, and about. Built with Next.js (App Router), Tailwind CSS, and MDX content in `content/`.

The design layer is [ziiz](https://ziiz.vercel.app): `@nafisazizir/ziiz` supplies the ramp, type roles, materials, prose (`typeset`) and the Shiki theme through `app/globals.css`, and `components/ui` and `components/docs` are ziiz registry items (`npx shadcn@latest add @ziiz/<name>`). The agent skill for the system is in `.agents/skills/ziiz/`.

## Develop

```bash
pnpm install
pnpm dev
```

## Content

Posts live in `content/*.mdx` with frontmatter (`title`, `description`, `date`, `type: blog | project`, `tags`, `cover`). Article images go in `public/articles/<slug>/`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```
