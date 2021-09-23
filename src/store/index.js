import { createStore } from 'vuex'
import { editors } from '@/store/editors'
import { console } from '@/store/console'
import { info } from '@/store/info'

export default createStore({
  modules:{
    editors: editors,
    console: console,
    info: info
  }
})
