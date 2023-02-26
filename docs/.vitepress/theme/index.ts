//import type { App } from 'vue'
import '@anu-vue/preset-theme-default/dist/style.scss'
import { anu } from 'anu-vue'
import 'anu-vue/dist/style.css'
import 'uno.css'
import DefaultTheme from 'vitepress/theme'
//import Api from '../../components/Api.vue'
//import Demo from '../../components/Demo.vue'
//import { extractFileNameFromPath } from '../../utils'
import './style.css'


export default {
  ...DefaultTheme,
  enhanceApp({ app }) {

    app.use(anu);
  },
}
