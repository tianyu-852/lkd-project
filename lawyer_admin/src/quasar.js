import Vue from 'vue'

// http://v0-16.quasarchs.com/

import 'quasar/dist/quasar.css'
import lang from 'quasar/lang/zh-hans.js'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar, Notify } from 'quasar'

Vue.use(Quasar, {
  config: {},
  plugins: {
    Notify
  },
  lang: lang
 })
