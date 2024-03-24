import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Kitbag Events | Simple and versatile mapping utility for Typescript",
  description: "A simple and versatile mapping utility for Typescript",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/kitbag-logo-circle.svg',
    siteTitle: 'Kitbag Events',

    sidebar: {
      '/api/': [
        {
          text: 'packages',
          items: [
            { text: '@kitbag/events', link: '/api/modules/kitbag' },
          ],
        },
      ],
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Getting Started',
              link: '/getting-started'
            },
            {
              text: 'Additional Details',
              link: '/additional-details'
            }
          ]
        },
        {
          text: 'API',
          link: '/api'
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kitbagjs/events' }
    ]
  }
})
