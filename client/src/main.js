import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Vue3TouchEvents from "vue3-touch-events";
import colors from 'vuetify/lib/util/colors'


import { loadFonts } from './plugins/webfontloader'

import { createPinia } from 'pinia'




const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#EDF2F3',
    surface: '#FFFFFF',
    primary: '#ED6A63',
    //primary: colors.lime.darken1, // #E53935
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    }
  }
});

const pinia = createPinia()
loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(Vue3TouchEvents)
  .mount('#app')

  //clear console on vite's hot relad
  if (import.meta.hot) {
    import.meta.hot.on(
      "vite:beforeUpdate",
      () => console.clear()
    );
  }