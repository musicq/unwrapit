# Maintaining Docs

Docs live in this repository under `docs/` and are built with VitePress.

## Local workflow

Start a local docs server:

```shell
pnpm run docs:dev
```

Build the static site:

```shell
pnpm run docs:build
```

Preview the production build:

```shell
pnpm run docs:preview
```

## Vercel deployment

This repo includes `vercel.json` so a Vercel project can deploy the docs from
the repository root:

- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run docs:build`
- Output Directory: `docs/.vitepress/dist`

After Vercel is connected to the GitHub repo, every docs change can be reviewed
as a normal pull request with a preview deployment.

## Keeping docs current

When the public API changes, update the related page in `docs/api/` in the same
pull request as the code. Small examples belong near the API page. Longer usage
patterns belong in `docs/recipes/`.
