import { version } from '../../package.json'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'
import Unocss from 'unocss/vite'
import Container from 'markdown-it-container'

export default defineConfig({

  title: 'Induction Docs', // FIXME
  description: '',
  base:"/ElectronicsInduction/",
  cleanUrls: true,
  themeConfig: themeConfig(),

  markdown: {
    headers: {
      level: [0, 0],
    },

    lineNumbers: process.env.NODE_ENV === 'development',
    theme: 'dracula',
    config: md => {
      md.use(Container, 'card', {
        render: (tokens, idx) => {
          const token = tokens[idx]

          // console.log('token :>> ', token)

          const title = token.info.trim().slice(5).trim()
          const titleHtml = md.render(`## ${title}`)

          return token.nesting === 1 ? `<Demo>${titleHtml}` : '</Demo>\n'
        },
      })

      md.use(Container, 'code', {
        render: (tokens, idx) => {
          const token = tokens[idx]

          // console.log('token :>> ', token)
          const demoName = token.info.trim().slice(5).trim()

          return token.nesting === 1 ? `<template #demo><${demoName} /></template><template #code>` : '</template>\n'
        },
      })
    },
  },
  vite: viteConfig(),

})

function themeConfig() { 
  return({

    socialLinks: [
      { icon: 'github', link: 'https://github.com/UNSW-Makerspaces/ElectronicsInduction' }, //FIXME
    ],

    nav: nav(),

    sidebar: {
      '/docs/': sidebarDocs()
    },

  });
};


function viteConfig() { 
  return({
    plugins: [
      Unocss({
        configFile: '../../uno.config.ts',
      }),
    ],
    resolve: {
      alias: {
        '@anu': fileURLToPath(new URL('../../packages/anu-vue', import.meta.url)),
      },
    },
    build: {
      ssr: false,
    },

  });
} 


function nav() {
  return [
    { 
      text: 'Documentation', 
      items: [
        {
          text: 'Getting Started',
          link: '/docs/',
        },
        { 
          text: 'Induction Overview',
          link: '/docs/getting-started/induction',
        },
        { 
          text: 'Exercises',
          link: '/docs/exercises/'
        }
      ]
    },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: '/', // FIXME
        },
      ],
    },
  ]
}

function sidebarDocs() {
  return [
    { 
      text: 'Getting Started',
      collapsed: true,
      collapsible: true,
      link: '/docs/',
      items: [
        {
          text: 'Makerspace',
          link: '/docs/getting-started/info',
        },
        {
          text: 'Rules and Safety',
          link: '/docs/getting-started/safety',
        },
        {
          text: 'Getting Help',
          link: '/docs/getting-started/help',
        },
        {
          text: 'Induction Overview',
          link: '/docs/getting-started/induction',
        },

      ]
    },
    { 
      text: 'Induction Exercise',
      collapsed: true,
      collapsible: true,
      link: '/docs/exercises/',
      items: [
        {
          text: '1. Board Preparation',
          link: '/docs/exercises/1/',
        },
        {
          text: '2. Component Placement',
          link: '/docs/exercises/2/',
        },
        {
          text: '3. Reflow Soldering',
          link: '/docs/exercises/3/',
        },       
        {
          text: '4. Through-Hole Assembly',
          link: '/docs/exercises/4/',
        },       
        {
          text: '5. Board Inspection and Testing',
          link: '/docs/exercises/5/',
        },
      ],
    },
    { 
      text: "Additional Content",
      collapsed: true, 
      items: [
        {
          text: 'Additional Steps (optional)',
          link: '/docs/extras/additional-steps'
        },
        { 
          text: 'Resources',
          link: '/docs/extras/resources',
          collapsed: true, 
          colapsible: true,
          items: [ 
            {
              text: 'Board Pinouts',
              link: '/docs/extras/board-pinouts'
            }
          ]
        }
      ],
    },
  ]
}

