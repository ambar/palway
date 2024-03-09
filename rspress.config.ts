import {defineConfig} from 'rspress/config'

export default defineConfig({
  root: 'press',
  title: 'Palway',
  icon: '/favicon.svg',
  route: {
    cleanUrls: true,
  },
  builderConfig: {
    output: {
      // rspack is buggy
      legalComments: 'none',
    },
  },
  themeConfig: {
    search: false,
    // nav: [
    //   {
    //     text: 'Links',
    //     items: [],
    //     position: 'right',
    //   },
    // ],
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://www.github.com/ambar/palway',
      },
    ],
  },
  lang: 'en',
  // The label in nav bar to switch language
  locales: [
    {
      lang: 'en',
      label: 'English',
    },
    {
      lang: 'de',
      label: 'Deutsch',
    },
    {
      lang: 'es',
      label: 'Español',
    },
    {
      lang: 'fr',
      label: 'Français',
    },
    {
      lang: 'it',
      label: 'Italiano',
    },
    {
      lang: 'ko',
      label: '한국어',
    },
    {
      lang: 'pt-BR',
      label: 'Português',
    },
    {
      lang: 'ru',
      label: 'Русский',
    },
    {
      lang: 'zh-Hans',
      label: '简体中文',
    },
    {
      lang: 'zh-Hant',
      label: '繁體中文',
    },
  ],
})
