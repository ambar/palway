import {defineConfig} from 'rspress/config'

export default defineConfig({
  root: 'press',
  title: 'Palway',
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
})
