import {defineConfig} from 'vitepress'

export default defineConfig({
  title: 'unwrapit',
  description: 'A graceful way to handle errors in TypeScript',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      {text: 'Guide', link: '/guide/getting-started'},
      {text: 'API', link: '/api/wrap'},
      {text: 'Recipes', link: '/recipes/export-wrapped-functions'},
      {text: 'GitHub', link: 'https://github.com/musicq/unwrapit'},
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          {text: 'Getting Started', link: '/guide/getting-started'},
          {text: 'Why Use It', link: '/guide/why-use-it'},
          {text: 'Result Flow', link: '/guide/result-flow'},
          {text: 'Configuration', link: '/guide/configuration'},
          {text: 'RxJS', link: '/guide/rxjs'},
          {text: 'Maintaining Docs', link: '/guide/maintaining-docs'},
        ],
      },
      {
        text: 'API',
        items: [
          {text: 'wrap', link: '/api/wrap'},
          {text: 'toWrap', link: '/api/to-wrap'},
          {text: 'ok', link: '/api/ok'},
          {text: 'err', link: '/api/err'},
          {text: 'Result', link: '/api/result'},
          {text: 'unwrap', link: '/api/unwrap'},
          {text: 'unwrapOr', link: '/api/unwrap-or'},
          {text: 'unwrapOrElse', link: '/api/unwrap-or-else'},
          {text: 'expect', link: '/api/expect'},
          {text: 'mapErr', link: '/api/map-err'},
          {text: 'match', link: '/api/match'},
          {text: 'defineUnwrapitConfig', link: '/api/define-unwrapit-config'},
          {text: 'Types', link: '/api/types'},
        ],
      },
      {
        text: 'Recipes',
        items: [
          {
            text: 'Export Wrapped Functions',
            link: '/recipes/export-wrapped-functions',
          },
          {text: 'Return Result Directly', link: '/recipes/return-result'},
        ],
      },
    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/musicq/unwrapit'},
    ],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/musicq/unwrapit/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
