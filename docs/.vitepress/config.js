import { version } from '../../package.json'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'
import Unocss from 'unocss/vite'
import Container from 'markdown-it-container'



export default defineConfig({

  title: 'Induction Documentation', // FIXME
  description: '...',
  //base:"/ElectronicsInduction/",
  base: "/",
  cleanUrls: true,
  
  // {{{2 markdown: { ... }
  markdown: {
    headers: {
      level: [0, 0],
    },

    lineNumbers: process.env.NODE_ENV === 'development',
    theme: 'dracula',
    config: md => { // {{{3 Config, containers
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

      md.use(require('markdown-it-footnote'));

    }, // }}} 
  }, // }}} 

  themeConfig: themeConfig(),
  vite: viteConfig(),

})

// {{{2 themeConfig()
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
// }}}

// {{{2 viteConfig 
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
// }}}

// {{{2 nav() 
function nav() {
  return [
    { 
      text: 'Documentation', 
      items: [
        {
          text: 'Getting Started',
          link: '/docs/getting-started/',
        },
        { 
          text: 'Induction Overview',
          link: '/docs/getting-started/induction/',
        },
        { 
          text: 'Exercises',
          link: '/docs/exercises/'
        }, 
        { 
          text: 'More...',
          link: '/docs/more/'
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
// }}}

// {{{1 Sidebar routing and configuration 
function sidebarDocs() {
  return [
    // {{{2 S1: Getting Started 
    { 
      text: 'Getting Started',
      collapsed: true,
      collapsible: true,
      link: '/docs/getting-started/',
      items: [
        {
          text: 'Makerspace',
          link: '/docs/getting-started/makerspace/',
        },
        {
          text: 'Rules and Safety',
          link: '/docs/getting-started/rules-and-safety/',
        },
        {
          text: 'Induction Overview',
          link: '/docs/getting-started/induction-overview/',
        },

      ]
    }, // }}}
    // {{{2 S2: Exercise Steps
    { 
      text: 'Induction Exercise',
      collapsed: true,
      collapsible: true,
      link: '/docs/exercises/1/',
      items: [ // {{{3 Exercise pages 
        { 
          text: "Board Preparation",
          link: "/docs/exercises/1/",
          collapsible: true,
          collapsed: true,
          items:[
            {
              text: "Prepare Components",
              link: "/docs/exercises/1/step1",
            },
            {
              text: "Apply Solderpaste",
              link: "/docs/exercises/1/step2"
            },
            {
              text: "Inspect",
              link: "/docs/exercises/1/step3"
            },
          ]
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
      ], // }}} 
    }, // }}} 
    // {{{2 S3: Optional  
    { 
      text: "Optional Steps",
      collapsed: true, 
      link: "/docs/optional-steps/",
      items: [ // {{{3 Optional Steps pages  
        {
          text: "Firmware Test",
          link: "/docs/optional-steps/firmware-test/",
        },
        {
          text: "Gamepad Firmware",
          link: "/docs/optional-steps/gamepad-firmware/",
        },
        {
          text: "Custom Code",
          link: "/docs/optional-steps/custom-code/"
        },
      ],// }}} 
    }, // }}}
    // {{{2 S4: Resources
    { 
      text: "Resources, Extras",
      link: "/docs/more/",
      collapsed: true, 
      collapsible: true, 
      items: [ // {{{3 Resources/Extra pages 
        {
          text: "Soldering Examples",
          link: "/docs/more/solder-examples/",
        },
        {
          text: "Assembly Assistant",
          link: "/docs/more/htmlbom/",
        },
        {
          text: "Induction GPIO Pinouts",
          link: "/docs/more/pinouts/",
        },
        {
          text: "Equipment Details",
          link: "/docs/more/equipment/",
        },
        {
          text: "RP2040 Microcontroller",
          link: "/docs/more/rp2040/",
        },
        { 
          text: "Files",
          link: "/docs/more/files/",
        },
        {
          text: "References and Links",
          link: "/docs/more/references-and-links/",
        }
      ] // }}}
    }, // }}}
  ]
} // }}} 
